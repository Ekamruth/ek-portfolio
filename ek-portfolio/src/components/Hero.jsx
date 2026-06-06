import { motion } from 'framer-motion'
import { person } from '../data/portfolio'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3V10" />
    </svg>
  )
}

const ease = [0.22, 1, 0.36, 1]

export function Hero() {
  return (
    <section id="hero">
      <div className="h-bg-mark" aria-hidden="true">EK</div>
      <div className="vline" style={{ right: '8.75rem' }} />
      <div className="vline" style={{ left: '23.75rem' }} />

      <motion.div
        className="h-status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        <div className="h-dot" />
        <span>Available for new engagements &mdash; {new Date().getFullYear()}</span>
      </motion.div>

      <motion.h1
        className="h-name"
        initial={{ opacity: 0, filter: 'blur(20px)', letterSpacing: '0.15em' }}
        animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '-0.035em' }}
        transition={{ duration: 1, delay: 0.4, ease }}
      >
        {person.name}
      </motion.h1>

      <motion.div
        className="h-meta"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease }}
      >
        <p className="h-tagline">
          <strong>{person.role}.</strong>
          <br />
          {person.tagline} Based in {person.location}, working globally.
        </p>
        <div className="h-ctas">
          <a href="#work" className="btn">
            Selected Work
            <ArrowIcon />
          </a>
          <a href="#contact" className="btn-ghost">
            Get in touch <span className="arr">&#x2192;</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
