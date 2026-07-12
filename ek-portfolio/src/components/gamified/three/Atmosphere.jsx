import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { prog } from './progress'
import { curve, LENGTH, ZONES } from './levelMap'

/* Sky / fog keyframes across the journey: dusk → night → ember → sunrise */
const STOPS = [
  { p: 0.0, bg: '#141327', fog: '#141327', amb: '#8b93c4', ambI: 0.5 },
  { p: 0.3, bg: '#0f0e1a', fog: '#0f0e1a', amb: '#7d86c0', ambI: 0.45 },
  { p: 0.62, bg: '#0a0912', fog: '#0a0912', amb: '#5d5a8a', ambI: 0.38 },
  { p: 0.8, bg: '#161226', fog: '#161226', amb: '#8a7aa8', ambI: 0.45 },
  { p: 1.0, bg: '#2a1b2e', fog: '#2a1b2e', amb: '#d4a373', ambI: 0.6 },
]

const _a = new THREE.Color()
const _b = new THREE.Color()

export function AtmosphereDriver() {
  const scene = useThree((s) => s.scene)
  const amb = useRef()

  useFrame(() => {
    const p = prog.s
    let i = 0
    while (i < STOPS.length - 2 && p > STOPS[i + 1].p) i++
    const s0 = STOPS[i]
    const s1 = STOPS[i + 1]
    const t = THREE.MathUtils.clamp((p - s0.p) / (s1.p - s0.p), 0, 1)

    _a.set(s0.bg).lerp(_b.set(s1.bg), t)
    if (scene.background?.isColor) scene.background.copy(_a)
    if (scene.fog) scene.fog.color.set(s0.fog).lerp(_b.set(s1.fog), t)
    if (amb.current) {
      amb.current.color.set(s0.amb).lerp(_b.set(s1.amb), t)
      amb.current.intensity = THREE.MathUtils.lerp(s0.ambI, s1.ambI, t)
    }
  })

  return <ambientLight ref={amb} intensity={0.5} color="#8b93c4" />
}

export function Stars() {
  const geo = useMemo(() => {
    const N = 700
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 60 + Math.random() * 80
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = 8 + Math.random() * 70
      pos[i * 3 + 2] = -Math.random() * 220 + 20
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial size={0.35} color="#cdd8ec" transparent opacity={0.7} sizeAttenuation fog={false} />
    </points>
  )
}

/* Road ribbon along the curve: dark deck + glowing amber edge lines */
function ribbonGeometry(width, yOff) {
  const N = 240
  const pos = new Float32Array((N + 1) * 2 * 3)
  const idx = []
  const up = new THREE.Vector3(0, 1, 0)
  const pt = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const side = new THREE.Vector3()
  for (let i = 0; i <= N; i++) {
    const u = i / N
    curve.getPointAt(u, pt)
    curve.getTangentAt(u, tan)
    side.crossVectors(up, tan).normalize()
    const o = i * 6
    pos[o] = pt.x + side.x * width
    pos[o + 1] = yOff
    pos[o + 2] = pt.z + side.z * width
    pos[o + 3] = pt.x - side.x * width
    pos[o + 4] = yOff
    pos[o + 5] = pt.z - side.z * width
    if (i < N) {
      const k = i * 2
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function edgeGeometry(offset, yOff) {
  const N = 240
  const pos = new Float32Array((N + 1) * 3)
  const up = new THREE.Vector3(0, 1, 0)
  const pt = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const side = new THREE.Vector3()
  for (let i = 0; i <= N; i++) {
    curve.getPointAt(i / N, pt)
    curve.getTangentAt(i / N, tan)
    side.crossVectors(up, tan).normalize()
    pos[i * 3] = pt.x + side.x * offset
    pos[i * 3 + 1] = yOff
    pos[i * 3 + 2] = pt.z + side.z * offset
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  return g
}

export function Road() {
  const deck = useMemo(() => ribbonGeometry(1.6, 0.02), [])
  const edgeL = useMemo(() => edgeGeometry(1.7, 0.04), [])
  const edgeR = useMemo(() => edgeGeometry(-1.7, 0.04), [])

  return (
    <group>
      <mesh geometry={deck}>
        <meshStandardMaterial color="#1b1830" metalness={0.4} roughness={0.6} />
      </mesh>
      <line geometry={edgeL}>
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.55} />
      </line>
      <line geometry={edgeR}>
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.55} />
      </line>
    </group>
  )
}

export function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -85]}>
        <planeGeometry args={[300, 320]} />
        <meshStandardMaterial color="#12101f" metalness={0.55} roughness={0.55} />
      </mesh>
      <gridHelper args={[340, 130, '#4a3a70', '#221d3d']} position={[0, 0, -85]} />
    </group>
  )
}

/* Waymarker pylons pulsing along the road so travel reads even mid-segment */
export function Waymarkers() {
  const N = 26
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const items = useMemo(() => {
    const arr = []
    const pt = new THREE.Vector3()
    const tan = new THREE.Vector3()
    const side = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < N; i++) {
      const d = (i / N) * LENGTH
      // keep pylons clear of monuments so the orbit camera never clips one
      if (ZONES.some((z) => z.id !== 'spawn' && Math.abs(d - z.anchorDist) < 14)) continue
      curve.getPointAt(d / LENGTH, pt)
      curve.getTangentAt(d / LENGTH, tan)
      side.crossVectors(up, tan).normalize()
      const sgn = i % 2 === 0 ? 1 : -1
      arr.push({ x: pt.x + side.x * 2.6 * sgn, z: pt.z + side.z * 2.6 * sgn, d })
    }
    return arr
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      const near = Math.max(0, 1 - Math.abs(it.d - prog.dist) / 18)
      const s = 0.7 + near * 0.5 + Math.sin(t * 2 + i) * 0.05 * near
      dummy.position.set(it.x, 0.55 * s, it.z)
      dummy.scale.set(0.16, 0.55 * s, 0.16)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh key={items.length} ref={mesh} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2b2650" emissive="#f59e0b" emissiveIntensity={0.5} />
    </instancedMesh>
  )
}
