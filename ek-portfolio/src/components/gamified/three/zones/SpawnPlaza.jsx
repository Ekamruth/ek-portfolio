import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prog } from '../progress'
import { seg, nearZone, CullGroup } from './common'

/* 5×7 bitmap glyphs for the voxel name */
const GLYPHS = {
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
}

const NAME = 'EKAMRUTH'
const VOX = 0.26

/*
 * The name assembles overhead from curl-noise chaos as the world boots,
 * then scatters behind as the knight leaves the plaza.
 */
export function NameVoxels() {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const targets = useMemo(() => {
    const out = []
    let cx = 0
    for (const ch of NAME) {
      const rows = GLYPHS[ch]
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          if (rows[r][c] === '1') out.push({ x: (cx + c) * VOX, y: (6 - r) * VOX })
        }
      }
      cx += 6
    }
    const w = (cx - 1) * VOX
    // chaos start: swirl cloud + per-voxel stagger
    return out.map((t, i) => {
      const a = Math.random() * Math.PI * 2
      const r = 6 + Math.random() * 10
      return {
        tx: t.x - w / 2,
        ty: t.y + 4.6,
        tz: -7,
        sx: Math.cos(a) * r,
        sy: 2 + Math.random() * 12,
        sz: -6 + Math.sin(a) * r,
        delay: (i / out.length) * 0.5,
        spin: Math.random() * Math.PI * 2,
      }
    })
  }, [])

  useFrame(() => {
    if (!nearZone('spawn')) return
    const assembleT = seg((prog.introT - 0.6) / 2.4, 0, 1)
    const scatter = seg(prog.s, 0.055, 0.1)
    targets.forEach((v, i) => {
      const k = seg((assembleT - v.delay) / 0.5, 0, 1) * (1 - scatter)
      // swirl in: lerp with a curl around Y
      const swirl = (1 - k) * 2.5
      const x = THREE.MathUtils.lerp(v.sx, v.tx, k)
      const y = THREE.MathUtils.lerp(v.sy, v.ty, k)
      const z = THREE.MathUtils.lerp(v.sz, v.tz, k)
      const ca = Math.cos(swirl)
      const sa = Math.sin(swirl)
      dummy.position.set(x * ca - z * sa * 0.3, y, z * ca + x * sa * 0.3)
      dummy.rotation.set(0, (1 - k) * v.spin, 0)
      dummy.scale.setScalar(Math.max(0.001, VOX * 0.92 * Math.max(k, 0.001)))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, targets.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e8e2d6" emissive="#f59e0b" emissiveIntensity={0.55} flatShading />
    </instancedMesh>
  )
}

/* Fake-volumetric spawn shaft: additive cone + floor ring */
export function SpawnShaft() {
  const cone = useRef()
  const ring = useRef()

  useFrame((state) => {
    if (!nearZone('spawn')) return
    const born = seg(prog.introT / 2.6, 0, 1)
    const leave = seg(prog.s, 0.04, 0.09)
    const a = born * (1 - leave)
    if (cone.current) {
      cone.current.material.opacity = a * 0.16
      cone.current.rotation.y = state.clock.elapsedTime * 0.2
    }
    if (ring.current) {
      ring.current.material.opacity = a * 0.5
      ring.current.rotation.z = -state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={cone} position={[0, 4, 0]}>
        <coneGeometry args={[2.6, 8, 12, 1, true]} />
        <meshBasicMaterial color="#fbe9c0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.2, 24]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* plaza tiles */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.4, 8]} />
        <meshStandardMaterial color="#1b1830" metalness={0.5} roughness={0.5} flatShading />
      </mesh>
    </group>
  )
}

export function SpawnPlazaZone() {
  return (
    <CullGroup zoneId="spawn">
      <SpawnShaft />
      <NameVoxels />
    </CullGroup>
  )
}
