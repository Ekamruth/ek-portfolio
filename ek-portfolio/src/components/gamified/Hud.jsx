import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePortfolioMode } from '../../store/usePortfolioMode'
import { useQuestStore, XP_MAX } from './state/useQuestStore'
import { person } from '../../data/portfolio'
import { prog } from './three/progress'
import { cinematicAt, milestonesAt, FAST_TRAVEL } from './three/levelPlan'
import { chiptune } from './audio/chiptune'

/* Audio side-effects: sequencer on/off, SFX on store events, beat → lights */
function useAudio() {
  const soundOn = useQuestStore((s) => s.soundOn)

  useEffect(() => {
    if (!soundOn) {
      chiptune.stop()
      return
    }
    chiptune.start()
    const offBeat = chiptune.onBeat((i) => {
      if (i % 4 === 0) prog.beatPulse = 1
    })
    let prevXp = useQuestStore.getState().xp
    let prevLvl = useQuestStore.getState().leveledUp
    const unsub = useQuestStore.subscribe((s) => {
      if (s.xp > prevXp) chiptune.sfx.questClear()
      if (s.leveledUp && !prevLvl) chiptune.sfx.levelUp()
      prevXp = s.xp
      prevLvl = s.leveledUp
    })
    return () => {
      offBeat()
      unsub()
      chiptune.stop()
    }
  }, [soundOn])
}

/* rAF tween scroll for fast travel — the knight sprints there */
function travelTo(p) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const from = window.scrollY
  const to = p * max
  const dur = Math.min(2400, 600 + Math.abs(to - from) * 0.35)
  const t0 = performance.now()
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
  const step = (now) => {
    const t = Math.min(1, (now - t0) / dur)
    window.scrollTo(0, from + (to - from) * ease(t))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

function useKonami() {
  const setDebug = useQuestStore((s) => s.setDebug)
  const achieve = useQuestStore((s) => s.achieve)
  useEffect(() => {
    let i = 0
    const onKey = (e) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        const on = !useQuestStore.getState().debug
        setDebug(on)
        if (on) achieve('konami', 'DEBUG MODE — you know the old ways')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setDebug, achieve])
}

/* Letterbox bars + title card, scrubbed at 60fps outside React */
function Cinematics() {
  const topRef = useRef()
  const botRef = useRef()
  const cardRef = useRef()
  const titleRef = useRef()
  const subRef = useRef()

  useEffect(() => {
    let raf
    let lastTitle = ''
    let lastSub = ''
    const tick = () => {
      const { bars, title, sub, card } = cinematicAt(prog.s)
      const h = bars * 9
      if (topRef.current) topRef.current.style.height = `${h}vh`
      if (botRef.current) botRef.current.style.height = `${h}vh`
      if (cardRef.current) {
        cardRef.current.style.opacity = card
        cardRef.current.style.transform = `translate(-50%, ${(1 - card) * 12}px)`
        // only touch textContent when it actually changes — reassigning every
        // frame forces needless text layout during the discovery cut
        if (card > 0.01) {
          if (title !== lastTitle) { titleRef.current.textContent = title; lastTitle = title }
          if (sub !== lastSub) { subRef.current.textContent = sub; lastSub = sub }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div ref={topRef} className="qh-bar qh-bar--top" aria-hidden="true" />
      <div ref={botRef} className="qh-bar qh-bar--bottom" aria-hidden="true" />
      <div ref={cardRef} className="qh-titlecard" aria-hidden="true">
        <span ref={titleRef} className="qh-titlecard-quest" />
        <span ref={subRef} className="qh-titlecard-name" />
      </div>
    </>
  )
}

function XpBar() {
  const fillRef = useRef()
  const lvlRef = useRef()
  const leveledUp = useQuestStore((s) => s.leveledUp)

  useEffect(() => {
    let raf
    let shown = 0
    const tick = () => {
      const target = milestonesAt(prog.s) / XP_MAX
      shown += (target - shown) * 0.06
      if (fillRef.current) fillRef.current.style.width = `${Math.min(100, shown * 100)}%`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="qh-xp">
      <span ref={lvlRef} className="qh-xp-lvl">{leveledUp ? 'LVL 5' : 'LVL 4'}</span>
      <div className="qh-xp-track">
        <div ref={fillRef} className="qh-xp-fill" />
        {Array.from({ length: XP_MAX - 1 }).map((_, i) => (
          <span key={i} className="qh-xp-pip" style={{ left: `${((i + 1) / XP_MAX) * 100}%` }} />
        ))}
      </div>
      <span className="qh-xp-label">XP</span>
    </div>
  )
}

function Toasts() {
  const toasts = useQuestStore((s) => s.toasts)
  return (
    <div className="qh-toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`qh-toast qh-toast--${t.kind}`}>{t.text}</div>
      ))}
    </div>
  )
}

function LevelUpFlash() {
  const leveledUp = useQuestStore((s) => s.leveledUp)
  if (!leveledUp) return null
  return (
    <div className="qh-levelup" aria-hidden="true">
      <span>LEVEL UP</span>
    </div>
  )
}

export function Hud() {
  const resetMode = usePortfolioMode((s) => s.resetMode)
  const soundOn = useQuestStore((s) => s.soundOn)
  const toggleSound = useQuestStore((s) => s.toggleSound)
  const debug = useQuestStore((s) => s.debug)
  useKonami()
  useAudio()

  // portal to body: escape the Framer transform like the canvas does
  return createPortal(
    <div className="quest-hud">
      <nav className="qh-nav">
        <a href="#" className="pixel-nav-logo" onClick={(e) => { e.preventDefault(); travelTo(0) }}>
          &lt;{person.initials}/&gt;
        </a>
        <ul className="qh-nav-links">
          {FAST_TRAVEL.map((ft) => (
            <li key={ft.label}>
              <button onClick={() => travelTo(ft.p)}>{ft.label}</button>
            </li>
          ))}
        </ul>
        <div className="qh-nav-right">
          <button className="pixel-mode-btn" onClick={resetMode}>[ Switch Mode ]</button>
        </div>
      </nav>

      <button
        className="qh-sound"
        onClick={toggleSound}
        aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
      >
        {soundOn ? '\u{1F50A}' : '\u{1F507}'}
      </button>

      <XpBar />
      <Cinematics />
      <Toasts />
      <LevelUpFlash />
      {debug && <div className="qh-debug">DEBUG MODE — drag to orbit · konami to exit</div>}
      <div className="qh-scrollhint" aria-hidden="true">scroll or ↑ ↓ arrows to travel</div>
    </div>,
    document.body,
  )
}
