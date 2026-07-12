import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { person, socialLinks } from '../../../../data/portfolio'
import { zone } from '../levelMap'
import { HoloPanel, ZonePulseLight, CullGroup, nearZone, zt, seg } from './common'

/* hoisted — avoid allocating a THREE.Color per shard per frame */
const VORTEX_A = new THREE.Color('#34d399')
const VORTEX_B = new THREE.Color('#22d3ee')

/* Swirling instanced vortex — ignites when the XP bar maxes (level up) */
function Vortex({ zoneId }) {
  const N = 48
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        a0: (i / N) * Math.PI * 2 * 3,
        r0: 0.3 + (i / N) * 1.9,
        sp: 0.7 + Math.random() * 0.9,
        s: 0.07 + Math.random() * 0.12,
      })),
    [],
  )

  useFrame((state) => {
    if (!nearZone(zoneId)) return
    const t = state.clock.elapsedTime
    const open = seg(zt(zoneId), 0.28, 0.5)
    seeds.forEach((sd, i) => {
      const a = sd.a0 + t * sd.sp
      const r = sd.r0 * open
      dummy.position.set(Math.cos(a) * r, 2.6 + Math.sin(a) * r, 0.1 + Math.sin(t + sd.a0) * 0.08)
      dummy.scale.setScalar(open > 0.01 ? sd.s * open : 0)
      dummy.rotation.set(0, 0, a)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      color.copy(VORTEX_A).lerp(VORTEX_B, (i % 5) / 5)
      mesh.current.setColorAt(i, color)
    })
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

export function PortalGateZone() {
  const z = zone('portal')
  const disc = useRef()
  const glow = useRef()

  useFrame((state) => {
    if (!nearZone('portal')) return
    const open = seg(zt('portal'), 0.28, 0.5)
    if (disc.current) {
      disc.current.material.opacity = open * 0.55
      disc.current.scale.setScalar(Math.max(0.001, open))
      disc.current.rotation.z = state.clock.elapsedTime * 0.4
    }
    if (glow.current) glow.current.intensity = open * (30 + Math.sin(state.clock.elapsedTime * 3) * 8)
  })

  return (
    <CullGroup zoneId="portal" position={z.anchor}>
      {/* gate frame */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 2.2, 0]}>
          <boxGeometry args={[0.7, 4.4, 0.7]} />
          <meshStandardMaterial color="#221f38" emissive="#34d399" emissiveIntensity={0.12} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 4.6, 0]}>
        <boxGeometry args={[5.4, 0.7, 0.8]} />
        <meshStandardMaterial color="#221f38" emissive="#34d399" emissiveIntensity={0.12} flatShading />
      </mesh>
      <mesh position={[0, 5.15, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
        <meshBasicMaterial color="#34d399" toneMapped={false} />
      </mesh>
      {/* portal surface */}
      <mesh ref={disc} position={[0, 2.6, 0]}>
        <circleGeometry args={[1.9, 24]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <Vortex zoneId="portal" />
      <pointLight ref={glow} position={[0, 2.6, 2]} color="#34d399" intensity={0} distance={20} />
      <ZonePulseLight zoneId="portal" position={[0, 5, 3]} color="#34d399" base={10} />

      {/* contact sigils — real links, clickable in-world */}
      <HoloPanel zoneId="portal" position={[-2.3, 3.8, 2.6]} width={410} on={0.3} cleared={0.55} interactive className="holo--portal">
        <div className="holo-head"><span>⚑ FINAL GATE</span><span>CONTACT</span></div>
        <h3 className="holo-title">The portal is open.</h3>
        <p className="holo-guild">Open to senior roles, contract work, and interesting problems.</p>
        <a className="portal-email" href={`mailto:${person.email}`}>✉ {person.email}</a>
        <div className="portal-links">
          {socialLinks.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">[{l.label}]</a>
          ))}
        </div>
        <div className="holo-stamp" style={{ borderColor: '#34d399', color: '#34d399' }}>★ LEVEL 5 REACHED</div>
      </HoloPanel>
    </CullGroup>
  )
}
