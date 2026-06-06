import { useEffect, useState, useRef } from 'react'

function PixelCharacter({ side, delay }) {
  const [pos, setPos] = useState({ y: 20 + Math.random() * 60 })
  const dirRef = useRef(Math.random() > 0.5 ? 1 : -1)
  const frameRef = useRef(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frameRef.current = (frameRef.current + 1) % 2
        setPos((p) => {
          let newY = p.y + dirRef.current * 0.3
          if (newY > 80 || newY < 15) dirRef.current *= -1
          return { y: Math.max(15, Math.min(80, newY)) }
        })
      }, 200)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay])

  const frame = frameRef.current

  return (
    <div
      className={`pixel-sprite pixel-sprite--${side}`}
      style={{ top: `${pos.y}%` }}
    >
      <svg width="24" height="24" viewBox="0 0 16 16" shapeRendering="crispEdges">
        {/* head */}
        <rect x="5" y="1" width="6" height="5" fill="var(--pixel-amber)" />
        {/* eyes */}
        <rect x="6" y="3" width="2" height="1" fill="var(--pixel-bg)" />
        <rect x="10" y="3" width="2" height="1" fill="var(--pixel-bg)" />
        {/* body */}
        <rect x="4" y="6" width="8" height="5" fill="var(--pixel-coral)" />
        {/* arms */}
        <rect x="2" y="7" width="2" height={frame === 0 ? "3" : "2"} fill="var(--pixel-coral)" />
        <rect x="12" y="7" width="2" height={frame === 0 ? "2" : "3"} fill="var(--pixel-coral)" />
        {/* legs */}
        <rect x="5" y="11" width="2" height="3" fill="var(--pixel-cyan)" />
        <rect x="9" y="11" width="2" height="3" fill="var(--pixel-cyan)" />
        {/* feet */}
        <rect x={frame === 0 ? "4" : "5"} y="14" width="3" height="2" fill="var(--pixel-amber)" />
        <rect x={frame === 0 ? "9" : "8"} y="14" width="3" height="2" fill="var(--pixel-amber)" />
      </svg>
    </div>
  )
}

function FloatingItem({ type, side, delay }) {
  const icons = {
    star: (
      <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges">
        <rect x="3" y="0" width="2" height="2" fill="var(--pixel-amber)" />
        <rect x="0" y="3" width="8" height="2" fill="var(--pixel-amber)" />
        <rect x="1" y="2" width="6" height="1" fill="var(--pixel-amber)" />
        <rect x="1" y="5" width="6" height="1" fill="var(--pixel-amber)" />
        <rect x="2" y="6" width="2" height="1" fill="var(--pixel-amber)" />
        <rect x="4" y="6" width="2" height="1" fill="var(--pixel-amber)" />
        <rect x="3" y="3" width="2" height="2" fill="var(--pixel-amber-bright)" />
      </svg>
    ),
    heart: (
      <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges">
        <rect x="1" y="1" width="2" height="2" fill="var(--pixel-coral)" />
        <rect x="5" y="1" width="2" height="2" fill="var(--pixel-coral)" />
        <rect x="0" y="2" width="8" height="2" fill="var(--pixel-coral)" />
        <rect x="1" y="4" width="6" height="1" fill="var(--pixel-coral)" />
        <rect x="2" y="5" width="4" height="1" fill="var(--pixel-coral)" />
        <rect x="3" y="6" width="2" height="1" fill="var(--pixel-coral)" />
      </svg>
    ),
    diamond: (
      <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges">
        <rect x="3" y="0" width="2" height="1" fill="var(--pixel-cyan)" />
        <rect x="2" y="1" width="4" height="1" fill="var(--pixel-cyan)" />
        <rect x="1" y="2" width="6" height="1" fill="var(--pixel-cyan)" />
        <rect x="0" y="3" width="8" height="2" fill="var(--pixel-cyan)" />
        <rect x="1" y="5" width="6" height="1" fill="var(--pixel-cyan)" />
        <rect x="2" y="6" width="4" height="1" fill="var(--pixel-cyan)" />
        <rect x="3" y="7" width="2" height="1" fill="var(--pixel-cyan)" />
      </svg>
    ),
    coin: (
      <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges">
        <rect x="2" y="0" width="4" height="1" fill="var(--pixel-amber)" />
        <rect x="1" y="1" width="6" height="1" fill="var(--pixel-amber)" />
        <rect x="0" y="2" width="8" height="4" fill="var(--pixel-amber)" />
        <rect x="3" y="2" width="2" height="4" fill="var(--pixel-amber-bright)" />
        <rect x="1" y="6" width="6" height="1" fill="var(--pixel-amber)" />
        <rect x="2" y="7" width="4" height="1" fill="var(--pixel-amber)" />
      </svg>
    ),
  }

  return (
    <div
      className={`pixel-floating-item pixel-floating-item--${side}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {icons[type]}
    </div>
  )
}

export function PixelSprites() {
  return (
    <div className="pixel-sprites-layer" aria-hidden="true">
      <PixelCharacter side="left" delay={500} />
      <PixelCharacter side="right" delay={2000} />

      <FloatingItem type="star" side="left" delay={0} />
      <FloatingItem type="heart" side="right" delay={1.5} />
      <FloatingItem type="diamond" side="left" delay={3} />
      <FloatingItem type="coin" side="right" delay={4.5} />
      <FloatingItem type="star" side="right" delay={6} />
      <FloatingItem type="coin" side="left" delay={7.5} />
      <FloatingItem type="heart" side="left" delay={2} />
      <FloatingItem type="diamond" side="right" delay={5} />
    </div>
  )
}
