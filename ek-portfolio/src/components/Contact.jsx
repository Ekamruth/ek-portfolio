import { motion } from 'framer-motion'
import { GitFork, Link, FileText, Globe, Download } from 'lucide-react'
import { person, socialLinks } from '../data/portfolio'

const iconMap = {
  GitHub:   <GitFork size={14} />,
  LinkedIn: <Link size={14} />,
  Resume:   <FileText size={14} />,
  Website:  <Globe size={14} />,
}

const ease = [0.22, 1, 0.36, 1]
const viewport = { once: true }

export function Contact() {
  return (
    <section id="contact">
      <motion.p
        className="sec-label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.5, ease }}
      >
        Contact
      </motion.p>

      <motion.h2
        className="ct-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease }}
      >
        Let&apos;s build<br />something sharp.
      </motion.h2>

      <motion.p
        className="text-[1.125rem] text-muted mb-[3.25rem] leading-[1.65]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        Open to senior roles, contract work, and interesting problems.
      </motion.p>

      <motion.a
        href={`mailto:${person.email}`}
        className="ct-email"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        {person.email}
      </motion.a>

      <motion.div
        className="ct-links"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        {socialLinks.map(link =>
          link.label === 'Resume' ? (
            <span key={link.label} className="ct-link-group">
              <a href={link.href} className="ct-link" target="_blank" rel="noreferrer">
                {iconMap[link.label]}
                {link.label}
              </a>
              <a href={link.href} className="ct-link" download aria-label="Download resume">
                <Download size={14} />
              </a>
            </span>
          ) : (
            <a key={link.label} href={link.href} className="ct-link" target="_blank" rel="noreferrer">
              {iconMap[link.label]}
              {link.label}
            </a>
          )
        )}
      </motion.div>
    </section>
  )
}
