import { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prog } from './progress'
import { chiptune } from '../audio/chiptune'
import { useQuestStore } from '../state/useQuestStore'

/*
 * Procedural low-poly knight v2 (placeholder until a rigged glTF swap).
 * Driven entirely by a mutable `pose` ref:
 *   walk  0..1  stride intensity (from real travel velocity — no foot slide)
 *   phase       stride phase (radians, advanced by distance not time)
 *   sit   0..1  campfire sitting blend
 *   raise 0..1  sword-raise blend (armory / level up)
 *   lookAt      world-space point the head tracks (cursor firefly), or null
 */

const COL = {
  armor: '#4a5578',
  armorDark: '#2b3350',
  trim: '#f59e0b',
  plume: '#f472b6',
  visor: '#0f0e1a',
  skin: '#d8a878',
  blade: '#cdd8ec',
  cyan: '#22d3ee',
}

function Box({ args, position, rotation, color, emissive, emissiveIntensity = 0, metalness = 0.25, roughness = 0.55 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || '#000000'}
        emissiveIntensity={emissiveIntensity}
        metalness={metalness}
        roughness={roughness}
        flatShading
      />
    </mesh>
  )
}

const _headTarget = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _m = new THREE.Matrix4()

export const Knight = forwardRef(function Knight({ pose }, ref) {
  const root = useRef()
  const hips = useRef()
  const torso = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const head = useRef()
  const plume = useRef()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const m = pose.current
    const walk = m.walk
    const phase = m.phase
    const sit = m.sit
    const raise = m.raise

    if (!root.current) return

    // body: idle breathing + stride bounce + sit drop
    const breathe = Math.sin(t * 1.6) * 0.015
    const bounce = Math.abs(Math.sin(phase)) * 0.1 * walk
    root.current.position.y = breathe + bounce - sit * 0.52
    root.current.rotation.z = Math.sin(t * 0.9) * 0.02 * (1 - sit)
    root.current.rotation.x = walk * 0.09 - sit * 0.12

    // stride — legs counter-swing; when sitting, both fold forward
    const swing = Math.sin(phase) * 0.75 * walk
    legL.current.rotation.x = THREE.MathUtils.lerp(swing, -1.45, sit)
    legR.current.rotation.x = THREE.MathUtils.lerp(-swing, -1.35, sit)

    // torso counter-rotation gives the gait weight
    torso.current.rotation.y = Math.sin(phase) * 0.12 * walk
    torso.current.rotation.x = sit * 0.1

    // shield arm swings with stride; folds onto lap when sitting
    armL.current.rotation.x = THREE.MathUtils.lerp(-swing * 0.8, -0.9, sit)
    // sword arm: guard sway → full raise (armory salute / level up)
    const guard = swing * 0.3 + Math.sin(t * 1.6) * 0.03
    armR.current.rotation.x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(guard, -0.7, sit), -Math.PI * 0.72, raise)
    armR.current.rotation.z = raise * -0.15

    // head: track a world-space target (cursor firefly) when idle
    if (m.lookAt && walk < 0.25 && sit < 0.5) {
      _headTarget.copy(m.lookAt)
      head.current.parent.updateWorldMatrix(true, false)
      _m.copy(head.current.parent.matrixWorld).invert()
      _headTarget.applyMatrix4(_m)
      _headTarget.sub(head.current.position)
      const yaw = THREE.MathUtils.clamp(Math.atan2(_headTarget.x, _headTarget.z), -0.9, 0.9)
      const pitch = THREE.MathUtils.clamp(-Math.atan2(_headTarget.y, Math.hypot(_headTarget.x, _headTarget.z)), -0.5, 0.35)
      _q.setFromEuler(new THREE.Euler(pitch, yaw, 0))
      head.current.quaternion.slerp(_q, 1 - Math.exp(-dt * 6))
    } else {
      _q.identity()
      head.current.quaternion.slerp(_q, 1 - Math.exp(-dt * 4))
    }

    // plume trails the motion
    plume.current.rotation.z = Math.sin(t * 2 + phase) * 0.12 + walk * 0.18
    plume.current.rotation.x = -walk * 0.15
  })

  return (
    <group ref={ref}>
      <group ref={root}>
        {/* legs (hip pivot y=0.9) */}
        <group ref={hips}>
          <group ref={legL} position={[-0.18, 0.9, 0]}>
            <Box args={[0.26, 0.9, 0.28]} position={[0, -0.45, 0]} color={COL.armorDark} />
            <Box args={[0.3, 0.16, 0.36]} position={[0, -0.9, 0.04]} color={COL.trim} metalness={0.4} />
          </group>
          <group ref={legR} position={[0.18, 0.9, 0]}>
            <Box args={[0.26, 0.9, 0.28]} position={[0, -0.45, 0]} color={COL.armorDark} />
            <Box args={[0.3, 0.16, 0.36]} position={[0, -0.9, 0.04]} color={COL.trim} metalness={0.4} />
          </group>
        </group>

        <group ref={torso} position={[0, 1.28, 0]}>
          <Box args={[0.62, 0.7, 0.4]} position={[0, 0, 0]} color={COL.armor} metalness={0.35} />
          <Box args={[0.5, 0.12, 0.42]} position={[0, 0.22, 0.01]} color={COL.trim} metalness={0.45} />
          <Box args={[0.66, 0.12, 0.44]} position={[0, -0.3, 0]} color={COL.armorDark} />
          <Box args={[0.14, 0.14, 0.06]} position={[0, 0.02, 0.22]} color={COL.cyan} emissive={COL.cyan} emissiveIntensity={0.8} />
          {/* pauldrons */}
          <Box args={[0.24, 0.22, 0.44]} position={[-0.42, 0.27, 0]} color={COL.armor} metalness={0.4} />
          <Box args={[0.24, 0.22, 0.44]} position={[0.42, 0.27, 0]} color={COL.armor} metalness={0.4} />

          {/* shield arm */}
          <group ref={armL} position={[-0.44, 0.22, 0]}>
            <Box args={[0.2, 0.62, 0.22]} position={[0, -0.32, 0]} color={COL.armorDark} />
            <group position={[-0.16, -0.4, 0.16]}>
              <Box args={[0.08, 0.7, 0.55]} color={COL.armor} metalness={0.5} />
              <Box args={[0.1, 0.16, 0.16]} position={[-0.02, 0, 0]} color={COL.trim} emissive={COL.trim} emissiveIntensity={0.3} />
            </group>
          </group>

          {/* sword arm */}
          <group ref={armR} position={[0.44, 0.22, 0]}>
            <Box args={[0.2, 0.62, 0.22]} position={[0, -0.32, 0]} color={COL.armorDark} />
            <group position={[0.06, -0.5, 0.12]}>
              <Box args={[0.06, 0.28, 0.06]} color={COL.trim} />
              <Box args={[0.34, 0.07, 0.09]} position={[0, 0.16, 0]} color={COL.trim} metalness={0.5} />
              <Box args={[0.11, 1.15, 0.05]} position={[0, 0.78, 0]} color={COL.blade} emissive={COL.cyan} emissiveIntensity={0.35} metalness={0.7} roughness={0.3} />
            </group>
          </group>

          {/* head + helm (own pivot for cursor tracking) */}
          <group ref={head} position={[0, 0.42, 0]}>
            <Box args={[0.32, 0.3, 0.32]} position={[0, 0.12, 0]} color={COL.skin} />
            <Box args={[0.42, 0.34, 0.42]} position={[0, 0.22, 0]} color={COL.armor} metalness={0.45} />
            <Box args={[0.44, 0.06, 0.06]} position={[0, 0.18, 0.2]} color={COL.visor} />
            <group ref={plume} position={[0, 0.42, 0]}>
              <Box args={[0.1, 0.1, 0.1]} color={COL.trim} />
              <Box args={[0.12, 0.4, 0.12]} position={[0, 0.25, -0.05]} color={COL.plume} emissive={COL.plume} emissiveIntensity={0.4} />
              <Box args={[0.1, 0.28, 0.1]} position={[0, 0.5, -0.14]} color={COL.plume} emissive={COL.plume} emissiveIntensity={0.5} />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
})

