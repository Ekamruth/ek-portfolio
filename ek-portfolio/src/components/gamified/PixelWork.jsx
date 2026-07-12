import { motion } from 'framer-motion'
import { workProjects, personalProjects } from '../../data/portfolio'

/* Fallback (reduced-motion / mobile / no-WebGL) quest log — no locks,
 * details are always visible. The full experience is the 3D world. */
function QuestCard({ project, index }) {
  return (
    <motion.div
      className="pixel-quest-card pixel-quest-card--revealed"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="pixel-quest-header">
        <span className="pixel-quest-num">QUEST #{project.num}</span>
        <span className="pixel-quest-year">{project.year}</span>
      </div>

      <div className="pixel-quest-details">
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
      </div>
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
