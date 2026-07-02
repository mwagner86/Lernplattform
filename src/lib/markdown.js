import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js/lib/common'

// GitHub-ähnliche Slugs für Überschriften-IDs (für In-Page-Navigation/TOC).
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && lang !== 'mermaid' && hljs.getLanguage(lang)) {
      try {
        return `<pre class="code-block"><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (_) { /* fallthrough */ }
    }
    return `<pre class="code-block"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  },
})

md.use(anchor, {
  slugify,
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    class: 'header-anchor',
    placement: 'before',
  }),
})

// Mermaid-Codeblöcke werden zu Platzhaltern; das Rendering passiert clientseitig
// (theme-abhängig) in der Mermaid-Komponente.
const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules)
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token.info.trim().toLowerCase() === 'mermaid') {
    return `<div class="mermaid-block" data-mermaid="${encodeURIComponent(token.content)}"></div>`
  }
  return defaultFence(tokens, idx, options, env, self)
}

// Interne .md-Links auf Hash-Routen umschreiben; Quellverweise (../) entschärfen.
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const hrefIdx = token.attrIndex('href')
  if (hrefIdx >= 0) {
    let href = token.attrs[hrefIdx][1]
    const env_ = env || {}
    const [pathPart, hash] = href.split('#')
    const fileMatch = pathPart.match(/([^/\\]+)\.md$/i)
    if (fileMatch) {
      const slug = fileMatch[1]
      if (env_.slugSet && env_.slugSet.has(slug) && env_.moduleId) {
        token.attrs[hrefIdx][1] = `#/${env_.moduleId}/${slug}${hash ? '#' + hash : ''}`
      }
    } else if (/^\.\.?\//.test(pathPart)) {
      // Verweise ins Skript/PDFs sind offline nicht erreichbar -> als inaktiv markieren.
      token.attrs[hrefIdx][1] = '#'
      token.attrPush(['data-external', 'source'])
      token.attrPush(['title', 'Quelle (lokal im Projektordner)'])
    } else if (/^https?:/.test(pathPart)) {
      token.attrPush(['target', '_blank'])
      token.attrPush(['rel', 'noopener noreferrer'])
    }
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function renderMarkdown(markdown, { moduleId, slugSet } = {}) {
  return md.render(markdown, { moduleId, slugSet })
}

// Karteikarten aus dem Abschnitt "Klausurfragen — Musterantworten" extrahieren.
export function extractFlashcards(markdown) {
  const lines = markdown.split('\n')
  let start = -1
  let end = lines.length
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Klausurfragen/i.test(lines[i])) { start = i + 1; continue }
    if (start >= 0 && /^##\s+/.test(lines[i])) { end = i; break }
  }
  if (start < 0) return []

  const section = lines.slice(start, end).join('\n').trim()
  // In Blöcke teilen, die mit "**<Zahl>." beginnen.
  const blocks = section.split(/\n(?=\*\*\d+\.)/)
  const cards = []
  for (const block of blocks) {
    const m = block.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/)
    if (!m) continue
    const front = m[1].replace(/\s+/g, ' ').trim()
    const back = m[2].trim()
    if (!front) continue
    cards.push({ front, back })
  }
  return cards
}

export default md
