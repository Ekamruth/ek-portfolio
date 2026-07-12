import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { prog } from '../progress'
import { ZONES, zone, activeZone } from '../levelMap'
import { useQuestStore } from '../../state/useQuestStore'
import { htmlPortal } from '../World'

/*
 * Distance culling. Every zone's useFrames + instanced meshes + drei Html
 * used to run every frame regardless of where the knight was. `nearZone`
 * gates that work by arc-length distance from the zone's road anchor.
 *   - CULL_RANGE (meshes): must exceed the fog far plane (46) so geometry
 *     is already faded when it starts/stops animating — no visible pop.
 *   - PANEL_RANGE (drei Html): tighter — the DOM projection is the priciest
 *     always-on cost, and panels only matter when you're in the zone.
 */
export const CULL_RANGE = 48
export const PANEL_RANGE = 34
// The first ~2.2s (spawn intro, behind the boot screen / render-in) counts as
// "near" for EVERY zone, so their useFrames run and their meshes draw once up
// front — instance buffers allocate + upload and shaders compile there,
// turning first-approach lurches into one quiet warm-up at load.
export const nearZone = (id, range = CULL_RANGE) =>
  prog.introT < 2.2 || Math.abs((zone(id)?.anchorDist ?? 0) - prog.dist) < range

/* Group whose `visible` flag follows nearZone — three skips invisible
 * subtrees entirely, so far zones cost nothing to render. During the first
 * ~2.2s (the spawn intro, still behind the boot screen / render-in) every
 * zone is forced visible so its geometry uploads to the GPU up front — that
 * turns the "first time a zone renders" compile/upload hitch into one quiet
 * cost at load instead of a lurch when you first scroll into each zone.
 * (nearZone already treats the intro window as "near" for the warm-up.) */
export function CullGroup({ zoneId, range = CULL_RANGE, children, ...props }) {
  const g = useRef()
  useFrame(() => {
    if (g.current) g.current.visible = nearZone(zoneId, range)
  })
  return (
    <group ref={g} {...props}>
      {children}
    </group>
  )
}

/* Panels are cheap to *project* each frame but expensive to mount/unmount
 * mid-scroll: the React reconcile + drei Html DOM churn lands as a visible
 * hitch right between checkpoints (exactly where a panel's range boundary
 * falls). So every panel mounts once, up front behind the boot screen, and
 * never unmounts — the heavy geometry is still distance-culled by CullGroup
 * and each zone's useFrame still early-returns via nearZone. Kept as a hook
 * so callers don't change if we ever reintroduce debounced unmounting. */
export function useZoneNear() {
  return true
}

/*
 * ZoneDirector — one useFrame that computes every zone's local timeline
 * (0 before, scrubbed 0..1 while inside, 1 after) into prog.zoneT, and
 * fires the one-shot store events (clears, level-up, achievements).
 */
export function ZoneDirector() {
  const fired = useRef({})

  useFrame(() => {
    const { zone: az, localT } = activeZone(prog.s)
    const store = useQuestStore.getState()
    if (!prog.zoneT) prog.zoneT = {}

    for (const z of ZONES) {
      const tt = az?.id === z.id ? localT : prog.s > z.p1 ? 1 : 0
      prog.zoneT[z.id] = tt

      if (z.id !== 'spawn' && tt > 0.55 && !fired.current[z.id]) {
        fired.current[z.id] = true
        store.clearZone(z.id)
        if (z.id === 'portal') {
          store.levelUp()
          store.achieve('portal', 'COMPLETIONIST — reached the portal gate')
          if (store.runStartedAt && performance.now() - store.runStartedAt < 30000) {
            store.achieve('speedrun', 'SPEEDRUNNER — any% under 30s')
          }
        }
      }
    }

    if (
      fired.current.forge && fired.current.obelisk && fired.current.ruins &&
      !fired.current._quests
    ) {
      fired.current._quests = true
      store.achieve('quests', 'QUEST LOG COMPLETE — all quests cleared')
    }
  })

  return null
}

