/*
 * Scroll-space plan of the quest level — pure math, NO three.js import.
 * Safe to import from DOM code (Hud) without dragging three into the main
 * bundle; levelMap.js adds the 3D geometry on top inside the lazy chunk.
 */

export const ZONES = [
  { id: 'spawn', kind: 'spawn', p0: 0.0, p1: 0.08, title: 'SPAWN PLAZA', sub: 'the world renders in' },
  { id: 'forge', kind: 'quest', questIdx: 0, p0: 0.14, p1: 0.26, title: 'QUEST 01', sub: 'THE FORGE OF STREAMS' },
  { id: 'obelisk', kind: 'quest', questIdx: 1, p0: 0.32, p1: 0.44, title: 'QUEST 02', sub: 'THE SPARK OBELISK' },
  { id: 'ruins', kind: 'quest', questIdx: 2, p0: 0.5, p1: 0.62, title: 'QUEST 03', sub: 'THE DASHBOARD RUINS' },
  { id: 'campfire', kind: 'campfire', p0: 0.66, p1: 0.76, title: 'THE CAMPFIRE', sub: 'a moment of rest' },
  { id: 'armory', kind: 'armory', p0: 0.79, p1: 0.88, title: 'THE ARMORY', sub: 'tools of the trade' },
  { id: 'portal', kind: 'portal', p0: 0.91, p1: 1.0, title: 'THE PORTAL GATE', sub: 'send a raven' },
]

const byId = Object.fromEntries(ZONES.map((z) => [z.id, z]))
export const zone = (id) => byId[id]

export function activeZone(p) {
  for (const z of ZONES) {
    if (p >= z.p0 && p <= z.p1) {
      return { zone: z, localT: (p - z.p0) / (z.p1 - z.p0) }
    }
  }
  return { zone: null, localT: 0 }
}

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}

/* Letterbox bars + title card state for the HUD (quest zones only) */
export function cinematicAt(p) {
  const { zone: z, localT: t } = activeZone(p)
  if (!z || z.kind !== 'quest') return { bars: 0, title: '', sub: '', card: 0 }
  const bars = smooth(0.0, 0.14, t) * (1 - smooth(0.82, 0.96, t))
  const card = smooth(0.08, 0.2, t) * (1 - smooth(0.6, 0.72, t))
  return { bars, title: z.title, sub: z.sub, card }
}

/* Milestones passed at progress p (drives the XP bar, scrub-reversible) */
export function milestonesAt(p) {
  let n = 0
  for (const z of ZONES) {
    if (z.id === 'spawn') continue
    if (p >= z.p0 + (z.p1 - z.p0) * 0.55) n++
  }
  return n
}

export const FAST_TRAVEL = [
  { label: 'Quests', p: byId.forge.p0 + 0.02 },
  { label: 'Camp', p: byId.campfire.p0 + 0.02 },
  { label: 'Armory', p: byId.armory.p0 + 0.02 },
  { label: 'Portal', p: byId.portal.p0 + 0.02 },
]
