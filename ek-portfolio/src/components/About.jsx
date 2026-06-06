import { motion } from 'framer-motion'
import { skills, stats } from '../data/portfolio'

const ease = [0.22, 1, 0.36, 1]
const viewport = { once: true, margin: '-60px' }

const skillGroups = [
  { label: 'Core', items: skills.core },
  { label: 'Real-time & AI', items: skills.realtime },
  { label: 'Architecture & Performance', items: skills.architecture },
  { label: 'Backend & APIs', items: skills.backend },
  { label: 'Libraries & Tooling', items: skills.tooling },
]

export function About() {
  return (
    <section id="about">
      <div>
        <motion.p
          className="sec-label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, ease }}
        >
          About
        </motion.p>

        {[
          <>I&apos;m a <strong>Frontend Engineer with 4+ years of experience</strong> building scalable, high-performance web applications — currently at <strong>Modak</strong>, where I own the AI chat interfaces for enterprise platforms used by data engineering teams at scale.</>,
          <>My focus sits at the intersection of <strong>AI interfaces and frontend architecture</strong> — building real-time streaming UIs, reusable rendering systems, and the kind of conversational experiences that make complex enterprise workflows feel effortless. I&apos;ve shipped production systems that cut bundle sizes by <strong>70%</strong>, reduced code duplication by <strong>40–70%</strong>, and improved load times by <strong>60%</strong>.</>,
          <>Outside of code — you&apos;ll find me in the gym, planning a trek, playing violin, grinding ranked games, or deep in a rabbit hole about AI, investing, or systems thinking. I care about <strong>discipline, consistency, and building things that last.</strong></>,
        ].map((content, i) => (
          <motion.p
            key={i}
            className="ab-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease }}
          >
            {content}
          </motion.p>
        ))}

        <motion.div
          className="stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.25, ease }}
        >
          {stats.map(s => (
            <div key={s.label} className="stat">
              <div className="text-[3.25rem] font-bold tracking-[-0.04em] leading-none text-[var(--text)] mb-1.5">
                {s.num}<em className="text-accent not-italic">{s.suffix}</em>
              </div>
              <div className="font-mono text-[0.625rem] text-muted uppercase tracking-[0.1em]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="ab-right"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, delay: 0.15, ease }}
      >
        {skillGroups.map(group => (
          <div key={group.label} className="mb-9">
            <div className="font-mono text-[0.625rem] text-dim uppercase tracking-[0.12em] mb-3.5">{group.label}</div>
            <div className="flex flex-wrap gap-2">
              {group.items.map(s => <span key={s} className="sk">{s}</span>)}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
