export function PixelClouds() {
  return (
    <div className="pixel-clouds" aria-hidden="true">
      <svg className="pixel-cloud pixel-cloud--1" width="80" height="32" viewBox="0 0 20 8" shapeRendering="crispEdges">
        <rect x="4" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
        <rect x="2" y="2" width="8" height="2" fill="var(--pixel-cloud)" />
        <rect x="0" y="4" width="14" height="2" fill="var(--pixel-cloud)" />
        <rect x="10" y="2" width="6" height="2" fill="var(--pixel-cloud)" />
        <rect x="12" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
        <rect x="2" y="6" width="16" height="2" fill="var(--pixel-cloud)" />
      </svg>
      <svg className="pixel-cloud pixel-cloud--2" width="64" height="24" viewBox="0 0 16 6" shapeRendering="crispEdges">
        <rect x="3" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
        <rect x="1" y="2" width="10" height="2" fill="var(--pixel-cloud)" />
        <rect x="0" y="4" width="14" height="2" fill="var(--pixel-cloud)" />
        <rect x="9" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
      </svg>
      <svg className="pixel-cloud pixel-cloud--3" width="96" height="32" viewBox="0 0 24 8" shapeRendering="crispEdges">
        <rect x="6" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
        <rect x="14" y="0" width="4" height="2" fill="var(--pixel-cloud)" />
        <rect x="4" y="2" width="16" height="2" fill="var(--pixel-cloud)" />
        <rect x="2" y="4" width="20" height="2" fill="var(--pixel-cloud)" />
        <rect x="0" y="6" width="24" height="2" fill="var(--pixel-cloud)" />
      </svg>
    </div>
  )
}

export function PixelGround({ variant = 'default' }) {
  const colors = {
    default: { grass: 'var(--pixel-amber)', dirt: 'var(--pixel-amber-dim)', dark: 'var(--pixel-bg2)' },
    quest: { grass: 'var(--pixel-coral)', dirt: 'var(--pixel-coral-dim)', dark: 'var(--pixel-bg2)' },
    skills: { grass: 'var(--pixel-cyan)', dirt: 'var(--pixel-cyan-dim)', dark: 'var(--pixel-bg2)' },
  }
  const c = colors[variant] || colors.default

  return (
    <div className="pixel-ground" aria-hidden="true">
      <svg width="100%" height="24" preserveAspectRatio="none" viewBox="0 0 120 6" shapeRendering="crispEdges">
        {Array.from({ length: 60 }).map((_, i) => (
          <rect
            key={i}
            x={i * 2}
            y={0}
            width="2"
            height="2"
            fill={i % 7 === 0 ? c.dirt : c.grass}
            opacity={0.6 + Math.random() * 0.4}
          />
        ))}
        {Array.from({ length: 60 }).map((_, i) => (
          <rect
            key={`d${i}`}
            x={i * 2}
            y={2}
            width="2"
            height="4"
            fill={c.dirt}
            opacity={0.3 + Math.random() * 0.3}
          />
        ))}
      </svg>
    </div>
  )
}

export function PixelDivider() {
  return (
    <div className="pixel-divider" aria-hidden="true">
      <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 200 2" shapeRendering="crispEdges">
        {Array.from({ length: 100 }).map((_, i) => (
          <rect
            key={i}
            x={i * 2}
            y={0}
            width="2"
            height="2"
            fill={i % 3 === 0 ? 'var(--pixel-amber)' : i % 3 === 1 ? 'var(--pixel-coral)' : 'var(--pixel-cyan)'}
            opacity={0.3 + (i % 5) * 0.15}
          />
        ))}
      </svg>
    </div>
  )
}
