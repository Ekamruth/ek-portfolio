import { lazy, Suspense, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { PixelNav } from './PixelNav'
import { PixelHero } from './PixelHero'
import { PixelWork } from './PixelWork'
import { PixelAbout } from './PixelAbout'
import { PixelContact } from './PixelContact'
import { PixelFooter } from './PixelFooter'
import { PixelClouds, PixelDivider } from './PixelTerrain'
import { PixelChatWidget } from './PixelChatWidget'
import { Hud } from './Hud'
import { BootScreen } from './BootScreen'
import { person, workProjects, skills, experience } from '../../data/portfolio'

// 3D world is code-split — it only loads in gamified mode, never touching
// the professional bundle.
const World = lazy(() => import('./three/World'))

// Permanent dark backdrop portaled to <body>, behind the 3D canvas.
function WorldBackdrop() {
  return createPortal(
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: -2, background: '#0f0e1a', pointerEvents: 'none' }}
    />,
    document.body,
  )
}

/* Reduced-motion, small/touch screens, or missing WebGL2 → DOM fallback */
function useFallbackMode() {
  return useMemo(() => {
    if (typeof window === 'undefined') return true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    if (window.innerWidth < 820 && 'ontouchstart' in window) return true
    try {
      const c = document.createElement('canvas')
      if (!c.getContext('webgl2')) return true
    } catch {
      return true
    }
    return false
  }, [])
}

/* Real text content for screen readers & SEO — the 3D world is aria-hidden */
function SemanticContent() {
  return (
    <div className="sr-only">
      <h1>{person.name} — {person.role}</h1>
      <p>{person.tagline}</p>
      <h2>Work</h2>
      {workProjects.map((p) => (
        <article key={p.num}>
          <h3>{p.title} — {p.company} ({p.year})</h3>
          <p>{p.description}</p>
          <ul>{p.impact.map((i) => <li key={i}>{i}</li>)}</ul>
        </article>
      ))}
      <h2>Skills</h2>
      <p>{Object.values(skills).flat().join(', ')}</p>
      <h2>Experience</h2>
      {experience.map((e) => (
        <p key={e.company}>{e.role} at {e.company}, {e.period}</p>
      ))}
      <h2>Contact</h2>
      <p><a href={`mailto:${person.email}`}>{person.email}</a></p>
    </div>
  )
}

function GamifiedFallback() {
  return (
    <div className="pixel-world">
      <PixelClouds />
      <div className="pixel-content">
        <PixelNav />
        <PixelHero />
        <PixelDivider />
        <PixelWork />
        <PixelDivider />
        <PixelAbout />
        <PixelDivider />
        <PixelContact />
        <PixelFooter />
        <PixelChatWidget />
      </div>
    </div>
  )
}

export function GamifiedApp() {
  const fallback = useFallbackMode()

  useEffect(() => {
    if (!fallback) window.scrollTo(0, 0)
  }, [fallback])

  useEffect(() => {
    if (fallback) return
    const SPEED = 400
    let held = null
    let raf = 0
    let lastT = 0
    const tick = (t) => {
      if (!held) return
      const dt = lastT ? (t - lastT) / 1000 : 0
      lastT = t
      window.scrollBy(0, held === 'ArrowUp' ? SPEED * dt : -SPEED * dt)
      raf = requestAnimationFrame(tick)
    }
    const onDown = (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
      e.preventDefault()
      if (held) return
      held = e.key
      lastT = 0
      raf = requestAnimationFrame(tick)
    }
    const onUp = (e) => {
      if (e.key === held) { held = null; cancelAnimationFrame(raf) }
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [fallback])

  if (fallback) return <GamifiedFallback />

  return (
    <div className="pixel-world quest-mode">
      <WorldBackdrop />
      <Suspense fallback={null}>
        <World />
      </Suspense>
      <BootScreen />
      <Hud />
      <SemanticContent />
      {/* the level IS the page — this spacer is the scroll track */}
      <div className="quest-scroll" aria-hidden="true" />
      <PixelChatWidget />
    </div>
  )
}
