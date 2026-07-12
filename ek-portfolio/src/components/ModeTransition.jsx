import { useEffect, useMemo } from 'react'
import { usePortfolioMode } from '../store/usePortfolioMode'

const COLS = 14
const ROWS = 9

/*
 * Pixel-dissolve mode switch: a mosaic of tiles de-rezzes the outgoing
 * page (cover), the mode commits underneath, then the tiles scatter away.
 * One CSS keyframe per tile with a random delay does both halves.
 */
export function ModeTransition() {
  const pending = usePortfolioMode((s) => s.pending)

  const tiles = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.22,
        hue: i % 7 === 0 ? 'var(--pixel-amber, #f59e0b)' : i % 11 === 0 ? '#22d3ee' : '#0f0e1a',
      })),
    [],
  )

  useEffect(() => {
    if (pending === undefined) return
    const s = usePortfolioMode.getState()
    const t1 = setTimeout(() => s._commit(), 450)
    const t2 = setTimeout(() => s._endTransition(), 1050)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pending])

  if (pending === undefined) return null

  return (
    <div className="mode-glitch" aria-hidden="true">
      {tiles.map((t) => (
        <span key={t.id} style={{ animationDelay: `${t.delay}s`, background: t.hue }} />
      ))}
    </div>
  )
}
