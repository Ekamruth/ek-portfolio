import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { stats } from '../../../../data/portfolio'
import { zone, pointAt } from '../levelMap'
import { HoloPanel, CullGroup, nearZone, zt, seg } from './common'
import { chiptune } from '../../audio/chiptune'
import { useQuestStore } from '../../state/useQuestStore'

const DIALOGUE = [
  '* You sit by the fire. It crackles softly.',
  '* EK: Four years building the frontend layer where AI becomes usable — streaming interfaces, real-time systems, architecture that lasts.',
  '* EK: Cut bundles by 70%. Halved real-time code paths. Shipped 70+ features with near-zero regressions.',
  '* EK: Off duty? Gym, treks, violin, ranked grinds.',
  '* Discipline. Consistency. Things that last.',
].join('\n')

/* Typewriter scrubbed by the zone timeline — scrolling back rewinds it.
 * Player stats live inside the panel (a tidy row under the bio) rather than
 * as separate floating runestones — always legible, always well placed. */
function Dialogue({ boxPos }) {
  const text = useRef()

  useFrame(() => {
    if (!nearZone('campfire')) return
    const t = zt('campfire')
    const k = seg(t, 0.22, 0.88)
    const n = Math.round(k * DIALOGUE.length)
    if (text.current && text.current._n !== n) {
      const advanced = n > (text.current._n ?? 0)
      text.current._n = n
      text.current.textContent = DIALOGUE.slice(0, n) + (n > 0 && n < DIALOGUE.length ? '▌' : '')
      if (advanced && n % 3 === 0 && useQuestStore.getState().soundOn) chiptune.sfx.dialogueBlip()
    }
  })

  return (
    <HoloPanel zoneId="campfire" position={[boxPos.x, 2.15, boxPos.z]} width={470} distanceFactor={5.5} on={0.18} cleared={0.92} className="holo--dialogue">
      <div className="holo-head"><span>❯ CAMPFIRE</span><span>ABOUT</span></div>
      <pre ref={text} className="holo-dialogue-text" />
      <div className="holo-stats">
        {stats.map((s) => (
          <div key={s.label} className="holo-stat">
            <strong>{s.num}{s.suffix}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </HoloPanel>
  )
}

function Fire({ firePos }) {
  const flames = useRef([])
  const light = useRef()

  useFrame((state) => {
    if (!nearZone('campfire')) return
    const t = state.clock.elapsedTime
    flames.current.forEach((f, i) => {
      if (!f) return
      const fl = 0.8 + Math.sin(t * (6 + i * 1.7) + i * 2) * 0.25
      f.scale.set(fl * (1 - i * 0.2), fl * (1.1 + Math.sin(t * 5 + i) * 0.2), 1)
    })
    if (light.current) light.current.intensity = 22 + Math.sin(t * 7.3) * 5 + Math.sin(t * 13.7) * 3
  })

  return (
    <group position={[firePos.x, 0, firePos.z]}>
      {/* log ring */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.57) * 0.55, 0.12, Math.sin(i * 1.57) * 0.55]} rotation={[Math.PI / 2, 0, i * 1.57 + 0.7]}>
          <cylinderGeometry args={[0.09, 0.11, 0.8, 5]} />
          <meshStandardMaterial color="#3d2b20" flatShading />
        </mesh>
      ))}
      {/* crossed emissive flame planes */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (flames.current[i] = el)} position={[0, 0.45 + i * 0.12, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          <planeGeometry args={[0.5 - i * 0.12, 0.7]} />
          <meshBasicMaterial color={i === 0 ? '#fb923c' : i === 1 ? '#fbbf24' : '#fde68a'} transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      <pointLight ref={light} position={[0, 1, 0]} color="#fb923c" intensity={22} distance={16} />
    </group>
  )
}

function Fireflies({ firePos }) {
  const N = 18
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        r: 1.5 + Math.random() * 4,
        a: Math.random() * Math.PI * 2,
        y: 0.4 + Math.random() * 2,
        sp: 0.15 + Math.random() * 0.4,
        ph: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame((state) => {
    if (!nearZone('campfire')) return
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      const a = s.a + t * s.sp
      const blink = 0.5 + 0.5 * Math.sin(t * 2.4 + s.ph)
      dummy.position.set(
        firePos.x + Math.cos(a) * s.r,
        s.y + Math.sin(t * 0.8 + s.ph) * 0.35,
        firePos.z + Math.sin(a) * s.r,
      )
      dummy.scale.setScalar(0.045 * (0.4 + blink))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#a3e635" toneMapped={false} />
    </instancedMesh>
  )
}

export function CampfireZone() {
  const z = zone('campfire')
  // the fire sits just ahead of where the knight parks, not at the far anchor
  const firePos = useMemo(() => pointAt(z.standDist + 2.2, new THREE.Vector3()), [z])
  // dialogue floats between knight and fire so it projects near screen centre
  const boxPos = useMemo(() => pointAt(z.standDist + 0.5, new THREE.Vector3()), [z])

  return (
    <CullGroup zoneId="campfire">
      <Fire firePos={firePos} />
      <Fireflies firePos={firePos} />
      <Dialogue boxPos={boxPos} />
    </CullGroup>
  )
}
