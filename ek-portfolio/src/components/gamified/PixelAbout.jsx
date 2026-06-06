import { useState } from 'react'
import { motion } from 'framer-motion'
import { skills, stats, experience } from '../../data/portfolio'
import { useSparkle } from './PixelSparkle'

const skillGroups = [
  { label: 'Core', icon: '&#9876;', items: skills.core },
  { label: 'Real-time & AI', icon: '&#9889;', items: skills.realtime },
  { label: 'Architecture', icon: '&#127981;', items: skills.architecture },
  { label: 'Backend & APIs', icon: '&#128295;', items: skills.backend },
  { label: 'Libraries & Tooling', icon: '&#128736;', items: skills.tooling },
]

function SkillTree({ group, index }) {
  const [unlocked, setUnlocked] = useState(false)
  const { SparkleContainer } = useSparkle()

  return (
    <motion.div
      className="pixel-skill-group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="pixel-skill-header">
        <span
          className="pixel-skill-icon"
          dangerouslySetInnerHTML={{ __html: group.icon }}
        />
        <span className="pixel-skill-label">{group.label}</span>
        {!unlocked && (
          <SparkleContainer>
            <button
              className="pixel-btn pixel-btn--tiny"
              onClick={() => setUnlocked(true)}
            >
              Unlock
            </button>
          </SparkleContainer>
        )}
      </div>
      <div className={`pixel-skill-items ${unlocked ? 'pixel-skill-items--visible' : ''}`}>
        {group.items.map((skill, i) => (
          <motion.span
            key={skill}
            className="pixel-skill"
            initial={unlocked ? { opacity: 0, scale: 0.5 } : false}
            animate={unlocked ? { opacity: 1, scale: 1 } : false}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export function PixelAbout() {
  return (
    <section id="pixel-skills" className="pixel-section">
      <div className="pixel-section-header">
        <span className="pixel-section-label">&#128100; Player Stats</span>
      </div>

      <div className="pixel-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="pixel-stat">
            <div className="pixel-stat-num">
              {s.num}<span className="pixel-stat-suffix">{s.suffix}</span>
            </div>
            <div className="pixel-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pixel-exp-section">
        <span className="pixel-section-sublabel">&#127942; Experience Points</span>
        {experience.map((exp) => (
          <div key={exp.company + exp.period} className="pixel-exp-item">
            <span className="pixel-exp-role">{exp.role}</span>
            <span className="pixel-exp-company">@ {exp.company}</span>
            <span className="pixel-exp-period">{exp.period}</span>
          </div>
        ))}
      </div>

      <div className="pixel-section-header" style={{ marginTop: '3rem' }}>
        <span className="pixel-section-label">&#127795; Skill Tree</span>
        <span className="pixel-section-count">Click to unlock each branch</span>
      </div>

      <div className="pixel-skill-tree">
        {skillGroups.map((group, i) => (
          <SkillTree key={group.label} group={group} index={i} />
        ))}
      </div>
    </section>
  )
}
