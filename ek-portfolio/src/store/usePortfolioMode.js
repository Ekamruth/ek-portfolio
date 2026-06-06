import { create } from 'zustand'

export const usePortfolioMode = create((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
  resetMode: () => set({ mode: null }),
}))
