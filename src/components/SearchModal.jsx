import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Leichte, vollständig clientseitige Volltextsuche über alle Kapitel.
function buildIndex(content) {
  const records = []
  for (const mod of content.modules) {
    for (const ch of mod.chapters) {
      records.push({
        moduleId: mod.id,
        slug: ch.slug,
        title: ch.title,
        shortTitle: ch.shortTitle,
        type: ch.type,
        haystack: (ch.title + ' ' + ch.plainText).toLowerCase(),
        text: ch.plainText,
        headings: ch.headings,
      })
    }
  }
  return records
}

function snippet(text, query) {
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i < 0) return text.slice(0, 140) + '…'
  const start = Math.max(0, i - 60)
  const end = Math.min(text.length, i + query.length + 80)
  return (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '')
}

export default function SearchModal({ content, open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const index = useMemo(() => buildIndex(content), [content])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const terms = q.split(/\s+/)
    return index
      .map((r) => {
        let score = 0
        for (const t of terms) {
          if (r.title.toLowerCase().includes(t)) score += 5
          const idx = r.haystack.indexOf(t)
          if (idx >= 0) score += 1
          const hHit = r.headings.find((h) => h.text.toLowerCase().includes(t))
          if (hHit) score += 3
        }
        return { ...r, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [query, index])

  useEffect(() => { setActive(0) }, [query])

  if (!open) return null

  const goTo = (r) => {
    if (!r) return
    navigate(`/${r.moduleId}/${r.slug}`)
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); goTo(results[active]) }
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="search-input-row">
          <span aria-hidden>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="In allen Kapiteln suchen …"
            aria-label="Suche"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="search-results">
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="search-empty">Keine Treffer für „{query}“.</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.moduleId}/${r.slug}`}
              className={`search-result ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => goTo(r)}
            >
              <div className="sr-head">
                <span className="sr-title">{r.shortTitle}</span>
                <span className="sr-type">{r.type === 'chapter' ? 'Kapitel' : r.type === 'cheatsheet' ? 'Spickzettel' : 'Übersicht'}</span>
              </div>
              <p className="sr-snippet">{snippet(r.text, query.trim().split(/\s+/)[0])}</p>
            </button>
          ))}
        </div>

        <div className="search-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigieren</span>
          <span><kbd>↵</kbd> öffnen</span>
        </div>
      </div>
    </div>
  )
}
