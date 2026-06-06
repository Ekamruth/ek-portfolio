import { workProjects, personalProjects } from '../data/portfolio'

function ArrowDiagIcon({ className = 'wi-arr' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16L16 4M16 4H7M16 4V13" />
    </svg>
  )
}

function LockIcon({ className = 'wi-arr' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="12" height="9" rx="1" />
      <path d="M7 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function WorkCard({ num, title, company, description, impact, tags, year, href }) {
  const isClickable = href && href !== '#'
  return (
    <article
      className="wcard"
      onClick={() => isClickable && window.open(href, '_blank')}
    >
      <div className="wcard-head">
        <span className="wcard-num">{num}</span>
        <span className="wcard-year">{year}</span>
      </div>

      <div className="wcard-body">
        <h2 className="wcard-title">{title}</h2>
        {company && <span className="wcard-company">{company}</span>}
        {description && <p className="wcard-desc">{description}</p>}
        {impact && impact.length > 0 && (
          <ul className="wcard-impact">
            {impact.map(i => <li key={i} className="wcard-pill">{i}</li>)}
          </ul>
        )}
      </div>

      <div className="wcard-foot">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        {isClickable ? <ArrowDiagIcon className="wcard-icon" /> : <LockIcon className="wcard-icon" />}
      </div>
    </article>
  )
}

function WorkItem({ num, title, company, description, impact, tags, year, href }) {
  const isClickable = href && href !== '#'
  return (
    <li className="wi" onClick={() => isClickable && window.open(href, '_blank')}>
      <div className="wi-inner">
        <span className="wi-num">{num}</span>
        <div className="flex flex-col gap-2">
          <div className="wi-title">{title}</div>
          {company && (
            <span className="font-mono text-[0.625rem] text-accent uppercase tracking-[0.1em]">{company}</span>
          )}
          {description && (
            <p className="text-sm text-muted leading-[1.6] max-w-[37.5rem] mt-1">{description}</p>
          )}
          {impact && (
            <div className="flex flex-wrap gap-2 mt-1.5">
              {impact.map(i => (
                <span key={i} className="font-mono text-[0.625rem] text-accent tracking-[0.06em] px-2 py-0.5 border border-accent/20 bg-accent/5">{i}</span>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </div>
        <div className="wi-end">
          <span>{year}</span>
          {isClickable ? <ArrowDiagIcon /> : <LockIcon />}
        </div>
      </div>
    </li>
  )
}

export function Work() {
  return (
    <>
      {/* ── Horizontal card showcase — CSS sticky + GSAP scrub ── */}
      <div className="work-sticky-wrapper">
        <div id="work">
          <p className="sec-label wshowcase-label">Work Projects</p>
          <div className="work-track">
            {workProjects.map(item => <WorkCard key={item.num} {...item} />)}
          </div>
          <div className="work-progress-bar">
            <div className="work-progress-fill" />
          </div>
        </div>
      </div>

      {/* ── Personal projects — vertical list ── */}
      <section id="personal-work">
        <p className="sec-label">Personal Projects</p>
        {personalProjects.length === 0 ? (
          <div className="py-12 border-t border-b border-[var(--border)]">
            <span className="font-mono text-xs text-dim tracking-[0.08em]">
              Building something interesting — check back soon.
            </span>
          </div>
        ) : (
          <ul className="wlist">
            {personalProjects.map(item => (
              <WorkItem key={item.num} {...item} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
