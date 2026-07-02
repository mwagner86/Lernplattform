# Template: Offline-Lernplattform

Wiederverwendbares, **inhaltsfreies Gerüst** der Lernplattform. Gleiches Layout und
gleiche Features wie die SWT-Lernplattform (`../Lernplattform`), aber generisch: für
ein neues Modul/Fach **diesen ganzen Ordner kopieren**, umbenennen, `Inhalte/`
befüllen, Config anpassen, bauen. Das Ergebnis ist **eine einzige, offline nutzbare
`dist/index.html`** (kein Server, kein Internet — per `file://` im Browser öffenbar).

> **Für Claude:** Dies ist die maßgebliche Anleitung dieses Ordners. Änderungen am
> **Inhalt** immer in `Inhalte/*.md` (Single Source of Truth), danach neu bauen.
> Kein Inhalt in den React-Code duplizieren.

---

## Schnellstart (neues Modul aus dem Template)

1. **Ordner kopieren:** `cp -r Template ../MeinFach/Lernplattform` (Zielort frei).
2. **Inhalte ersetzen:** die Beispieldateien in `Inhalte/` durch echte Kapitel
   ersetzen (Konventionen s. u.). Datei-Set: `00-Index.md`, `NN-*.md` (Kapitel),
   optional `Altklausur.md` (Prüfungsseite), `Spickzettel.md` (Spickzettel).
3. **`content.config.json` anpassen:** Titel, `id`, `brandMark`, Dateinamen (s. u.).
4. **Bauen:** `npm install` (einmalig) → `npm run build`.
5. **Exportieren:** `dist/index.html` ist die fertige, in sich geschlossene Datei.
   Optional als benannte Kopie ablegen: `cp dist/index.html ../MeineLernplattform.html`.

Entwicklung mit Live-Reload: `npm run dev`.

---

## Inhalte automatisch aus Rohmaterial erzeugen (Skill)

Statt die `Inhalte/*.md` von Hand zu schreiben, kann der mitgelieferte Skill
**`lernplattform-befuellen`** (`.claude/skills/`) sie aus Rohmaterial generieren:

1. **Rohmaterial in `Quellen/` ablegen** (Details: `Quellen/README.md`):
   - `Skript/` — Modulskript (Markdown kapitelweise und/oder PDF) = **primäre Wissensbasis**
   - `Vorlesungen/` — Folien (PDF/PPT), ergänzend
   - `Altklausuren/` + `Musterklausuren/` — **⭐ höchstes Gewicht** (Priorisierung + Fragen)
   - `Gedächtnisprotokolle/` — erinnerte Prüfungsfragen
   - `Abgaben/` — vom Dozenten bewertete Zwischenabgaben (Bewertungskriterien/typische Fehler)
   - `Zusammenfassungen/` — eigene vorhandene Notizen (optional)
2. **Skill starten:** `/lernplattform-befuellen`. Er liest `Quellen/`, generiert die
   Seiten in den `contentDir` (Ausgabe), passt `content.config.json` an und baut.

Zwei Leitregeln des Skills: **(a) Alt-/Musterklausuren gewichten am stärksten**
(prüfungshäufige Themen `⭐`), **(b) Fachaussagen aus dem `Skript` belegen** —
Allgemeinwissen nur bei Fehlern/Lücken, dann als `(Ergänzung)` markiert.

> Damit der Skill in einem kopierten Template gefunden wird, Claude Code **im
> Template-Ordner** (bzw. dessen Kopie) starten — der Skill reist in `.claude/` mit.

---

## Ordnerstruktur

