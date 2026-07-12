import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { workProjects } from '../../../../data/portfolio'
import { zone } from '../levelMap'
import { HoloPanel, Flag, SparkBurst, ZonePulseLight, CullGroup, nearZone, zt, seg } from './common'

/* hoisted colours — avoid allocating a THREE.Color per tile per frame */
const TILE_BASE = new THREE.Color('#2a2344')
const TILE_HOT = new THREE.Color('#f472b6')

/* Shared quest-log hologram content */
function QuestPanel({ zoneId, project, color }) {
  return (
    <HoloPanel zoneId={zoneId} position={[0, 4.6, 0]} width={500} on={0.52} cleared={0.72} distanceFactor={7.5} className={`holo--${zoneId}`}>
      <div className="holo-head">
        <span>QUEST #{project.num}</span>
        <span>{project.year}</span>
      </div>
      <h3 className="holo-title">{project.title}</h3>
      <p className="holo-guild">Guild: {project.company}</p>
      <p className="holo-desc">{project.description}</p>
      <ul className="holo-impact">
        {project.impact.slice(0, 4).map((line, i) => (
          <li key={line} style={{ transitionDelay: `${0.5 + i * 0.35}s` }}>
            <em>+XP</em> {line}
          </li>
        ))}
      </ul>
      <div className="holo-tags">
        {project.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="holo-stamp" style={{ borderColor: color, color }}>★ QUEST CLEARED</div>
    </HoloPanel>
  )
}

/* ── QUEST 01 · The Forge of Streams (ForgeAI) ─────────────────────────
   An anvil that emits literal streams of glowing glyphs — SSE made physical. */
function GlyphStreams({ zoneId }) {
  const N = 40
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        lane: i % 3,
        off: Math.random(),
        s: 0.07 + Math.random() * 0.07,
        wob: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = state.clock.elapsedTime
    const on = 0.25 + zt(zoneId) * 0.75
    seeds.forEach((sd, i) => {
      const u = (t * 0.14 + sd.off) % 1
      const lane = sd.lane - 1
      // arc: rise from the anvil, bend downstream
      const x = lane * 0.5 + Math.sin(u * 6 + sd.wob) * 0.2
      const y = 1.1 + u * 3.4
      const z = u * u * 2.2 * lane * 0.6 + Math.sin(u * 9 + sd.wob) * 0.15
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(sd.s * (1 - u * 0.7) * on)
      dummy.rotation.set(u * 8, sd.wob, 0)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#fbbf24" toneMapped={false} />
    </instancedMesh>
  )
}

export function ForgeZone() {
  const z = zone('forge')
  const ember = useRef()

  useFrame((state) => {
    if (!nearZone('forge')) return
    if (ember.current) ember.current.intensity = 26 + Math.sin(state.clock.elapsedTime * 5.3) * 6
  })

  return (
    <CullGroup zoneId="forge" position={z.anchor}>
      {/* stone base + anvil */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.4, 0.6, 3]} />
        <meshStandardMaterial color="#221f38" flatShading />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.2, 0.35, 0.8]} />
        <meshStandardMaterial color="#2b3350" metalness={0.55} flatShading />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.7, 0.28, 0.6]} />
        <meshStandardMaterial color="#3a4468" metalness={0.6} flatShading />
      </mesh>
      {/* molten seam */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.5]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>
      {/* braziers */}
      {[-1.9, 1.9].map((x) => (
        <group key={x} position={[x, 0, 0.8]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.16, 1.2, 0.16]} />
            <meshStandardMaterial color="#2b3350" flatShading />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.34, 0.22, 0.34]} />
            <meshBasicMaterial color="#f59e0b" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <GlyphStreams zoneId="forge" />
      <pointLight ref={ember} position={[0, 1.6, 0]} color="#f59e0b" intensity={26} distance={12} />
      <ZonePulseLight zoneId="forge" position={[0, 3.2, 2]} color="#fbbf24" base={14} />
      <Flag zoneId="forge" position={[4.2, 0, -2]} color="#f59e0b" />
      <SparkBurst zoneId="forge" position={[0, 0.8, 0]} color="#fbbf24" />
      <QuestPanel zoneId="forge" project={workProjects[0]} color="#f59e0b" />
    </CullGroup>
  )
}

/* ── QUEST 02 · The Spark Obelisk (Yeedu) ──────────────────────────────
   A floating monolith with orbiting spark shards. */
function OrbitShards({ zoneId }) {
  const N = 14
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        a0: (i / N) * Math.PI * 2,
        r: 1.6 + (i % 3) * 0.55,
        y: 1.6 + (i % 4) * 0.75,
        sp: 0.4 + (i % 3) * 0.2,
        s: 0.1 + Math.random() * 0.12,
      })),
    [],
  )

  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = state.clock.elapsedTime
    const on = 0.35 + zt(zoneId) * 0.65
    seeds.forEach((sd, i) => {
      const a = sd.a0 + t * sd.sp
      dummy.position.set(Math.cos(a) * sd.r, sd.y + Math.sin(t * 1.3 + sd.a0) * 0.2, Math.sin(a) * sd.r)
      dummy.scale.setScalar(sd.s * on)
      dummy.rotation.set(t * sd.sp * 2, a, 0)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#0e7490" emissive="#22d3ee" emissiveIntensity={0.9} flatShading />
    </instancedMesh>
  )
}

