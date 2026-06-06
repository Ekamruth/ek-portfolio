import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { workProjects, personalProjects } from '../../data/portfolio'
import { useSparkle } from './PixelSparkle'

function QuestCard({ project, index }) {
  const [revealed, setRevealed] = useState(false)
  const { SparkleContainer } = useSparkle()

  return (
    <motion.div
      className={`pixel-quest-card ${revealed ? 'pixel-quest-card--revealed' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="pixel-quest-header">
        <span className="pixel-quest-num">QUEST #{project.num}</span>
        <span className="pixel-quest-year">{project.year}</span>
      </div>

      {!revealed ? (
        <div className="pixel-quest-locked">
          <div className="pixel-quest-mystery">
            <span className="pixel-lock-icon">&#128274;</span>
            <p className="pixel-quest-hint">{project.title.split(' — ')[0]}</p>
            <p className="pixel-locked-text">[ Quest details locked ]</p>
          </div>
          <SparkleContainer>
            <button
              className="pixel-btn pixel-btn--small"
              onClick={() => setRevealed(true)}
            >
              &#9654; Reveal Quest
            </button>
          </SparkleContainer>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="pixel-quest-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="pixel-quest-title">{project.title}</h3>
            {project.company && (
              <span className="pixel-quest-guild">Guild: {project.company}</span>
            )}
            {project.description && (
              <p className="pixel-quest-desc">{project.description}</p>
            )}
            {project.impact && project.impact.length > 0 && (
              <div className="pixel-quest-rewards">
                <span className="pixel-quest-rewards-label">&#127942; Rewards Earned:</span>
                <ul>
                  {project.impact.map((item) => (
                    <li key={item}>+ {item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pixel-quest-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="pixel-tag">{tag}</span>
              ))}
            </div>
            <div className="pixel-quest-status">&#9733; QUEST COMPLETE</div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export function PixelWork() {
  const allProjects = [...workProjects, ...personalProjects]

  return (
    <section id="pixel-quest" className="pixel-section">
      <div className="pixel-section-header">
        <span className="pixel-section-label">&#9776; Quest Log</span>
        <span className="pixel-section-count">{allProjects.length} quests completed</span>
      </div>
      <div className="pixel-quest-grid">
        {allProjects.map((project, i) => (
          <QuestCard key={project.num} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