```
Template/
├── content.config.json      # steuert Module, Titel, Dateizuordnung (HIER konfigurieren)
├── Quellen/                  # ROHMATERIAL (Eingabe für den Befüll-Skill)
│   ├── Skript/               #   Modulskript (Markdown kapitelweise und/oder PDF) — primäre Wissensbasis
│   ├── Vorlesungen/          #   Folien (PDF/PPT) — ergänzend
│   ├── Altklausuren/         #   ⭐ höchstes Gewicht
│   ├── Musterklausuren/      #   ⭐ höchstes Gewicht
│   ├── Gedächtnisprotokolle/ #   erinnerte Prüfungsfragen
│   ├── Abgaben/              #   bewertete Zwischenabgaben (Bewertungskriterien/Fehler)
│   └── Zusammenfassungen/    #   deine vorhandenen Notizen (optional)
├── Inhalte/                  # GENERIERTE Plattform-Inhalte = contentDir (Ausgabe, Single Source of Truth fürs Rendern)
│   ├── 00-Index.md           #   Übersicht/Startseite  (Seitentyp: overview)
│   ├── 01-Erstes-Kapitel.md  #   Kapitel               (Seitentyp: chapter)
│   ├── 02-Zweites-Kapitel.md #   Kapitel
│   ├── Altklausur.md         #   Prüfungsfragen         (Seitentyp: exam)
│   └── Spickzettel.md        #   Spickzettel            (Seitentyp: cheatsheet)
├── .claude/skills/lernplattform-befuellen/  # Skill: Quellen/ → Inhalte/ (auto)
├── scripts/build-content.mjs # liest Inhalte/*.md → src/content.generated.json
├── index.html · vite.config.js · package.json
├── src/                      # React-App (das "Layout" — normalerweise NICHT ändern)
│   ├── main.jsx · App.jsx · index.css
│   ├── lib/     markdown.js (Rendering + Karteikarten-Parser), store.js (Theme/Fortschritt)
│   └── components/ Sidebar · TopBar · Home · ChapterPage · Flashcards · SearchModal · MarkdownContent
└── TEMPLATE.md               # diese Datei
```

`node_modules/`, `dist/` und `src/content.generated.json` werden erzeugt und sind in
`.gitignore`. `content.generated.json` **niemals von Hand editieren** — es wird bei
jedem Build aus `Inhalte/*.md` neu geschrieben.

---

## `content.config.json` — Feldreferenz

```json
{
  "platformTitle": "Klausur-Lernplattform",      // Kopfzeile (neben dem brandMark)
  "platformSubtitle": "…",                        // aktuell nur als Metatext genutzt
  "defaultModule": "beispiel",                     // id des standardmäßig geladenen Moduls
  "modules": [
    {
      "id": "beispiel",                            // URL-Slug (#/beispiel/…), localStorage-Key
      "title": "Beispielmodul",                    // großer Titel auf der Startseite
      "subtitle": "Hochschule · Semester · Dozent",// Eyebrow über dem Titel
      "brandMark": "BSP",                          // Kürzel im Sidebar-Logo (2–4 Zeichen)
      "contentDir": "./Inhalte",                   // Ordner mit den .md-Dateien (relativ zu Template/)
      "indexFile": "00-Index.md",                  // → Seitentyp overview
      "examFile": "Altklausur.md",                 // → Seitentyp exam (optional)
      "cheatsheetFile": "Spickzettel.md",          // einzelner Spickzettel (optional)
      "cheatsheetFiles": ["Spickzettel.md"]        // mehrere Spickzettel, Reihenfolge zählt (optional)
    }
  ]
}
```

- **`brandMark`** ist optional; fehlt es, nimmt der Build automatisch die ersten drei
  Zeichen der `id` in Großbuchstaben.
- **Mehrere Module** sind möglich: weiteren Eintrag im `modules`-Array ergänzen (eigener
  `contentDir`). Routing `#/<modul>/<kapitel>`, Fortschritt je Modul getrennt. Ein
  Modul-Umschalter im UI ist vorbereitet, aber ausgeblendet (Single-Modul-Fokus).

---

## Markdown-Konventionen (die der Build automatisch auswertet)

