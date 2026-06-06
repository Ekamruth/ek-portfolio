import { person } from '../../data/portfolio'

export function PixelFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="pixel-footer">
      <span>&copy; {year} {person.name}</span>
      <span>Crafted with &#9829; in {person.location}</span>
      <span>GAME OVER? Never.</span>
    </footer>
  )
}
