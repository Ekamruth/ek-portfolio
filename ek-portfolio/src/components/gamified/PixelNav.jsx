import { useScrolled } from '../../hooks/useScrolled'
import { usePortfolioMode } from '../../store/usePortfolioMode'
import { person } from '../../data/portfolio'

export function PixelNav() {
  const scrolled = useScrolled(50)
  const resetMode = usePortfolioMode((s) => s.resetMode)

  return (
    <nav className={`pixel-nav ${scrolled ? 'pixel-nav--scrolled' : ''}`}>
      <a href="#" className="pixel-nav-logo">
        &lt;{person.initials}/&gt;
      </a>
      <ul className="pixel-nav-links">
        <li><a href="#pixel-quest">Quests</a></li>
        <li><a href="#pixel-skills">Skills</a></li>
        <li><a href="#pixel-contact">Connect</a></li>
      </ul>
      <button className="pixel-mode-btn" onClick={resetMode}>
        [ Switch Mode ]
      </button>
    </nav>
  )
}
