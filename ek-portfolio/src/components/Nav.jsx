import { useScrolled } from '../hooks/useScrolled'
import { usePortfolioMode } from '../store/usePortfolioMode'
import { person } from '../data/portfolio'

export function Nav() {
  const scrolled = useScrolled(50)
  const resetMode = usePortfolioMode((s) => s.resetMode)

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="nav-logo">
        {person.initials}<em>.</em>dev
      </a>
      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        <li>
          <span className="nav-ai-badge">
            <span className="nav-ai-dot" />
            AI
            <span className="nav-ai-soon">Soon</span>
          </span>
        </li>
        <li>
          <button className="nav-mode-btn" onClick={resetMode}>
            Switch View
          </button>
        </li>
      </ul>
    </nav>
  )
}
