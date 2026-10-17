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

1. **Rohmaterial in `Quellen/` ablegen** (Details: `Quellen/README.md`) — oder, wenn es
   schon anderswo gepflegt wird (Vault, Cloud-Ordner), in `quellen.config.json` unter
   `extern` eintragen:
   - `Skript/` — Modulskript (Markdown kapitelweise und/oder PDF) = **primäre Wissensbasis**
   - `Vorlesungen/` — Folien (PDF/PPT), ergänzend
   - `Altklausuren/` + `Musterklausuren/` — **⭐ höchstes Gewicht** (Priorisierung + Fragen)
   - `Sprechstunden/` — Aufzeichnungen mit Prüfungshinweisen des Dozenten, ohne
     Altklausuren **⭐ höchstes Gewicht**
   - `Übungen/` — Übungsaufgaben mit Musterlösungen
   - `Gedächtnisprotokolle/` — erinnerte Prüfungsfragen
   - `Abgaben/` — vom Dozenten bewertete Zwischenabgaben (Bewertungskriterien/typische Fehler)
   - `Zusammenfassungen/` — eigene vorhandene Notizen (optional)
2. **Prüfungsform eintragen:** `quellen.config.json` → `pruefung.form` (`schriftlich` oder
   `mündlich`) und `pruefung.hinweise`.
3. **Skill starten:** `/lernplattform-befuellen`. Er liest die Quellen, generiert die
   Seiten in den `contentDir` (Ausgabe), passt `content.config.json` an, baut und hält den
   eingearbeiteten Stand in `quellenstand.json` fest.
4. **Neues Material** (eine weitere Sprechstunde, eine Probeprüfung): ablegen bzw. im
   externen Ordner speichern, den Skill erneut starten. Er arbeitet im **Update-Modus** nur
   ein, was `npm run quellen` als neu oder geändert meldet.

Zwei Leitregeln des Skills: **(a) Gewichtung nach Prüfungsprofil** — mit
Alt-/Musterklausuren zählen sie am stärksten, ohne die Hinweise des Dozenten und die
besprochenen Aufgaben (prüfungsrelevante Themen `⭐`); **(b) Fachaussagen aus dem
`Skript` belegen** — Allgemeinwissen nur bei Fehlern/Lücken, dann als `(Ergänzung)`
markiert.

> Damit der Skill in einem kopierten Template gefunden wird, Claude Code **im
> Template-Ordner** (bzw. dessen Kopie) starten — der Skill reist in `.claude/` mit.

---

## Ordnerstruktur

```
Template/
├── content.config.json      # steuert Module, Titel, Dateizuordnung (HIER konfigurieren)
├── quellen.config.json      # Prüfungsform + externe Quellen für den Befüll-Skill
├── quellenstand.json        # vom Skill erzeugt: welche Quellen eingearbeitet sind (versioniert)
├── Quellen/                  # ROHMATERIAL (Eingabe für den Befüll-Skill)
│   ├── Skript/               #   Modulskript (Markdown kapitelweise und/oder PDF) — primäre Wissensbasis
│   ├── Vorlesungen/          #   Folien (PDF/PPT) — ergänzend
│   ├── Altklausuren/         #   ⭐ höchstes Gewicht
│   ├── Musterklausuren/      #   ⭐ höchstes Gewicht
│   ├── Sprechstunden/        #   Aufzeichnungen, Dozentenhinweise — ⭐ ohne Altklausuren
│   ├── Übungen/              #   Übungsaufgaben mit Musterlösungen
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
├── scripts/quellen-status.mjs # `npm run quellen`: Quellen neu/geändert/entfernt ggü. quellenstand.json
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

## `quellen.config.json` — Feldreferenz

Nur für den Befüll-Skill und `npm run quellen`; der Build liest sie nicht.

```json
{
  "pruefung": {
    "form": "mündlich",                           // "schriftlich" oder "mündlich" → Form der Antworten
    "hinweise": [                                  // was über die Prüfung bekannt ist, mit Fundstelle
      "15 Minuten online — Kursseite",
      "Definitionen werden nicht abgefragt — Sprechstunde 21.09., 00:26:22"
    ]
  },
  "wurzeln": {                                     // Basisordner je Betriebssystem (os.platform())
    "vault": { "darwin": "~/My Drive/Notes", "linux": "~/vault" }
  },
  "extern": [                                      // Quellen außerhalb von Quellen/, Rolle = Ordnername dort
    { "rolle": "Skript", "pfad": "vault:Studium/Modul/Skript" },
    { "rolle": "Sprechstunden", "pfad": "vault:Studium/Modul/Sprechstunden" }
  ]
}
```

- **`pfad`** ist `<wurzel>:<Pfad relativ zur Wurzel>`, Ordner oder einzelne Datei. Ordner
  werden rekursiv gelesen (`.md`, `.txt`, `.srt`, `.pdf`, `.ppt`, `.pptx`, ohne versteckte Dateien).
- Fehlt eine Wurzel für das aktuelle Betriebssystem, meldet `npm run quellen` sie als nicht
  erreichbar; ihre Dateien gelten dann weder als neu noch als entfernt.
- **`quellenstand.json`** hält je Datei Rolle und SHA-256 fest, mit maschinenunabhängigen
  Schlüsseln (`vault:…`, `Quellen/…`). `npm run quellen -- --speichern` schreibt ihn — das
  macht der Skill nach jedem erfolgreichen Einarbeiten. Versionieren, damit der Stand auf
  allen Rechnern gilt.

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
| **Karteikarten** | Abschnitt `## Klausurfragen …` oder `## Prüfungsfragen …`; Karten `**N. …**` | s. u. |

### Karteikarten-Format (strikt)

Karten werden **nur** aus einem Abschnitt gezogen, dessen Überschrift mit
`## Klausurfragen` oder `## Prüfungsfragen` beginnt (z. B. `## Klausurfragen —
Musterantworten`, bei mündlicher Prüfung `## Prüfungsfragen — Musterantworten`). Jede Karte:

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
*Klausurrelevanz* oder *Prüfungsrelevanz* beginnt, wird hervorgehoben dargestellt.

**Nicht** unterstützt: Formeln (`$…$`), eingebettete Bilder und Obsidian-Syntax
(Wikilinks, `> [!info]`-Callouts). Der Befüll-Skill setzt sie beim Übernehmen um.

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
- Für Module mit mündlicher Prüfung: Karteikarten auch aus `## Prüfungsfragen …`
  (`src/lib/markdown.js`), hervorgehobene Callouts auch mit *Prüfungsrelevanz*
  (`MarkdownContent.jsx`), Startseite „für die Prüfung" statt „für die Klausur" (`Home.jsx`).

Alle übrigen UI-Texte (z. B. „Kapitel", „Spickzettel", „Als gelernt markieren") sind
fach-neutral und bleiben. Passt du sie an, tue es sprachlich konsistent (Deutsch).
