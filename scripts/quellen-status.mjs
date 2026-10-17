// Listet die Quellen des Befüll-Skills — die Unterordner von Quellen/ und die externen
// Pfade aus quellen.config.json — und vergleicht sie mit quellenstand.json: neu, geändert,
// entfernt. Mit --speichern wird der aktuelle Stand als eingearbeitet festgehalten.
//
//   npm run quellen                 # Status anzeigen
//   npm run quellen -- --speichern  # nach erfolgreichem Einarbeiten

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve, relative, basename, extname } from 'node:path'
import { createHash } from 'node:crypto'
import { homedir, platform } from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONFIG = join(ROOT, 'quellen.config.json')
const STAND = join(ROOT, 'quellenstand.json')
const ENDUNGEN = new Set(['.md', '.txt', '.srt', '.pdf', '.ppt', '.pptx'])

const config = existsSync(CONFIG) ? JSON.parse(readFileSync(CONFIG, 'utf8')) : {}

// Alle Dateien unter einem Pfad (Datei oder Ordner), versteckte ausgenommen.
function dateien(pfad) {
  if (statSync(pfad).isFile()) return [pfad]
  return readdirSync(pfad, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .flatMap((e) => (e.isDirectory() ? dateien(join(pfad, e.name)) : [join(pfad, e.name)]))
    .filter((f) => ENDUNGEN.has(extname(f).toLowerCase()))
}

const sha256 = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')

// NFC, damit dieselbe Datei auf macOS und Linux denselben Schlüssel bekommt.
const schluessel = (s) => s.split('\\').join('/').normalize('NFC')

// Wurzel je Betriebssystem: { "darwin": "~/…", "linux": "~/…" } oder ein fester Pfad.
function wurzel(name) {
  const w = config.wurzeln?.[name]
  const p = typeof w === 'string' ? w : w?.[platform()]
  return p ? p.replace(/^~(?=\/|$)/, homedir()) : null
}

const aktuell = {}      // Schlüssel -> { rolle, sha256, pfad }
const erreichbar = []   // Schlüssel-Präfixe, deren Quelle auf dieser Maschine vorhanden ist
const fehlend = []

// Lokale Quellen: Quellen/<Rolle>/…, die README.md der Ordner zählen nicht.
const lokal = join(ROOT, 'Quellen')
for (const e of readdirSync(lokal, { withFileTypes: true })) {
  if (!e.isDirectory()) continue
  for (const f of dateien(join(lokal, e.name))) {
    if (basename(f) === 'README.md') continue
    aktuell[schluessel(relative(ROOT, f))] = { rolle: e.name, sha256: sha256(f), pfad: f }
  }
}
erreichbar.push('Quellen/')

// Externe Quellen: "pfad": "<wurzel>:<Pfad relativ zur Wurzel>".
for (const q of config.extern || []) {
  const i = q.pfad.indexOf(':')
  const name = q.pfad.slice(0, i)
  const basis = wurzel(name)
  const ziel = basis && join(basis, q.pfad.slice(i + 1))
  if (!ziel || !existsSync(ziel)) {
    fehlend.push(`${q.rolle}: ${q.pfad}${basis ? '' : ` (Wurzel „${name}" für ${platform()} nicht gesetzt)`}`)
    continue
  }
  erreichbar.push(schluessel(`${name}:${relative(basis, ziel)}`))
  for (const f of dateien(ziel)) {
    aktuell[schluessel(`${name}:${relative(basis, f)}`)] = { rolle: q.rolle, sha256: sha256(f), pfad: f }
  }
}

const gespeichert = existsSync(STAND) ? JSON.parse(readFileSync(STAND, 'utf8')) : null
const alt = gespeichert?.dateien || {}
const istErreichbar = (k) => erreichbar.some((p) => k === p || k.startsWith(p.endsWith('/') ? p : p + '/'))

const neu = Object.keys(aktuell).filter((k) => !alt[k])
const geaendert = Object.keys(aktuell).filter((k) => alt[k] && alt[k].sha256 !== aktuell[k].sha256)
const entfernt = Object.keys(alt).filter((k) => !aktuell[k] && istErreichbar(k))
const nichtErreichbar = Object.keys(alt).filter((k) => !aktuell[k] && !istErreichbar(k))

// --- Ausgabe ---------------------------------------------------------------

const jeRolle = {}
for (const v of Object.values(aktuell)) jeRolle[v.rolle] = (jeRolle[v.rolle] || 0) + 1
console.log(`Quellen: ${Object.keys(aktuell).length} Dateien — ` +
  Object.entries(jeRolle).map(([r, n]) => `${r} ${n}`).join(', '))
for (const name of Object.keys(config.wurzeln || {})) {
  console.log(`  Wurzel ${name} → ${wurzel(name) ?? `(für ${platform()} nicht gesetzt)`}`)
}

const liste = (titel, zeichen, keys) => {
  console.log(`\n${titel} (${keys.length})`)
  for (const k of keys) {
    const v = aktuell[k] || alt[k]
    console.log(`  ${zeichen} [${v.rolle}] ${aktuell[k]?.pfad ?? k}`)
  }
}

if (!gespeichert) {
  console.log('\nKein quellenstand.json — alles ist neu (Erstbefüllung).')
} else {
  console.log(`\nStand: quellenstand.json vom ${gespeichert.stand}`)
  liste('Neu', '+', neu)
  liste('Geändert', '~', geaendert)
  liste('Entfernt', '-', entfernt)
}
if (fehlend.length) {
  console.log(`\nNicht erreichbar auf dieser Maschine (${fehlend.length})`)
  for (const f of fehlend) console.log(`  ! ${f}`)
}

if (process.argv.includes('--speichern')) {
  const dateienNeu = {}
  // Einträge nicht erreichbarer Quellen behalten, sonst gelten sie anderswo wieder als neu.
  for (const k of nichtErreichbar) dateienNeu[k] = alt[k]
  for (const [k, v] of Object.entries(aktuell)) dateienNeu[k] = { rolle: v.rolle, sha256: v.sha256 }
  const sortiert = Object.fromEntries(Object.entries(dateienNeu).sort(([a], [b]) => a.localeCompare(b)))
  writeFileSync(STAND, JSON.stringify({ stand: new Date().toISOString().slice(0, 10), dateien: sortiert }, null, 2) + '\n')
  console.log(`\n✓ quellenstand.json gespeichert (${Object.keys(sortiert).length} Dateien)`)
}
