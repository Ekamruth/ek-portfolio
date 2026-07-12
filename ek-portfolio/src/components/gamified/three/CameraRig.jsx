import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { prog } from './progress'
import { activeZone, pointAt, tangentAt, distAt } from './levelMap'
import { useQuestStore } from '../state/useQuestStore'

const _knight = new THREE.Vector3()
const _tan = new THREE.Vector3()
const _target = new THREE.Vector3()
const _look = new THREE.Vector3()
const _lookTarget = new THREE.Vector3()
const _fire = new THREE.Vector3()
const _ftan = new THREE.Vector3()

const smooth = (a, b, t) => THREE.MathUtils.smoothstep(t, a, b)

/*
 * ProgressDriver + camera in one place.
 * Walk mode: shoulder-follow behind the knight along the road tangent.
 * Quest dwell: breaks onto a ~140° orbit around the monument (the
 * letterboxed "discovery cut"), scrubbed by the zone's local timeline.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  const lookRef = useRef(new THREE.Vector3(0, 1.5, -6))
  const lastDist = useRef(0)
  const started = useRef(false)
  const respawnTimer = useRef(0)
  const snap = useRef(false)

  useFrame((state, dt) => {
    // ---- progress driver ----
    const max = document.documentElement.scrollHeight - window.innerHeight
    prog.p = max > 0 ? window.scrollY / max : 0

    // loop: once the knight has walked through the portal (bottom of the
    // scroll), dwell a beat then warp home — scroll resets, progress snaps to
    // spawn, and the intro choreography replays so he respawns at the plaza.
    // The dwell (~2.4s) leaves ample time to use the contact links first;
    // dt is capped so a single throttled frame can't trip it early.
    if (useQuestStore.getState().booted && prog.p > 0.995) {
      respawnTimer.current += Math.min(dt, 0.05)
      if (respawnTimer.current > 2.4) {
        respawnTimer.current = 0
        snap.current = true
        window.scrollTo(0, 0)
        prog.p = 0
        prog.s = 0
        prog.vel = 0
        prog.walk = 0
        prog.dist = 0
        lastDist.current = 0
        useQuestStore.getState().respawn()
      }
    } else {
      respawnTimer.current = 0
    }

    prog.s = THREE.MathUtils.damp(prog.s, prog.p, 4.5, dt)
    const dist = distAt(prog.s)
    prog.vel = THREE.MathUtils.damp(prog.vel, (dist - lastDist.current) / Math.max(dt, 1e-4), 8, dt)
    lastDist.current = dist
    prog.dist = dist
    const speedNorm = THREE.MathUtils.clamp(Math.abs(prog.vel) / 5, 0, 1)
    prog.walk = THREE.MathUtils.damp(prog.walk, speedNorm, 6, dt)
    prog.phase += Math.abs(prog.vel) * dt * 2.2 // stride tied to real travel
    const { booted, introAt, debug, startRun } = useQuestStore.getState()
    prog.introT = booted ? (performance.now() - introAt) / 1000 : 0
    prog.pointer.x = state.pointer.x
    prog.pointer.y = state.pointer.y
    prog.beatPulse = (prog.beatPulse ?? 0) * Math.exp(-dt * 5) // audio beat → light decay
    if (!started.current && prog.p > 0.005 && booted) {
      started.current = true
      startRun()
    }

    if (debug) return // konami free-cam owns the camera

    // ---- camera ----
    pointAt(dist, _knight)
    tangentAt(dist, _tan)
    const { zone: z, localT: t } = activeZone(prog.s)

    // default: shoulder-follow
    _target.copy(_knight).addScaledVector(_tan, -6.8)
    _target.y = 3.1
    _target.x += Math.sin(prog.s * Math.PI * 6) * 0.35
    _look.copy(_knight).addScaledVector(_tan, 4)
    _look.y = 1.35

    // quest dwell: discovery orbit (early), then settle over the knight's
    // shoulder so monument + holo panel + knight compose in one frame
    if (z && z.kind === 'quest') {
      const w = smooth(0.05, 0.18, t) * (1 - smooth(0.82, 0.97, t))
      if (w > 0.001) {
        const c = z.anchor
        const settle = smooth(0.42, 0.58, t)
        const baseAngle = Math.atan2(_knight.x - c.x, _knight.z - c.z)
        const sweep = smooth(0.05, 0.45, t)
        const angle = baseAngle + (sweep - 0.35) * Math.PI * 0.8
        const r = 9.5 - sweep * 1.5
        // orbit position
        let ox = c.x + Math.sin(angle) * r
        let oy = 2.6 + sweep * 2
        let oz = c.z + Math.cos(angle) * r
        // settle position: shoulder cam, high and offset so the knight
        // frames the monument instead of blocking it
        const sx = _knight.x - _tan.x * 7 - _tan.z * 2.4
        const sy = 3.9
        const szp = _knight.z - _tan.z * 7 + _tan.x * 2.4
        ox = THREE.MathUtils.lerp(ox, sx, settle)
        oy = THREE.MathUtils.lerp(oy, sy, settle)
        oz = THREE.MathUtils.lerp(oz, szp, settle)
        _target.set(
          THREE.MathUtils.lerp(_target.x, ox, w),
          THREE.MathUtils.lerp(_target.y, oy, w),
          THREE.MathUtils.lerp(_target.z, oz, w),
        )
        _look.lerp(new THREE.Vector3(c.x, 2.2 + settle * 0.8, c.z), w)
      }
    }

    // campfire: settle low beside the fire (which sits just past the knight)
    if (z && z.id === 'campfire') {
      const w = smooth(0.1, 0.3, t) * (1 - smooth(0.85, 1, t))
      pointAt(z.standDist + 2.2, _fire)
      tangentAt(z.standDist + 2.2, _ftan)
      // side-on: perpendicular to the road, low to the ground
      _target.lerp(
        new THREE.Vector3(_fire.x - _ftan.z * 6.2, 2.0, _fire.z + _ftan.x * 6.2),
        w * 0.95,
      )
      // frame the midpoint between the seated knight and the fire
      _look.lerp(new THREE.Vector3(_fire.x - _ftan.x * 1.2, 1.15, _fire.z - _ftan.z * 1.2), w)
    }

    // portal: pull wide + slight rise for the final walk-in
    if (z && z.id === 'portal') {
      const w = smooth(0.5, 0.9, t)
      _target.y += w * 1.6
      _target.addScaledVector(_tan, -w * 3)
    }

    // spawn intro: slow push-in from above while the world renders
    if (prog.introT < 2.6) {
      const w = 1 - smooth(0.2, 2.4, prog.introT)
      _target.y += w * 3.5
      _target.addScaledVector(_tan, -w * 3)
    }

    if (snap.current) {
      // respawn: hard-cut the camera to spawn instead of gliding back
      snap.current = false
      camera.position.copy(_target)
      lookRef.current.copy(_look)
    } else {
      const k = 1 - Math.exp(-dt * 4.2)
      camera.position.lerp(_target, k)
      lookRef.current.lerp(_look, k)
    }
    _lookTarget.copy(lookRef.current)
    camera.lookAt(_lookTarget)
  })

  return null
}
