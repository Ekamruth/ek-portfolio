import { person } from '../data/portfolio'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <span className="font-mono text-[0.6875rem] text-dim tracking-[0.06em]">
        &copy; {year} {person.name} <em className="text-accent not-italic">&mdash;</em> Built with intent
      </span>
      <span className="font-mono text-[0.6875rem] text-dim tracking-[0.06em]">
        Designed &amp; developed in <em className="text-accent not-italic">{person.location}</em>
      </span>
    </footer>
  )
}