| Konvention | Regel | Beispiel |
| --- | --- | --- |
| **Reihenfolge & Nummer** | Zahl-Präfix im Dateinamen | `01-…`, `02-…` |
| **Seitentitel** | erste `#`-Überschrift der Datei | `# Erstes Kapitel` |
| **Kurztitel (Navi)** | Titel ohne Suffix `(Woche N)` / `(Kapitel N)` | `# UML (Woche 04)` → „UML" |
| **Kachel-Beschreibung** | Spalte „Themen" der Tabelle in `00-Index.md` | `\| 01 \| [Titel](01-x.md) \| Beschreibung \|` |
| **Fallback-Beschreibung** | erste Fließtextzeile, falls nicht in Tabelle | — |
| **In-Page-Navi & Suche** | alle `##`/`###`-Überschriften | — |
| **Karteikarten** | Abschnitt `## Klausurfragen …`; Karten `**N. …**` | s. u. |

### Karteikarten-Format (strikt)

Karten werden **nur** aus einem Abschnitt gezogen, dessen Überschrift mit
`## Klausurfragen` beginnt (z. B. `## Klausurfragen — Musterantworten`). Jede Karte:

```markdown
**1. Frage als Vorderseite?**

Antwort als Rückseite — alles bis zur nächsten `**2.`-Karte.

**2. Nächste Frage?**

Nächste Antwort.
```

Regeln, sonst entstehen **stillschweigend null Karten**:

- Beginn exakt mit `**<Zahl>.` — **fett, Zahl, Punkt, Leerzeichen**.
- **Nicht** als Heading (`### F1 …`) und **nicht** mit Klammer (`**1) …**`) schreiben.
- Kapitel-intern fortlaufend ab `**1.`.
- Der Abschnitt endet bei der nächsten `##`-Überschrift — Karteikarten-Abschnitt daher
  ans Kapitelende setzen (oder nur einfache Absätze folgen lassen).

### Seitentypen & Sortierung

Aus der Config abgeleitet: `overview` (= `indexFile`), `chapter` (nummerierte `NN-*.md`),
`exam` (= `examFile`), `cheatsheet` (aus `cheatsheetFiles`/`cheatsheetFile`). Sidebar-
und Startseiten-Reihenfolge: **Übersicht → Kapitel (nach Nummer) → Prüfungsseite →
Spickzettel** (Spickzettel in Config-Reihenfolge).

### Unterstützte Inhalte im Markdown

Tabellen, `mermaid`-Codeblöcke (als Diagramm mit **Zoom** gerendert), Code mit
Syntax-Highlighting, sowie **Callouts**: ein Blockquote (`>`), der mit
*Klausurrelevanz* beginnt, wird hervorgehoben dargestellt.

---

## Unterschiede zur SWT-Lernplattform (was generisch gemacht wurde)

Der React-Code ist identisch bis auf die entfernten SWT-Fixtexte — beim Pflegen des
Templates diese Stellen **generisch halten** (keine modul-spezifischen Strings
hartkodieren, stattdessen aus der Config ableiten):

- `content.config.json`: generische Platzhalter statt SWT/TH-Brandenburg; `contentDir`
  zeigt **lokal** auf `./Inhalte` (SWT-Original: `../Zusammenfassungen`); Feld
  `brandMark` ergänzt.
- `scripts/build-content.mjs`: reicht `brandMark` je Modul durch (Fallback = `id`-Kürzel).
- `src/components/Sidebar.jsx`: Logo-Kürzel aus `activeModule.brandMark` statt fest „SWT".
- `src/components/Home.jsx`: Prüfungs-Kachel nutzt `exam.shortTitle` + `exam.description`
  statt fester „18 Altfragen …"-Texte; Übersichts-Kachel „Navigation & Übersicht".
- `src/components/ChapterPage.jsx`: Eyebrow der Prüfungsseite „Prüfungsfragen" statt
  „Altklausur & Prüfungsfragen".

Alle übrigen UI-Texte (z. B. „Kapitel", „Spickzettel", „Als gelernt markieren") sind
fach-neutral und bleiben. Passt du sie an, tue es sprachlich konsistent (Deutsch).