export const zt = (id) => prog.zoneT?.[id] ?? 0
export const seg = (t, a, b) => THREE.MathUtils.smoothstep(t, a, b)

/*
 * HoloPanel — diegetic DOM: crisp text perspective-anchored in the world.
 * Classes are toggled imperatively at 60fps (no React re-renders).
 * `on` / `cleared` are functions of the zone's local timeline.
 */
export function HoloPanel({ zoneId, position, width = 340, on = 0.24, cleared = 0.58, interactive = false, distanceFactor = 7, children, className = '' }) {
  const div = useRef()
  const near = useZoneNear(zoneId)

  useFrame(() => {
    if (!near) return
    const t = zt(zoneId)
    const el = div.current
    if (!el) return
    el.classList.toggle('holo--on', t > on)
    el.classList.toggle('holo--cleared', t > cleared)
  })

  if (!near) return null

  return (
    <Html
      position={position}
      center
      portal={htmlPortal}
      distanceFactor={distanceFactor}
      zIndexRange={[30, 0]}
    >
      <div
        ref={div}
        className={`holo ${className}`}
        style={{ width, pointerEvents: interactive ? 'auto' : 'none' }}
      >
        {children}
      </div>
    </Html>
  )
}

/* Quest banner: pole + flag that unfurls when the checkpoint is reached */
export function Flag({ zoneId, position, color = '#f59e0b' }) {
  const cloth = useRef()
  const glow = useRef()

  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = zt(zoneId)
    const plant = seg(t, 0.14, 0.3)
    if (cloth.current) {
      cloth.current.scale.set(plant, plant, 1)
      cloth.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.2) * 0.06 * plant
    }
    if (glow.current) glow.current.intensity = plant * (8 + Math.sin(state.clock.elapsedTime * 3) * 2)
  })

  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.09, 2.8, 0.09]} />
        <meshStandardMaterial color="#2b3350" metalness={0.4} flatShading />
      </mesh>
      <group position={[0.02, 2.45, 0]}>
        <mesh ref={cloth} position={[0.45, 0, 0]}>
          <planeGeometry args={[0.9, 0.6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} side={THREE.DoubleSide} flatShading />
        </mesh>
      </group>
      <pointLight ref={glow} position={[0, 2.4, 0.5]} color={color} intensity={0} distance={6} />
    </group>
  )
}

/* Scrub-driven radial spark burst on checkpoint clear (reversible) */
export function SparkBurst({ zoneId, position, color = '#fbbf24', from = 0.16, to = 0.5, count = 22 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const dirs = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2
        const el = Math.random() * Math.PI * 0.5
        return {
          x: Math.cos(a) * Math.cos(el),
          y: Math.sin(el) + 0.4,
          z: Math.sin(a) * Math.cos(el),
          sp: 2 + Math.random() * 3.5,
          s: 0.05 + Math.random() * 0.08,
        }
      }),
    [count],
  )

  useFrame(() => {
    if (!nearZone(zoneId)) return
    const t = zt(zoneId)
    const k = seg(t, from, to)
    const fade = 1 - seg(t, to - 0.08, to)
    dirs.forEach((d, i) => {
      const r = k * d.sp
      dummy.position.set(d.x * r, 0.5 + d.y * r - k * k * 1.2, d.z * r)
      dummy.scale.setScalar(k > 0.01 ? d.s * fade : 0)
      dummy.rotation.set(r * 3, r * 2, 0)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={position} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  )
}

/* Light that breathes while its zone is active; audio beats can spike it */
export function ZonePulseLight({ zoneId, position, color, base = 18, distance = 16 }) {
  const light = useRef()
  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = zt(zoneId)
    const active = t > 0.02 && t < 1 ? 1 : 0.45
    const beat = prog.beatPulse ?? 0
    if (light.current) {
      light.current.intensity =
        base * active * (0.8 + Math.sin(state.clock.elapsedTime * 2.4) * 0.12 + beat * 0.5)
    }
  })
  return <pointLight ref={light} position={position} color={color} intensity={base} distance={distance} />
}