/* Footstep dust — tiny pooled instanced puffs emitted on stride contacts */
export function FootDust({ knightRef }) {
  const N = 24
  const mesh = useRef()
  const pool = useRef(
    Array.from({ length: N }, () => ({ life: 1e9, x: 0, y: 0, z: 0, vx: 0, vz: 0, s: 1 })),
  )
  const lastStep = useRef(0)
  const dummy = useRef(new THREE.Object3D()).current

  useFrame((_, dt) => {
    const m = prog
    // stride contact ≈ each half-cycle of phase while actually walking
    const step = Math.floor(m.phase / Math.PI)
    if (step !== lastStep.current && m.walk > 0.3 && knightRef.current) {
      lastStep.current = step
      if (useQuestStore.getState().soundOn) chiptune.sfx.footstep()
      const kp = knightRef.current.position
      for (let k = 0; k < 3; k++) {
        const p = pool.current.find((q) => q.life > 0.6)
        if (!p) break
        p.life = 0
        p.x = kp.x + (Math.random() - 0.5) * 0.5
        p.y = 0.05
        p.z = kp.z + (Math.random() - 0.5) * 0.5
        p.vx = (Math.random() - 0.5) * 0.8
        p.vz = (Math.random() - 0.5) * 0.8 + m.vel * 0.05
        p.s = 0.1 + Math.random() * 0.12
      }
    }
    pool.current.forEach((p, i) => {
      p.life += dt * 1.8
      const a = Math.max(0, 1 - p.life)
      p.x += p.vx * dt
      p.z += p.vz * dt
      p.y += dt * 0.5
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(a > 0 ? p.s * (1 + p.life * 2) : 0)
      dummy.rotation.set(p.life, p.life * 1.3, 0)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6b6480" transparent opacity={0.35} />
    </instancedMesh>
  )
}
