import { motion } from 'framer-motion'
import { person, socialLinks } from '../../data/portfolio'

export function PixelContact() {
  return (
    <section id="pixel-contact" className="pixel-section">
      <div className="pixel-section-header">
        <span className="pixel-section-label">&#128231; Message Terminal</span>
      </div>

      <div className="pixel-contact-box">
        <motion.div
          className="pixel-contact-revealed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="pixel-contact-text">
            &gt; You have reached the final area.<br />
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
      </div>
    </section>
  )
}
