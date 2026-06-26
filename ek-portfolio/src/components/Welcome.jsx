import { motion } from 'framer-motion'
import { usePortfolioMode } from '../store/usePortfolioMode'
import { person } from '../data/portfolio'

const ease = [0.22, 1, 0.36, 1]

const pixelColors = ['#f59e0b', '#f472b6', '#22d3ee', '#fbbf24']

function PixelGrid() {
  const pixels = []
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = 4 + Math.random() * 8
    const delay = Math.random() * 3
    const duration = 2 + Math.random() * 3
    pixels.push(
      <motion.div
        key={i}
        className="welcome-pixel"
        style={{
          left: `${x}%`,
          background: pixelColors[i % pixelColors.length],
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
        }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      />
    )
  }
  return <>{pixels}</>
}

export function Welcome() {
  const setMode = usePortfolioMode((s) => s.setMode)

  return (
    <div className="welcome">
      <motion.div
        className="welcome-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <span className="welcome-greeting">Welcome to</span>
        <h1 className="welcome-name">{person.name.split(' ')[0]}'s Portfolio</h1>
        <p className="welcome-sub">Choose your experience</p>
      </motion.div>

      <div className="welcome-split">
        <motion.button
          className="welcome-card welcome-card--pro"
          onClick={() => setMode('professional')}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="welcome-card-inner">
            <div className="welcome-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h2 className="welcome-card-title">Professional</h2>
            <p className="welcome-card-desc">Clean, minimal design with smooth animations. A traditional portfolio experience.</p>
            <div className="welcome-card-tags">
              <span>Minimal</span>
              <span>Elegant</span>
              <span>Smooth</span>
            </div>
            <div className="welcome-card-cta">
              Enter <span>&rarr;</span>
            </div>
          </div>
          <div className="welcome-card-line welcome-card-line--pro" />
        </motion.button>

        <div className="welcome-divider">
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.5, ease }}
          />
          <motion.span
            className="welcome-or"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease }}
          >
            OR
          </motion.span>
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.5, ease }}
          />
        </div>

        <motion.button
          className="welcome-card welcome-card--game"
          onClick={() => setMode('gamified')}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PixelGrid />
          <div className="welcome-card-inner">
            <div className="welcome-card-icon welcome-card-icon--pixel">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="4" height="4" />
                <rect x="10" y="4" width="4" height="4" />
                <rect x="16" y="4" width="4" height="4" />
                <rect x="4" y="10" width="4" height="4" />
                <rect x="10" y="10" width="4" height="4" />
                <rect x="16" y="10" width="4" height="4" />
                <rect x="4" y="16" width="4" height="4" />
                <rect x="10" y="16" width="4" height="4" />
                <rect x="16" y="16" width="4" height="4" />
              </svg>
            </div>
            <h2 className="welcome-card-title welcome-card-title--pixel">Gamified</h2>
            <p className="welcome-card-desc">Pixel art theme with interactive reveals. Unlock sections as you explore.</p>
            <div className="welcome-card-tags welcome-card-tags--pixel">
              <span>8-bit</span>
              <span>Interactive</span>
              <span>Fun</span>
            </div>
            <div className="welcome-card-cta welcome-card-cta--pixel">
              Play <span>&rarr;</span>
            </div>
          </div>
          <div className="welcome-card-line welcome-card-line--game" />
        </motion.button>
      </div>

      <motion.div
        className="welcome-teasers"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease }}
      >
        <div className="welcome-ai-teaser">
          <div className="welcome-ai-dot" />
          <div className="welcome-ai-text">
            <span className="welcome-ai-label">Coming Soon</span>
            <span className="welcome-ai-desc">Personal projects section — side projects and experiments</span>
          </div>
        </div>
        <div className="welcome-ai-teaser welcome-ai-teaser--new">
          <div className="welcome-new-dot" />
          <div className="welcome-ai-text">
            <span className="welcome-ai-label welcome-ai-label--new">New Feature</span>
            <span className="welcome-ai-desc">Explore the AI persona in any of the viewing modes</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="welcome-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <span>{person.role} &mdash; {person.location}</span>
      </motion.div>
    </div>
  )
}
