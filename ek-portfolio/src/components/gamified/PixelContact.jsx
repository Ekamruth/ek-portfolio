import { useState } from 'react'
import { motion } from 'framer-motion'
import { person, socialLinks } from '../../data/portfolio'

export function PixelContact() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="pixel-contact" className="pixel-section">
      <div className="pixel-section-header">
        <span className="pixel-section-label">&#128231; Message Terminal</span>
      </div>

      <div className="pixel-contact-box">
        {!revealed ? (
          <div className="pixel-contact-locked">
            <p className="pixel-contact-prompt">
              &gt; You have reached the final area.<br />
              &gt; A message portal awaits...<br />
              &gt; _
            </p>
            <button
              className="pixel-btn"
              onClick={() => setRevealed(true)}
            >
              &#9654; Open Portal
            </button>
          </div>
        ) : (
          <motion.div
            className="pixel-contact-revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="pixel-contact-text">
              &gt; Portal opened!<br />
              &gt; Player is open to senior roles, contract work, and interesting problems.
            </p>

            <a href={`mailto:${person.email}`} className="pixel-email">
              &#9993; {person.email}
            </a>

            <div className="pixel-social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="pixel-social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  [{link.label}]
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
