import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../../../../data/portfolio'
import { zone, pointAt, tangentAt } from '../levelMap'
import { ZonePulseLight, CullGroup, nearZone, useZoneNear, zt, seg } from './common'
import { htmlPortal } from '../World'

const RACKS = [
  { key: 'core', label: 'CORE', color: '#f59e0b', items: skills.core },
  { key: 'realtime', label: 'REAL-TIME & AI', color: '#22d3ee', items: skills.realtime },
  { key: 'architecture', label: 'ARCHITECTURE', color: '#a78bfa', items: skills.architecture },
  { key: 'backend', label: 'BACKEND & APIS', color: '#34d399', items: skills.backend },
  { key: 'tooling', label: 'TOOLING', color: '#f472b6', items: skills.tooling },
]

/* One floating relic per skill group */
function Relic({ kind, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (!nearZone('armory')) return
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.8
      ref.current.position.y = 1.75 + Math.sin(t * 1.4) * 0.08
    }
  })

  const mat = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} metalness={0.4} flatShading />
  return (
    <group ref={ref} position={[0, 1.75, 0]}>
      {kind === 'core' && (
        <group>
          <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.09, 0.8, 0.05]} />{mat}</mesh>
          <mesh position={[0, -0.2, 0]}><boxGeometry args={[0.3, 0.07, 0.07]} />{mat}</mesh>
        </group>
      )}
      {kind === 'realtime' && <mesh><icosahedronGeometry args={[0.32, 0]} />{mat}</mesh>}
      {kind === 'architecture' && <mesh><boxGeometry args={[0.42, 0.5, 0.42]} />{mat}</mesh>}
      {kind === 'backend' && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.09, 4, 8]} />{mat}</mesh>}
      {kind === 'tooling' && (
        <group>
          <mesh><boxGeometry args={[0.44, 0.3, 0.3]} />{mat}</mesh>
          <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.16, 0.14, 0.3]} />{mat}</mesh>
        </group>
      )}
    </group>
  )
}

function Pedestal({ rack, index, position, rotation }) {
  const glow = useRef()
  const chip = useRef()
  const gate = 0.18 + index * 0.1
  const near = useZoneNear('armory')

  useFrame(() => {
    if (!nearZone('armory')) return
    const t = zt('armory')
    const lit = seg(t, gate, gate + 0.12)
    if (glow.current) glow.current.intensity = lit * 10
    chip.current?.classList.toggle('holo--on', lit > 0.6)
  })

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#221f38" flatShading />
      </mesh>
      <mesh position={[0, 1.03, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshBasicMaterial color={rack.color} toneMapped={false} />
      </mesh>
      <Relic kind={rack.key} color={rack.color} />
      <pointLight ref={glow} position={[0, 1.9, 0.6]} color={rack.color} intensity={0} distance={5} />
      {near && (
        <Html position={[0, 2.6, 0]} center portal={htmlPortal} distanceFactor={6.5} zIndexRange={[30, 0]}>
          <div ref={chip} className="holo holo--rack" style={{ width: 260, borderColor: rack.color }}>
            <p className="rack-label" style={{ color: rack.color }}>{rack.label}</p>
            <p className="rack-items">{rack.items.join(' · ')}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

export function ArmoryZone() {
  const z = zone('armory')
  // arrange pedestals in an arc facing where the knight parks
  const layout = useMemo(() => {
    const stand = pointAt(z.standDist, new THREE.Vector3())
    const tan = tangentAt(z.standDist, new THREE.Vector3())
    const yaw = Math.atan2(tan.x, tan.z)
    return RACKS.map((rack, i) => {
      const a = yaw + (i - 2) * 0.36
      return {
        rack,
        pos: [stand.x + Math.sin(a) * 6.4, 0, stand.z + Math.cos(a) * 6.4],
        rot: [0, a + Math.PI, 0],
      }
    })
  }, [z])

  return (
    <CullGroup zoneId="armory">
      {layout.map(({ rack, pos, rot }, i) => (
        <Pedestal key={rack.key} rack={rack} index={i} position={pos} rotation={rot} />
      ))}
      <ZonePulseLight zoneId="armory" position={[z.anchor.x, 4, z.anchor.z]} color="#a78bfa" base={16} />
    </CullGroup>
  )
}
