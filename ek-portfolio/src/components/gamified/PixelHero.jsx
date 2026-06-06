import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { person } from '../../data/portfolio'

function TypewriterText({ text, delay = 0, speed = 50 }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timeout)
  }, [displayed, started, text, speed])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="pixel-cursor">_</span>}
    </span>
  )
}

export function PixelHero() {
  return (
    <section className="pixel-hero">
      <div className="pixel-scanlines" aria-hidden="true" />
      <motion.div
        className="pixel-hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pixel-status-bar">
          <span className="pixel-hp">HP: ████████ 100%</span>
          <span className="pixel-level">LVL 4+</span>
        </div>

        <div className="pixel-terminal">
          <div className="pixel-terminal-header">
            <span className="pixel-terminal-dot" />
            <span className="pixel-terminal-dot" />
            <span className="pixel-terminal-dot" />
            <span className="pixel-terminal-title">player_info.exe</span>
          </div>
          <div className="pixel-terminal-body">
            <p className="pixel-prompt">
              <span className="pixel-prompt-char">&gt; </span>
              <TypewriterText text={`PLAYER: ${person.name}`} delay={500} speed={40} />
            </p>
            <p className="pixel-prompt">
              <span className="pixel-prompt-char">&gt; </span>
              <TypewriterText text={`CLASS: ${person.role}`} delay={2000} speed={40} />
            </p>
            <p className="pixel-prompt">
              <span className="pixel-prompt-char">&gt; </span>
              <TypewriterText text={`BASE: ${person.location}`} delay={3200} speed={40} />
            </p>
            <p className="pixel-prompt">
              <span className="pixel-prompt-char">&gt; </span>
              <TypewriterText text="STATUS: Available for new quests" delay={4200} speed={40} />
            </p>
          </div>
        </div>

        <motion.div
          className="pixel-hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 5.5 }}
        >
          <a href="#pixel-quest" className="pixel-btn">
            &#9654; View Quest Log
          </a>
          <a href="#pixel-contact" className="pixel-btn pixel-btn--ghost">
            &#9654; Send Message
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
