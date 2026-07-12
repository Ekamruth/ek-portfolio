import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { prog } from './progress'
import { CameraRig } from './CameraRig'
import { KnightRig } from './KnightRig'
import { AtmosphereDriver, Stars, Road, Ground, Waymarkers } from './Atmosphere'
import { Effects } from './Effects'
import { Zones } from './zones/Zones'
import { useQuestStore } from '../state/useQuestStore'

const BG = '#141327'

/* drei <Html> portal target: a fixed viewport-locked layer created eagerly
 * (module scope) so it exists before ANY Html mounts — a ref callback on
 * the canvas wrapper fires too late on a cold load, and Html would fall
 * back to <body>, where panels sit in document space and scroll away. */
function ensureHtmlLayer() {
  let el = document.getElementById('quest-html-layer')
  if (!el) {
    el = document.createElement('div')
    el.id = 'quest-html-layer'
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      zIndex: 5,
      pointerEvents: 'none',
    })
    document.body.appendChild(el)
  }
  return el
}
export const htmlPortal = { current: ensureHtmlLayer() }

/* Cursor firefly: the pointer exists in the world as a glowing mote the
 * knight's head tracks. Ref is shared with KnightRig. */
function CursorFirefly({ fireflyRef }) {
  const light = useRef()
  const _v = useRef(new THREE.Vector3()).current

  useFrame((state, dt) => {
    const g = fireflyRef.current
    if (!g) return
    // project pointer onto a plane ~6 units ahead of the camera
    _v.set(prog.pointer.x, prog.pointer.y, 0.5).unproject(state.camera)
    _v.sub(state.camera.position).normalize()
    _v.multiplyScalar(7).add(state.camera.position)
    _v.y = Math.max(0.4, _v.y)
    g.position.lerp(_v, 1 - Math.exp(-dt * 3))
    const t = state.clock.elapsedTime
    g.position.y += Math.sin(t * 3.1) * 0.008
    if (light.current) light.current.intensity = 3 + Math.sin(t * 7) * 1.2
  })

  return (
    <group ref={fireflyRef}>
      <mesh>
        <boxGeometry args={[0.09, 0.09, 0.09]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <pointLight ref={light} color="#fbbf24" intensity={3} distance={7} />
    </group>
  )
}

/* Konami debug mode: free orbit camera + wireframe world */
function DebugRig() {
  const debug = useQuestStore((s) => s.debug)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh && o.material && 'wireframe' in o.material) o.material.wireframe = debug
    })
    return () => {
      scene.traverse((o) => {
        if (o.isMesh && o.material && 'wireframe' in o.material) o.material.wireframe = false
      })
    }
  }, [debug, scene])

  if (!debug) return null
  return <OrbitControls makeDefault target={[0, 1.5, -30]} />
}

function ReadySignal() {
  const setWorldReady = useQuestStore((s) => s.setWorldReady)
  useEffect(() => {
    // one painted frame is enough — flag on the next tick
    const id = requestAnimationFrame(() => setWorldReady())
    return () => cancelAnimationFrame(id)
  }, [setWorldReady])
  return null
}

export default function World() {
  const fireflyRef = useRef()

  // Portal to <body>: App.jsx's Framer wrapper leaves a transform, which
  // would turn this fixed layer into a scrolling one.
  return createPortal(
    <div
      className="quest-world-layer"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: BG }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.25]}
        camera={{ position: [0, 5, 9], fov: 42 }}
        gl={{ antialias: false }}
        eventSource={document.body}
        eventPrefix="client"
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color(BG)
          scene.fog = new THREE.Fog(BG, 14, 46)
          gl.setClearColor(BG)
        }}
      >
        <AtmosphereDriver />
        <directionalLight position={[4, 10, 4]} intensity={1.3} color="#fff2d6" />
        <Stars />
        <Ground />
        <Road />
        <Waymarkers />
        <Zones />
        <KnightRig fireflyRef={fireflyRef} />
        <CursorFirefly fireflyRef={fireflyRef} />
        <CameraRig />
        <DebugRig />
        <ReadySignal />
        <Effects />
      </Canvas>
    </div>,
    document.body,
  )
}
