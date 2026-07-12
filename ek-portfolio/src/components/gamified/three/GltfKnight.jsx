import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { prog } from './progress'
import { activeZone } from './levelPlan'

const MODEL_URL = `${import.meta.env.BASE_URL}models/knight.glb`
const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'

/* KayKit Adventurers Knight (CC0, Kay Lousberg) — modular parts */
const VISIBLE_PARTS = new Set([
  'Knight_Helmet',
  'Knight_Cape',
  'Knight_ArmLeft',
  'Knight_ArmRight',
  'Knight_Body',
  'Knight_Head',
  'Knight_LegLeft',
  'Knight_LegRight',
  '1H_Sword',
  'Round_Shield',
])

const clamp01 = (x) => Math.min(1, Math.max(0, x))

/* Hoisted per-frame scratch (single knight → module singletons are safe;
 * keeps useFrame allocation-free to avoid GC hitches). */
const _lookV = new THREE.Vector3()
const _headEuler = new THREE.Euler()
const _offset = new THREE.Quaternion()
const _headTarget = new THREE.Quaternion()
const WEIGHTS = { Idle: 0, Walking_A: 0, Running_A: 0, Sit_Floor_Idle: 0, Spellcast_Raise: 0, Interact: 0, Cheer: 0 }
const WEIGHT_NAMES = Object.keys(WEIGHTS)

/*
 * Rigged knight driven by the same shared pose ref as the procedural one:
 * animation weights are damped toward targets derived from pose + zone,
 * so scrubbing back and forth stays fully reversible.
 */
export function GltfKnight({ pose }) {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL_URL, DRACO_URL)
  const { actions } = useAnimations(animations, group)
  const headBone = useRef(null)
  const restQuat = useRef(new THREE.Quaternion())

  const fit = useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.visible = VISIBLE_PARTS.has(o.name)
        o.frustumCulled = false
      }
    })
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const height = Math.max(0.001, box.max.y - box.min.y)
    const scale = 2.3 / height // match the world's ~2.3-unit knight
    window.__knightFit = { height, scale, minY: box.min.y, maxY: box.max.y }
    return { scale, yOff: -box.min.y * scale }
  }, [scene])

  useEffect(() => {
    const head = scene.getObjectByName('head') || scene.getObjectByName('Head')
    headBone.current = head || null
    // capture the bone's rest orientation ONCE (before any mixer update) so
    // head tracking is an absolute rest×offset target, never an accumulating
    // multiply into the live quaternion
    if (head) restQuat.current.copy(head.quaternion)
  }, [scene])

  useEffect(() => {
    // start every clip we blend between; weights do the talking
    const names = ['Idle', 'Walking_A', 'Running_A', 'Sit_Floor_Idle', 'Spellcast_Raise', 'Interact', 'Cheer']
    for (const n of names) {
      const a = actions[n]
      if (!a) continue
      a.play()
      a.setEffectiveWeight(n === 'Idle' ? 1 : 0)
    }
  }, [actions])

  useFrame((state, dt) => {
    const m = pose.current
    const { zone: z, localT: t } = activeZone(prog.s)

    // arrival gesture at quest checkpoints (flag-plant window)
    const interact =
      z && z.kind === 'quest'
        ? THREE.MathUtils.smoothstep(t, 0.1, 0.16) * (1 - THREE.MathUtils.smoothstep(t, 0.3, 0.38))
        : 0
    // celebratory cheer while the portal opens
    const cheer =
      z && z.id === 'portal'
        ? THREE.MathUtils.smoothstep(t, 0.42, 0.52) * (1 - THREE.MathUtils.smoothstep(t, 0.72, 0.82))
        : 0

    const run = THREE.MathUtils.smoothstep(m.walk, 0.6, 0.95)
    const walk = clamp01(m.walk * 1.4) - run
    const overlay = clamp01(m.sit + m.raise + interact + cheer)
    const idle = clamp01(1 - walk - run - overlay)

    WEIGHTS.Idle = idle
    WEIGHTS.Walking_A = walk * (1 - overlay)
    WEIGHTS.Running_A = run * (1 - overlay)
    WEIGHTS.Sit_Floor_Idle = m.sit
    WEIGHTS.Spellcast_Raise = m.raise
    WEIGHTS.Interact = interact
    WEIGHTS.Cheer = cheer
    const k = 1 - Math.exp(-dt * 8)
    for (let i = 0; i < WEIGHT_NAMES.length; i++) {
      const name = WEIGHT_NAMES[i]
      const a = actions[name]
      if (!a) continue
      a.setEffectiveWeight(THREE.MathUtils.lerp(a.getEffectiveWeight(), WEIGHTS[name], k))
    }
    // feet track real ground speed
    const loco = actions.Walking_A
    if (loco) loco.timeScale = THREE.MathUtils.clamp(Math.abs(prog.vel) / 2.2, 0.6, 1.8)
    if (actions.Running_A) actions.Running_A.timeScale = THREE.MathUtils.clamp(Math.abs(prog.vel) / 4.5, 0.8, 1.6)

    // head tracks the cursor firefly when idling — ABSOLUTE target
    // (restQuat × clamped offset), slerped in. Never multiply into the live
    // quaternion: when a blended clip under-writes the head bone, a
    // multiplicative offset compounds frame-over-frame → runaway spin.
    const head = headBone.current
    if (head) {
      const canTrack = m.lookAt && idle > 0.6 && overlay < 0.01 && prog.introT > 2.5
      if (canTrack) {
        _lookV.copy(m.lookAt)
        head.parent.worldToLocal(_lookV)
        _lookV.sub(head.position)
        const yaw = THREE.MathUtils.clamp(Math.atan2(_lookV.x, _lookV.z), -0.8, 0.8)
        const pitch = THREE.MathUtils.clamp(
          -Math.atan2(_lookV.y, Math.hypot(_lookV.x, _lookV.z)) + 0.35,
          -0.5,
          0.4,
        )
        _headEuler.set(pitch * 0.6, yaw * 0.7, 0)
        _offset.setFromEuler(_headEuler)
        _headTarget.copy(restQuat.current).multiply(_offset)
        head.quaternion.slerp(_headTarget, 1 - Math.exp(-dt * 6))
      } else if (idle > 0.6) {
        // idle but not tracking (spawn / no cursor): ease home to rest
        head.quaternion.slerp(restQuat.current, 1 - Math.exp(-dt * 4))
      }
      // during walk / run / sit / raise / cheer, leave the head to the mixer
    }
  })

  return (
    <group ref={group} scale={fit.scale} position={[0, fit.yOff, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL, DRACO_URL)
