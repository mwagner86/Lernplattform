import { Link, useParams } from 'react-router-dom'
import { getModule } from '../App.jsx'
import { useProgress } from '../lib/store.js'
import { extractFlashcards } from '../lib/markdown.js'

export default function Home() {
  const { moduleId } = useParams()
  const mod = getModule(moduleId)
  const { isLearned, countLearned } = useProgress()

  const chapters = mod.chapters.filter((c) => c.type === 'chapter')
  const overview = mod.chapters.find((c) => c.type === 'overview')
  const exam = mod.chapters.find((c) => c.type === 'exam')
  const cheatsheets = mod.chapters.filter((c) => c.type === 'cheatsheet')
  const cheatsheet = cheatsheets[0]
  const learned = countLearned(mod.id, chapters.map((c) => c.slug))
  const pct = chapters.length ? Math.round((learned / chapters.length) * 100) : 0
  const totalCards = chapters.reduce((n, c) => n + extractFlashcards(c.markdown).length, 0)

  return (
    <div className="page page-home">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">{mod.subtitle}</p>
          <h1>{mod.title}</h1>
          <p className="hero-lead">
            Deine Single Source of Truth für die Klausur: alle Kapitel, Karteikarten
            zum Selbsttest und der Spickzettel — vollständig offline nutzbar.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={`/${mod.id}/${chapters[0]?.slug}`}>
              Lernen starten
            </Link>
            {cheatsheet && (
              <Link className="btn btn-ghost" to={`/${mod.id}/${cheatsheet.slug}`}>
                ★ Spickzettel
              </Link>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="progress-ring" style={{ '--pct': pct }}>
            <span>{pct}%</span>
          </div>
          <ul className="stat-list">
            <li><strong>{chapters.length}</strong> Kapitel</li>
            <li><strong>{learned}</strong> gelernt</li>
            <li><strong>{totalCards}</strong> Karteikarten</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="section-title">Kapitel</h2>
        <div className="card-grid">
          {chapters.map((ch) => {
            const done = isLearned(mod.id, ch.slug)
            const cards = extractFlashcards(ch.markdown).length
            return (
              <Link key={ch.slug} to={`/${mod.id}/${ch.slug}`} className={`card ${done ? 'card-done' : ''}`}>
                <div className="card-top">
                  <span className="card-badge">{ch.number}</span>
                  {done && <span className="card-check" title="gelernt">✓</span>}
                </div>
                <h3>{ch.shortTitle}</h3>
                <p>{ch.description}</p>
                <div className="card-foot">
                  {cards > 0 && <span className="chip">{cards} Karten</span>}
                  <span className="card-go">Öffnen →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="quick-links">
        {overview && (
          <Link to={`/${mod.id}/${overview.slug}`} className="qlink">
            <span className="qlink-icon">◎</span>
            <span>
              <strong>{overview.shortTitle}</strong>
              <small>Navigation & Übersicht</small>
            </span>
          </Link>
        )}
        {exam && (
          <Link to={`/${mod.id}/${exam.slug}`} className="qlink">
            <span className="qlink-icon">✎</span>
            <span>
              <strong>{exam.shortTitle}</strong>
              <small>{exam.description || 'Prüfungsfragen mit Musterlösungen'}</small>
            </span>
          </Link>
        )}
        {cheatsheets.map((cs) => (
          <Link key={cs.slug} to={`/${mod.id}/${cs.slug}`} className="qlink">
            <span className="qlink-icon">★</span>
            <span>
              <strong>{cs.shortTitle}</strong>
              <small>{/Last-?Minute/i.test(cs.slug) ? 'Ausführliche Last-Minute-Lernhilfe (2–3 A4)' : 'Verdichtet auf 1 DIN-A4-Seite'}</small>
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