export function ObeliskZone() {
  const z = zone('obelisk')
  const column = useRef()

  useFrame((state) => {
    if (!nearZone('obelisk')) return
    const t = state.clock.elapsedTime
    if (column.current) {
      column.current.position.y = 2.4 + Math.sin(t * 0.9) * 0.15
      column.current.rotation.y = t * 0.25
    }
  })

  return (
    <CullGroup zoneId="obelisk" position={z.anchor}>
      {/* base ring platform */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.4, 2.7, 0.3, 8]} />
        <meshStandardMaterial color="#221f38" flatShading />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.1, 8]} />
        <meshStandardMaterial color="#164e63" emissive="#22d3ee" emissiveIntensity={0.15} flatShading />
      </mesh>
      {/* floating column */}
      <group ref={column} position={[0, 2.4, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 3.4, 0.9]} />
          <meshStandardMaterial color="#1d2b45" emissive="#22d3ee" emissiveIntensity={0.22} metalness={0.5} flatShading />
        </mesh>
        <mesh position={[0, 2.05, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#164e63" emissive="#22d3ee" emissiveIntensity={1.1} flatShading />
        </mesh>
        {/* rune slits */}
        {[-0.9, 0, 0.9].map((y) => (
          <mesh key={y} position={[0, y, 0.46]}>
            <boxGeometry args={[0.5, 0.08, 0.03]} />
            <meshStandardMaterial color="#164e63" emissive="#67e8f9" emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>
      <OrbitShards zoneId="obelisk" />
      <ZonePulseLight zoneId="obelisk" position={[0, 3, 2]} color="#22d3ee" base={20} />
      <Flag zoneId="obelisk" position={[-4.2, 0, -2]} color="#22d3ee" />
      <SparkBurst zoneId="obelisk" position={[0, 1.2, 0]} color="#67e8f9" />
      <QuestPanel zoneId="obelisk" project={workProjects[1]} color="#22d3ee" />
    </CullGroup>
  )
}

/* ── QUEST 03 · The Dashboard Ruins (Epsilon) ──────────────────────────
   Broken terminal pillars; floor tiles ignite in a wave as you arrive. */
function WaveTiles({ zoneId }) {
  const COLS = 6
  const ROWS = 4
  const N = COLS * ROWS
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = state.clock.elapsedTime
    const on = zt(zoneId)
    for (let i = 0; i < N; i++) {
      const cx = (i % COLS) - (COLS - 1) / 2
      const cz = Math.floor(i / COLS) - (ROWS - 1) / 2
      const d = Math.hypot(cx, cz) / 4
      const lit = seg(on, 0.15 + d * 0.35, 0.3 + d * 0.35)
      dummy.position.set(cx * 0.95, 0.05 + lit * 0.06, cz * 0.95)
      dummy.scale.set(0.42, 0.06 + lit * 0.1, 0.42)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      color.copy(TILE_BASE).lerp(TILE_HOT, lit * (0.7 + Math.sin(t * 2 + i) * 0.15))
      mesh.current.setColorAt(i, color)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

export function RuinsZone() {
  const z = zone('ruins')
  const pillars = useMemo(
    () => [
      { x: -2.2, z: -1.4, h: 2.6, tilt: 0.06 },
      { x: 2.4, z: -0.8, h: 1.6, tilt: -0.12 },
      { x: -1.6, z: 1.6, h: 1.1, tilt: 0.18 },
      { x: 1.8, z: 1.8, h: 2.1, tilt: -0.05 },
      { x: 0.2, z: -2.2, h: 3.1, tilt: 0.02 },
    ],
    [],
  )

  return (
    <CullGroup zoneId="ruins" position={z.anchor}>
      <WaveTiles zoneId="ruins" />
      {pillars.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, i, p.tilt]}>
          <mesh position={[0, p.h / 2, 0]}>
            <cylinderGeometry args={[0.3, 0.38, p.h, 6]} />
            <meshStandardMaterial color="#2a2344" flatShading />
          </mesh>
          {/* cracked screen band */}
          <mesh position={[0, p.h * 0.72, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.18, 6]} />
            <meshBasicMaterial color="#f472b6" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <ZonePulseLight zoneId="ruins" position={[0, 2.6, 1.5]} color="#f472b6" base={18} />
      <Flag zoneId="ruins" position={[4.4, 0, -2]} color="#f472b6" />
      <SparkBurst zoneId="ruins" position={[0, 0.6, 0]} color="#f9a8d4" />
      <QuestPanel zoneId="ruins" project={workProjects[2]} color="#f472b6" />
    </CullGroup>
  )
}
