import { useEffect, useRef, useState } from 'react'
import { useQuestStore } from './state/useQuestStore'

/*
 * Diegetic loading: the lazy 3D chunk load is part of the fiction.
 * The bar fills over a minimum beat and completes when the first canvas
 * frame has actually painted (worldReady).
 */
export function BootScreen() {
  const worldReady = useQuestStore((s) => s.worldReady)
  const booted = useQuestStore((s) => s.booted)
  const boot = useQuestStore((s) => s.boot)
  const [gone, setGone] = useState(false)
  const barRef = useRef()
  const pctRef = useRef()

  useEffect(() => {
    if (booted) return
    let raf
    const t0 = performance.now()
    const tick = () => {
      const t = (performance.now() - t0) / 1000
      // creep to 90% on a timer; the last 10% needs the real ready signal
      const fake = Math.min(0.9, t / 1.4)
      const real = useQuestStore.getState().worldReady ? Math.min(1, fake + Math.max(0, (t - 1.2) / 0.3)) : fake
      if (barRef.current) barRef.current.style.width = `${real * 100}%`
      if (pctRef.current) pctRef.current.textContent = `${Math.round(real * 100)}%`
      if (real >= 1) {
        boot()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [booted, boot, worldReady])

  useEffect(() => {
    if (!booted) return
    const id = setTimeout(() => setGone(true), 650)
    return () => clearTimeout(id)
  }, [booted])

  if (gone) return null

  return (
    <div className={`quest-boot ${booted ? 'quest-boot--done' : ''}`}>
      <div className="quest-boot-inner">
        <span className="quest-boot-sword">⚔</span>
        <p className="quest-boot-title">LOADING WORLD</p>
        <div className="quest-boot-track">
          <div ref={barRef} className="quest-boot-fill" />
        </div>
        <p className="quest-boot-pct"><span ref={pctRef}>0%</span></p>
        <p className="quest-boot-hint">scroll to travel · checkpoints reveal the log</p>
      </div>
    </div>
  )
}
