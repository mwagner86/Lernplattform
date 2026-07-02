// Liest die Markdown-Zusammenfassungen (Single Source of Truth) und erzeugt
// src/content.generated.json. Damit bleibt der Inhalt in den .md-Dateien und
// die Plattform ist für weitere Module nur durch Editieren der content.config.json
// erweiterbar (neuer Ordner + Eintrag -> npm run build).

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const config = JSON.parse(readFileSync(join(ROOT, 'content.config.json'), 'utf8'))

// --- Hilfsfunktionen -------------------------------------------------------

function firstHeading(md) {
  const m = md.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : null
}

// Kürzt "UML (Woche 04)" -> "UML" für kompakte Navigation.
function shortTitle(title) {
  return title.replace(/\s*\((?:Woche|Kapitel)[^)]*\)\s*$/i, '').trim()
}

// Erste echte Inhaltszeile (kein Heading, kein Callout) als Fallback-Beschreibung.
function fallbackExcerpt(md) {
  const lines = md.split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('#')) continue
    if (t.startsWith('>')) continue
    if (t.startsWith('|')) continue
    if (t.startsWith('---')) continue
    if (t.startsWith('```')) continue
    return t.replace(/[*_`#]/g, '').slice(0, 180)
  }
  return ''
}

// H2/H3-Überschriften für die In-Page-Navigation und Suche.
function extractHeadings(md) {
  const out = []
  let inFence = false
  for (const line of md.split('\n')) {
    if (line.trim().startsWith('```')) { inFence = !inFence; continue }
    if (inFence) continue
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/)
    if (m) out.push({ level: m[1].length, text: m[2].replace(/[*`]/g, '').trim() })
  }
  return out
}

// Grober Klartext für die Volltextsuche (Markdown-Rauschen entfernt).
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[#*_`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// Beschreibungen aus der Index-Tabelle ziehen: | 01 | [Titel](datei.md) | Themen |
function parseIndexDescriptions(md) {
  const map = {}
  for (const line of md.split('\n')) {
    const m = line.match(/^\|[^|]*\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|\s*(.+?)\s*\|/)
    if (m) {
      const file = basename(m[1].split('#')[0])
      const desc = m[2].replace(/\*\*/g, '').trim()
      if (file.endsWith('.md')) map[file] = desc
    }
  }
  return map
}

function chapterNumber(filename) {
  const m = filename.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

// --- Module verarbeiten ----------------------------------------------------

const modules = []

for (const mod of config.modules) {
  const dir = resolve(ROOT, mod.contentDir)
  const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.md'))

  let indexDescriptions = {}
  if (mod.indexFile && files.includes(mod.indexFile)) {
    indexDescriptions = parseIndexDescriptions(readFileSync(join(dir, mod.indexFile), 'utf8'))
  }

  // Cheatsheets: mehrere möglich (cheatsheetFiles), sonst Fallback auf den einzelnen.
  const cheatsheetFiles = mod.cheatsheetFiles && mod.cheatsheetFiles.length
    ? mod.cheatsheetFiles
    : (mod.cheatsheetFile ? [mod.cheatsheetFile] : [])

  const chapters = []
  for (const file of files) {
    const md = readFileSync(join(dir, file), 'utf8')
    const num = chapterNumber(file)
    const rawTitle = firstHeading(md) || file.replace(/\.md$/, '')

    let type = 'chapter'
    if (file === mod.indexFile) type = 'overview'
    else if (file === mod.examFile) type = 'exam'
    else if (cheatsheetFiles.includes(file)) type = 'cheatsheet'

    chapters.push({
      slug: file.replace(/\.md$/, ''),
      file,
      number: type === 'chapter' ? num : null,
      type,
      title: rawTitle,
      shortTitle: shortTitle(rawTitle),
      description: indexDescriptions[file] || fallbackExcerpt(md),
      markdown: md,
      headings: extractHeadings(md),
      plainText: toPlainText(md),
    })
  }

  // Sortierung: Overview → Kapitel (nach Nummer) → Altklausur → Cheatsheets (Config-Reihenfolge).
  const order = { overview: 0, chapter: 1, exam: 2, cheatsheet: 3 }
  const csIndex = (f) => { const i = cheatsheetFiles.indexOf(f); return i < 0 ? 999 : i }
  chapters.sort((a, b) => {
    if (order[a.type] !== order[b.type]) return order[a.type] - order[b.type]
    if (a.type === 'chapter') return (a.number ?? 0) - (b.number ?? 0)
    if (a.type === 'cheatsheet') return csIndex(a.file) - csIndex(b.file)
    return a.file.localeCompare(b.file)
  })

  modules.push({
    id: mod.id,
    title: mod.title,
    subtitle: mod.subtitle || '',
    brandMark: mod.brandMark || mod.id.slice(0, 3).toUpperCase(),
    chapters,
  })
}

const output = {
  platformTitle: config.platformTitle,
  platformSubtitle: config.platformSubtitle || '',
  defaultModule: config.defaultModule || modules[0]?.id,
  generatedAt: new Date().toISOString(),
  modules,
}

writeFileSync(join(ROOT, 'src', 'content.generated.json'), JSON.stringify(output, null, 2))

const total = modules.reduce((n, m) => n + m.chapters.length, 0)
console.log(`✓ content.generated.json: ${modules.length} Modul(e), ${total} Seite(n)`)
