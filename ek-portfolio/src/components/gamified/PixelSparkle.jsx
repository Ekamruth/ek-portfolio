import { useState, useCallback } from 'react'

function SparkleParticle({ x, y, color, size, delay }) {
  return (
    <div
      className="pixel-sparkle-particle"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        animationDelay: `${delay}ms`,
      }}
    />
  )
}

export function useSparkle() {
  const [sparkles, setSparkles] = useState([])

  const triggerSparkle = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const colors = ['var(--pixel-amber)', 'var(--pixel-coral)', 'var(--pixel-cyan)', 'var(--pixel-amber-bright)']

    const newSparkles = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const dist = 20 + Math.random() * 30
      return {
        id: Date.now() + i,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        color: colors[i % colors.length],
        size: 3 + Math.random() * 4,
        delay: i * 30,
      }
    })

    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 800)
  }, [])

  const SparkleContainer = useCallback(({ children, className = '', onClick, ...props }) => {
    const handleClick = (e) => {
      triggerSparkle(e)
      onClick?.(e)
    }

    return (
      <div className={`pixel-sparkle-wrap ${className}`} onClick={handleClick} {...props}>
        {children}
        {sparkles.length > 0 && (
          <div className="pixel-sparkle-container">
            {sparkles.map((s) => (
              <SparkleParticle key={s.id} {...s} />
            ))}
          </div>
        )}
      </div>
    )
  }, [sparkles, triggerSparkle])

  return { SparkleContainer, triggerSparkle }
}
