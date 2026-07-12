import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Knight, FootDust } from './Knight'
import { GltfKnight } from './GltfKnight'
import { prog } from './progress'
import { activeZone, pointAt, tangentAt } from './levelMap'

const _pos = new THREE.Vector3()
const _tan = new THREE.Vector3()

/*
 * Places the knight on the road at prog.dist, faces him along the tangent,
 * and derives the pose (walk / sit / raise / spawn scale) from the zone.
 */
export function KnightRig({ fireflyRef }) {
  const group = useRef()
  const pose = useRef({ walk: 0, phase: 0, sit: 0, raise: 0, lookAt: null })
  const yaw = useRef(Math.PI)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return

    pointAt(prog.dist, _pos)
    g.position.copy(_pos)

    tangentAt(prog.dist, _tan)
    const targetYaw = Math.atan2(_tan.x, _tan.z)
    // shortest-arc damped yaw
    let d = targetYaw - yaw.current
    d = Math.atan2(Math.sin(d), Math.cos(d))
    yaw.current += d * (1 - Math.exp(-dt * 5))
    g.rotation.y = yaw.current

    const m = pose.current
    m.walk = prog.walk
    m.phase = prog.phase

    const { zone: z, localT: t } = activeZone(prog.s)
    const sitT = z?.id === 'campfire' ? THREE.MathUtils.smoothstep(t, 0.12, 0.25) * (1 - THREE.MathUtils.smoothstep(t, 0.88, 1)) : 0
    const raiseT = z?.id === 'armory' ? THREE.MathUtils.smoothstep(t, 0.35, 0.5) * (1 - THREE.MathUtils.smoothstep(t, 0.85, 1)) : 0
    m.sit = THREE.MathUtils.damp(m.sit, sitT, 6, dt)
    m.raise = THREE.MathUtils.damp(m.raise, raiseT, 6, dt)
    m.lookAt = fireflyRef?.current?.position ?? null

    // spawn materialise + final portal dissolve
    const born = THREE.MathUtils.smoothstep(prog.introT, 0.4, 2.2)
    const exit = z?.id === 'portal' ? THREE.MathUtils.smoothstep(t, 0.9, 1) : 0
    const s = Math.max(0.001, born * (1 - exit))
    g.scale.setScalar(s)
    g.position.y += (1 - born) * -1.5 + exit * 0.4
    if (born < 1) g.rotation.y = yaw.current + (1 - born) * Math.PI * 2
  })

  return (
    <>
      <group ref={group}>
        {/* rigged KayKit knight; procedural knight covers the model load */}
        <Suspense fallback={<Knight pose={pose} />}>
          <GltfKnight pose={pose} />
        </Suspense>
        {/* soft under-glow so he reads against the dark road */}
        <pointLight position={[0, 1.6, 0.6]} intensity={6} distance={6} color="#8b93c4" />
      </group>
      <FootDust knightRef={group} />
    </>
  )
}
