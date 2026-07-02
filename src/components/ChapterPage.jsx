import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getModule } from '../App.jsx'
import { useProgress } from '../lib/store.js'
import { extractFlashcards } from '../lib/markdown.js'
import MarkdownContent from './MarkdownContent.jsx'
import Flashcards from './Flashcards.jsx'

function useTocFromDom(containerRef, deps) {
  const [toc, setToc] = useState([])
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const hs = Array.from(root.querySelectorAll('h2, h3'))
    setToc(
      hs.map((h) => ({
        id: h.id,
        text: h.textContent.replace(/^#/, '').trim(),
        level: h.tagName === 'H2' ? 2 : 3,
      }))
    )
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return toc
}

export default function ChapterPage() {
  const { moduleId, slug } = useParams()
  const mod = getModule(moduleId)
  const { isLearned, toggleLearned } = useProgress()
  const [tab, setTab] = useState('summary')
  const contentRef = useRef(null)

  const slugSet = useMemo(() => new Set(mod.chapters.map((c) => c.slug)), [mod])
  const chapter = mod.chapters.find((c) => c.slug === slug)

  const navList = mod.chapters
  const idx = navList.findIndex((c) => c.slug === slug)
  const prev = idx > 0 ? navList[idx - 1] : null
  const next = idx < navList.length - 1 ? navList[idx + 1] : null

  const flashcards = useMemo(
    () => (chapter ? extractFlashcards(chapter.markdown) : []),
    [chapter]
  )

  const toc = useTocFromDom(contentRef, [slug, tab])

  // Bei Kapitelwechsel nach oben scrollen und auf Zusammenfassung zurücksetzen.
  useEffect(() => {
    setTab('summary')
    const sc = document.querySelector('.app-content')
    if (sc) sc.scrollTo({ top: 0 })
    // Anker aus der URL anspringen.
    const hash = window.location.hash.split('#')[2]
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(hash))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }
  }, [slug])

  if (!chapter) {
    return (
      <div className="page">
        <p>Kapitel nicht gefunden. <Link to={`/${moduleId}`}>Zur Übersicht</Link></p>
      </div>
    )
  }

  const learned = isLearned(mod.id, slug)
  const hasFlashcards = flashcards.length > 0

  return (
    <div className="page page-chapter">
      <div className="chapter-layout">
        <article className="chapter-main">
          <div className="chapter-head">
            <p className="eyebrow">
              {chapter.type === 'cheatsheet'
                ? 'Spickzettel'
                : chapter.type === 'overview'
                ? 'Übersicht'
                : chapter.type === 'exam'
                ? 'Prüfungsfragen'
                : `${mod.title} · Kapitel ${chapter.number}`}
            </p>
            <h1>{chapter.title}</h1>
          </div>

          {(hasFlashcards || chapter.type === 'chapter') && (
            <div className="tabs">
              <button
                className={`tab ${tab === 'summary' ? 'is-active' : ''}`}
                onClick={() => setTab('summary')}
              >
                Zusammenfassung
              </button>
              {hasFlashcards && (
                <button
                  className={`tab ${tab === 'cards' ? 'is-active' : ''}`}
                  onClick={() => setTab('cards')}
                >
                  Karteikarten <span className="tab-count">{flashcards.length}</span>
                </button>
              )}
            </div>
          )}

          <div ref={contentRef}>
            {tab === 'summary' ? (
              <MarkdownContent
                markdown={chapter.markdown}
                moduleId={mod.id}
                slugSet={slugSet}
              />
            ) : (
              <Flashcards cards={flashcards} moduleId={mod.id} slugSet={slugSet} />
            )}
          </div>

          {chapter.type === 'chapter' && (
            <div className="learned-bar">
              <button
                className={`btn ${learned ? 'btn-success' : 'btn-outline'}`}
                onClick={() => toggleLearned(mod.id, slug)}
              >
                {learned ? '✓ Als gelernt markiert' : 'Als gelernt markieren'}
              </button>
            </div>
          )}

          <nav className="chapter-nav">
            {prev ? (
              <Link to={`/${mod.id}/${prev.slug}`} className="chapter-nav-link prev">
                <small>Zurück</small>
                <span>{prev.shortTitle}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/${mod.id}/${next.slug}`} className="chapter-nav-link next">
                <small>Weiter</small>
                <span>{next.shortTitle}</span>
              </Link>
            ) : <span />}
          </nav>
        </article>

        {tab === 'summary' && toc.length > 1 && (
          <aside className="chapter-toc">
            <div className="toc-sticky">
              <p className="toc-title">Auf dieser Seite</p>
              <ul>
                {toc.map((h) => (
                  <li key={h.id} className={`toc-l${h.level}`}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        const el = document.getElementById(h.id)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
