import { create } from 'zustand'

/*
 * Mode switches don't apply immediately: they stage a `pending` mode and
 * the ModeTransition overlay (App.jsx) plays a pixel-dissolve, committing
 * the switch mid-cover. Call sites just use setMode/resetMode as before.
 */
export const usePortfolioMode = create((set, get) => ({
  mode: null,
  pending: undefined,
  setMode: (mode) => {
    if (get().pending !== undefined) return
    set({ pending: mode })
  },
  resetMode: () => {
    if (get().pending !== undefined) return
    set({ pending: null })
  },
  _commit: () => {
    const p = get().pending
    if (p !== undefined) set({ mode: p })
  },
  _endTransition: () => set({ pending: undefined }),
}))
