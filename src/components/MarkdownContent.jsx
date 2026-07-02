import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { renderMarkdown } from '../lib/markdown.js'
import { useThemeContext } from '../App.jsx'

let mermaidSeq = 0

export default function MarkdownContent({ markdown, moduleId, slugSet }) {
  const ref = useRef(null)
  const { theme } = useThemeContext()
  const html = renderMarkdown(markdown, { moduleId, slugSet })
  // Lightbox-Zustand: gerendertes Diagramm-SVG (HTML) zum Vergrößern + Zoomstufe.
  const [zoomSvg, setZoomSvg] = useState(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      themeVariables: {
        primaryColor: theme === 'dark' ? '#312e81' : '#eef2ff',
        primaryBorderColor: '#6366f1',
        lineColor: theme === 'dark' ? '#94a3b8' : '#64748b',
        fontSize: '15px',
      },
    })

    const blocks = root.querySelectorAll('.mermaid-block')
    let cancelled = false
    blocks.forEach((block) => {
      const code = decodeURIComponent(block.dataset.mermaid || '')
      const id = `mmd-${mermaidSeq++}`
      mermaid
        .render(id, code)
        .then(({ svg }) => {
          if (cancelled) return
          block.innerHTML = svg
          block.classList.add('mermaid-rendered')
          // Vergrößern-Button als Overlay; öffnet die Lightbox mit dem SVG.
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.className = 'diagram-zoom-btn'
          btn.title = 'Diagramm vergrößern'
          btn.setAttribute('aria-label', 'Diagramm vergrößern')
          btn.textContent = '⤢ Vergrößern'
          const open = (e) => {
            e.stopPropagation()
            setScale(1)
            setZoomSvg(block.innerHTML)
          }
          btn.addEventListener('click', open)
          block.appendChild(btn)
          // Klick auf das Diagramm selbst öffnet ebenfalls die Lightbox.
          block.addEventListener('click', open)
        })
        .catch((err) => {
          if (!cancelled) {
            block.innerHTML = `<pre class="code-block mermaid-error">Diagramm konnte nicht gerendert werden.\n\n${
              String(err && err.message ? err.message : err)
            }</pre>`
          }
        })
    })

    // Klausurrelevanz-/Hinweis-Callouts hervorheben.
    root.querySelectorAll('blockquote').forEach((bq) => {
      const text = bq.textContent || ''
      bq.classList.add('callout')
      if (/^\s*Klausurrelevanz/i.test(text)) bq.classList.add('callout-exam')
      else bq.classList.add('callout-note')
    })

    return () => { cancelled = true }
  }, [html, theme])

  // ESC schließt die Lightbox.
  useEffect(() => {
    if (!zoomSvg) return
    const onKey = (e) => { if (e.key === 'Escape') setZoomSvg(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomSvg])

  const clampScale = (s) => Math.min(Math.max(s, 0.5), 4)

  return (
    <>
      <div
        ref={ref}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {zoomSvg && (
        <div className="diagram-lightbox" onClick={() => setZoomSvg(null)}>
          <div className="diagram-lightbox-toolbar" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-ghost btn-sm" onClick={() => setScale((s) => clampScale(s - 0.25))} aria-label="Verkleinern">−</button>
            <span className="diagram-zoom-level">{Math.round(scale * 100)}%</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setScale((s) => clampScale(s + 0.25))} aria-label="Vergrößern">+</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setScale(1)}>Zurücksetzen</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setZoomSvg(null)} aria-label="Schließen">✕ Schließen</button>
          </div>
          <div className="diagram-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <div
              className="diagram-lightbox-svg"
              style={{ transform: `scale(${scale})` }}
              dangerouslySetInnerHTML={{ __html: zoomSvg }}
            />
          </div>
        </div>
      )}
    </>
  )
}
