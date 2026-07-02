import { useEffect, useMemo, useState } from 'react'
import MarkdownContent from './MarkdownContent.jsx'

export default function Flashcards({ cards, moduleId, slugSet }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setOrder(cards.map((_, i) => i))
    setPos(0)
    setRevealed(false)
  }, [cards])

  const current = useMemo(() => cards[order[pos]], [cards, order, pos])

  if (!cards.length) return <p>Keine Karteikarten für dieses Kapitel.</p>

  const go = (delta) => {
    setRevealed(false)
    setPos((p) => Math.min(Math.max(p + delta, 0), cards.length - 1))
  }

  const shuffle = () => {
    const a = cards.map((_, i) => i)
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    setOrder(a)
    setPos(0)
    setRevealed(false)
  }

  return (
    <div className="flashcards">
      <div className="fc-toolbar">
        <span className="fc-counter">Karte {pos + 1} / {cards.length}</span>
        <button className="btn btn-ghost btn-sm" onClick={shuffle}>⤮ Mischen</button>
      </div>

      <div
        className={`flashcard ${revealed ? 'is-revealed' : ''}`}
        onClick={() => setRevealed((r) => !r)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed((r) => !r) } }}
      >
        <div className="fc-side fc-front">
          <span className="fc-tag">Frage</span>
          <MarkdownContent markdown={current.front} moduleId={moduleId} slugSet={slugSet} />
          {!revealed && <p className="fc-hint">Tippen zum Aufdecken</p>}
        </div>
        {revealed && (
          <div className="fc-side fc-back">
            <span className="fc-tag fc-tag-answer">Antwort</span>
            <MarkdownContent markdown={current.back} moduleId={moduleId} slugSet={slugSet} />
          </div>
        )}
      </div>

      <div className="fc-nav">
        <button className="btn btn-outline" onClick={() => go(-1)} disabled={pos === 0}>← Zurück</button>
        <button className="btn btn-primary" onClick={() => setRevealed((r) => !r)}>
          {revealed ? 'Verbergen' : 'Aufdecken'}
        </button>
        <button className="btn btn-outline" onClick={() => go(1)} disabled={pos === cards.length - 1}>Weiter →</button>
      </div>
    </div>
  )
}
