import * as THREE from 'three'
import { ZONES, zone, activeZone } from './levelPlan'

/*
 * 3D geometry of the quest level (lazy chunk only).
 * Decorates the pure scroll-space plan (levelPlan.js) with the road curve,
 * anchor positions, and arc-length travel mapping.
 */

export { ZONES, zone, activeZone }

const v = (x, y, z) => new THREE.Vector3(x, y, z)

export const ANCHORS = {
  spawn: v(0, 0, 0),
  forge: v(-6, 0, -30),
  obelisk: v(7, 0, -60),
  ruins: v(-7, 0, -90),
  campfire: v(5.5, 0, -118),
  armory: v(-5, 0, -146),
  portal: v(0, 0, -176),
}

export const curve = new THREE.CatmullRomCurve3(
  [
    v(0, 0, 8), // lead-in so the spawn tangent is stable
    ANCHORS.spawn,
    v(-2, 0, -14),
    ANCHORS.forge,
    v(2, 0, -46),
    ANCHORS.obelisk,
    v(-1, 0, -76),
    ANCHORS.ruins,
    v(0, 0, -104),
    ANCHORS.campfire,
    v(-1, 0, -132),
    ANCHORS.armory,
    v(-1, 0, -162),
    ANCHORS.portal,
    v(0, 0, -190), // lead-out
  ],
  false,
  'catmullrom',
  0.35,
)

export const LENGTH = curve.getLength()

/* Arc-length distance of the closest road point to each anchor. */
function distOfAnchor(anchor) {
  const N = 600
  let best = 0
  let bestD = Infinity
  for (let i = 0; i <= N; i++) {
    const u = i / N
    const d = curve.getPointAt(u).distanceToSquared(anchor)
    if (d < bestD) {
      bestD = d
      best = u
    }
  }
  return best * LENGTH
}

const STAND_BACK = 5 // knight halts this far before a monument

for (const z of ZONES) {
  z.anchor = ANCHORS[z.id]
  z.anchorDist = distOfAnchor(z.anchor)
  z.standDist = z.id === 'spawn' ? 0 : z.anchorDist - STAND_BACK
}

/* piecewise (p, dist) breakpoints: flat during dwells, eased walks between */
const BREAKS = []
BREAKS.push({ p: 0, d: 0 })
BREAKS.push({ p: zone('spawn').p1, d: 4 })
for (const z of ZONES) {
  if (z.id === 'spawn') continue
  BREAKS.push({ p: z.p0, d: z.standDist })
  BREAKS.push({ p: z.p1, d: z.standDist })
}
// final beat: during the portal dwell's last stretch the knight steps in
BREAKS[BREAKS.length - 1] = { p: 0.97, d: zone('portal').standDist }
BREAKS.push({ p: 1.0, d: zone('portal').anchorDist + 1.5 })

const easeInOut = (t) => t * t * (3 - 2 * t)

export function distAt(p) {
  p = THREE.MathUtils.clamp(p, 0, 1)
  for (let i = 0; i < BREAKS.length - 1; i++) {
    const a = BREAKS[i]
    const b = BREAKS[i + 1]
    if (p <= b.p) {
      const t = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p)
      return THREE.MathUtils.lerp(a.d, b.d, easeInOut(t))
    }
  }
  return BREAKS[BREAKS.length - 1].d
}

export const pointAt = (dist, target) =>
  curve.getPointAt(THREE.MathUtils.clamp(dist / LENGTH, 0, 1), target)
export const tangentAt = (dist, target) =>
  curve.getTangentAt(THREE.MathUtils.clamp(dist / LENGTH, 0, 1), target)
