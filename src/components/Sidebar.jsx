import { NavLink, useParams } from 'react-router-dom'
import { getModule } from '../App.jsx'
import { useProgress } from '../lib/store.js'

function ChapterIcon({ type, number }) {
  if (type === 'overview') return <span className="ch-icon" aria-hidden>◎</span>
  if (type === 'cheatsheet') return <span className="ch-icon" aria-hidden>★</span>
  if (type === 'exam') return <span className="ch-icon" aria-hidden>✎</span>
  return <span className="ch-num" aria-hidden>{number}</span>
}

export default function Sidebar({ content, open, onClose }) {
  const { moduleId } = useParams()
  const activeModule = getModule(moduleId) || content.modules[0]
  const { isLearned } = useProgress()

  const chapters = activeModule.chapters.filter((c) => c.type === 'chapter')
  const overview = activeModule.chapters.find((c) => c.type === 'overview')
  const exam = activeModule.chapters.find((c) => c.type === 'exam')
  const cheatsheets = activeModule.chapters.filter((c) => c.type === 'cheatsheet')

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-head">
        <NavLink to={`/${activeModule.id}`} className="brand" onClick={onClose}>
          <span className="brand-mark">{activeModule.brandMark}</span>
          <span className="brand-text">
            <strong>{content.platformTitle}</strong>
            <small>{activeModule.title}</small>
          </span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <NavLink to={`/${activeModule.id}`} end className="nav-item" onClick={onClose}>
          <span className="ch-icon" aria-hidden>⌂</span>
          <span className="nav-label">Übersicht</span>
        </NavLink>

        <div className="nav-section">Kapitel</div>
        {chapters.map((ch) => (
          <NavLink
            key={ch.slug}
            to={`/${activeModule.id}/${ch.slug}`}
            className="nav-item"
            onClick={onClose}
          >
            <ChapterIcon type={ch.type} number={ch.number} />
            <span className="nav-label">{ch.shortTitle}</span>
            {isLearned(activeModule.id, ch.slug) && (
              <span className="nav-check" title="gelernt" aria-hidden>✓</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section">Hilfsmittel</div>
        {overview && (
          <NavLink to={`/${activeModule.id}/${overview.slug}`} className="nav-item" onClick={onClose}>
            <ChapterIcon type="overview" />
            <span className="nav-label">{overview.shortTitle}</span>
          </NavLink>
        )}
        {exam && (
          <NavLink to={`/${activeModule.id}/${exam.slug}`} className="nav-item" onClick={onClose}>
            <ChapterIcon type="exam" />
            <span className="nav-label">{exam.shortTitle}</span>
          </NavLink>
        )}
        {cheatsheets.map((cs) => (
          <NavLink key={cs.slug} to={`/${activeModule.id}/${cs.slug}`} className="nav-item" onClick={onClose}>
            <ChapterIcon type="cheatsheet" />
            <span className="nav-label">{cs.shortTitle}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <small>Offline-Lernplattform · lokal nutzbar</small>
      </div>
    </aside>
  )
}
