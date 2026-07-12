import { create } from 'zustand'

let toastId = 0

/*
 * Shared game state for the gamified quest world.
 * Continuous per-frame values (scroll progress, camera, walk speed) live in
 * three/progress.js as a mutable singleton — this store only holds discrete
 * state that React should re-render on.
 */
export const useQuestStore = create((set, get) => ({
  worldReady: false, // first canvas frame rendered
  booted: false, // boot screen dismissed → spawn intro starts
  introAt: 0, // performance.now() when intro started
  soundOn: false,
  debug: false, // konami: free camera + wireframe
  cleared: {}, // zoneId -> true
  xp: 0, // 0..XP_MAX milestones
  leveledUp: false,
  toasts: [], // { id, kind, text }
  achieved: {},
  runStartedAt: null, // speedrun: first scroll after boot
  glitchAt: 0, // performance.now() of last pixelation glitch spike

  setWorldReady: () => set({ worldReady: true }),
  boot: () => set({ booted: true, introAt: performance.now() }),
  // replay the spawn choreography (used when the knight loops back through
  // the portal to the start) — resets only the intro clock, not run progress
  respawn: () => set({ introAt: performance.now() }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setDebug: (debug) => set({ debug }),
  startRun: () => {
    if (get().runStartedAt == null) set({ runStartedAt: performance.now() })
  },

  clearZone: (id) => {
    const s = get()
    if (s.cleared[id]) return
    set({
      cleared: { ...s.cleared, [id]: true },
      xp: s.xp + 1,
      glitchAt: performance.now(),
    })
  },

  levelUp: () => {
    const s = get()
    if (s.leveledUp) return
    set({ leveledUp: true, glitchAt: performance.now() })
  },

  triggerGlitch: () => set({ glitchAt: performance.now() }),

  addToast: (text, kind = 'info') => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, kind, text }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4200)
  },

  achieve: (id, text) => {
    const s = get()
    if (s.achieved[id]) return
    set({ achieved: { ...s.achieved, [id]: true } })
    s.addToast(`\u{1F3C6} ${text}`, 'achievement')
  },
}))

export const XP_MAX = 6 // 3 quests + campfire + armory + portal
