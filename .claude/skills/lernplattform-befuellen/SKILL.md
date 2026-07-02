---
name: lernplattform-befuellen
description: >-
  Befüllt das Lernplattform-Template automatisch mit Inhalten: liest die Rohmaterialien
  in Quellen/ (Skript, Vorlesungen, Altklausuren, Musterklausuren, Gedächtnisprotokolle,
  Abgaben, vorhandene Zusammenfassungen) aus, generiert daraus die Plattform-Markdown im
  contentDir (Inhalte/*.md), baut zu dist/index.html. Alt- und Musterklausuren haben
  höchstes Gewicht; Fachantworten werden aus dem Skript belegt, Allgemeinwissen nur
  bei Lücken/Fehlern (als "(Ergänzung)"). Use when the user wants to auto-fill / populate
  / generate the learning platform from the source folders. Trigger: "Template befüllen",
  "Lernplattform generieren", "aus Quellen bauen", "fill the platform".
---

# Lernplattform aus Quellen befüllen

Generiert die Inhalte des Lernplattform-Templates **automatisch aus Rohmaterialien**.
Datenfluss: **`Quellen/` (Eingabe) → Skill → `contentDir` (Ausgabe, z. B. `Inhalte/`) → `npm run build` → `dist/index.html`**.

Die Konventionen der Zieldateien stehen in **`TEMPLATE.md`** (Dateiname-Präfix = Reihenfolge,
erste `#` = Titel, Index-Tabelle = Kacheltext, Karteikarten `**N. …**` im Abschnitt
`## Klausurfragen …`, Callouts, Mermaid). **Diese strikt einhalten** — sonst rendert die
Plattform Inhalte/Karten nicht.

## Zwei nicht verhandelbare Regeln

1. **Gewichtung — Alt- & Musterklausuren zuerst.** Was in `Altklausuren/` und
   `Musterklausuren/` vorkommt, bestimmt Themen-Priorität und Fragenkatalog **am
   stärksten**. Häufig/prominent geprüfte Themen mit `⭐` markieren und ausführlicher
   behandeln. `Gedächtnisprotokolle/` liefern zusätzliche Fragen; `Abgaben/` (bewertete
   Zwischenabgaben) zeigen Bewertungskriterien & typische Fehler.
2. **Quellentreue — das Skript ist die Wahrheit.** Fachaussagen **wo möglich aus
   `Skript/`** belegen (dann ergänzend `Vorlesungen/`). Allgemeingültiges Modellwissen
   **nur** bei *offensichtlichen Fehlern* oder *fehlenden Infos* ergänzen — und solche
   Stellen mit **`(Ergänzung)`** markieren. Nichts erfinden; bei echter Unsicherheit lieber
   Lücke markieren/nachfragen.

## Vorbedingungen prüfen

- Aktuelles Verzeichnis ist ein Template-Ordner: es existieren `content.config.json`,
  `scripts/build-content.mjs` und `Quellen/`. Sonst abbrechen und darauf hinweisen.
- `content.config.json` lesen → **`contentDir`** (Ausgabeordner), Modul-`id`/`title`/`brandMark`.
  **Immer in dieses `contentDir` schreiben**, nicht hart nach `Inhalte/`.
- `Quellen/` inventarisieren (`find Quellen -type f`). Ist alles leer → dem User sagen,
  welche Materialien wohin gehören (siehe `Quellen/README.md`), dann stoppen.

## Ablauf (staged — jede Stufe verifizieren)

### 1. Textextraktion aus den Quellen
Für jede Datei Text gewinnen, Ergebnisse im Scratchpad zwischenspeichern:
- **PDF:** `pdftotext -layout <datei> -` (schnell). Fallback: Read-Tool mit `pages`.
- **PPT/PPTX:** nach PDF wandeln — `libreoffice --headless --convert-to pdf --outdir <tmp> <datei>` → dann `pdftotext`. Fallback ohne LibreOffice: `unzip -p <datei> 'ppt/slides/slide*.xml'` und XML-Tags entfernen.
- **Markdown/Text:** direkt lesen.
- **Verify:** Jede Quelle hat nicht-leeren Text. Scan-/Bild-PDFs (kein Text) melden — OCR nötig oder überspringen.

### 2. Kapitelstruktur & Wissensbasis (primär aus Skript)
Kapitelliste **primär aus `Skript/`** ableiten (kapitelweise Markdown-Dateien mappen fast
direkt; sonst aus der Gliederung des Skript-PDFs), ersatzweise aus `Vorlesungen/`. Pro
Kapitel die belegten Kernaussagen sammeln (Skript zuerst, Vorlesungen ergänzend).
- **Verify:** Kapitelliste deckt das Skript-/Vorlesungsmaterial ab; sinnvolle Reihenfolge.

### 3. Prüfungsanalyse (⭐ höchstes Gewicht)
`Altklausuren/` + `Musterklausuren/` + `Gedächtnisprotokolle/` parsen:
- Alle **Fragen** extrahieren; jeder Frage ein Kapitel zuordnen.
- Nach Häufigkeit/Prominenz **priorisieren** → Themen-Ranking; Top-Themen `⭐`.
- **Musterantworten** formulieren — bevorzugt aus dem `Skript` belegt.
- `Abgaben/` (bewertete Zwischenabgaben) auswerten: **Bewertungskriterien & typische
  Fehler** ableiten → in Musterlösungen/Worked Examples und „häufige Fehler"-Hinweise
  einfließen lassen.
- **Verify:** Jede Prüfungsfrage hat Kapitelzuordnung + Musterantwort.

### 4. Zieldateien generieren (in `contentDir`)
Bestehende Beispiel-/Alt-Dateien im `contentDir` ersetzen (Beispielinhalt darf weg;
echte frühere Generierungen nicht blind zerstören — bei vorhandenem Inhalt aktualisieren).
- **`00-Index.md`** — Einleitung + Kapitel-Tabelle `| NN | [Titel](NN-*.md) | Themen |`
  (Themen-Spalte = Kacheltext) + „Hilfsmittel"-Links auf Prüfungsseite/Spickzettel.
- **`NN-<Kapitel>.md`** je Kapitel — geerdete Zusammenfassung (⭐-Themen tiefer), am Ende
  `## Klausurfragen — Musterantworten` mit Karten `**1. …**`, `**2. …**` (kapitel-intern
  fortlaufend). Wo hilfreich: Tabellen, `mermaid`-Diagramme, `> Klausurrelevanz:`-Callouts.
- **`Altklausur.md`** (= `examFile`) — voller **Fragenkatalog mit Musterlösungen** +
  Mapping-Tabelle (Frage → Kapitel) + eigener `## Klausurfragen …`-Abschnitt (Karteikarten).
- **`Spickzettel.md`** (= `cheatsheetFile`) — 1-Seiten-Verdichtung: Formeln, Listen,
  Kernbegriffe, ⭐-Schwerpunkte.
- Quellentreue-Regel + `(Ergänzung)`-Marker durchgängig anwenden.
- **Verify:** `node scripts/build-content.mjs` läuft fehlerfrei und zeigt die erwartete
  Seitenzahl/Typen; Stichprobe: Karteikarten werden erkannt (siehe `extractFlashcards`).

### 5. `content.config.json` anpassen
`platformTitle`, Modul-`title`/`subtitle`/`brandMark`/`id` aus Modulname/Vorlesungen setzen.
Ist der Modulname unklar → **einmal nachfragen**. `brandMark` = 2–4 Zeichen Kürzel.

### 6. Bauen & Export
- `node_modules` fehlt → `npm install`. Dann `npm run build`.
- **Verify:** `dist/index.html` entsteht, ist self-contained (keine externen `http(s)`-Refs),
  Seitenzahl passt. Auf Wunsch Root-Kopie: `cp dist/index.html ../<Modul>-Lernplattform.html`.

## Leitplanken
- **Skripttreue vor Modellwissen.** Widersprechen Skript und Standardwissen → Skript
  gilt; Abweichung im Kapitel vermerken.
- **Nachvollziehbarkeit.** Ergänztes Wissen `(Ergänzung)`; erfundene Fakten sind ein Fehler.
- **Gewichtung sichtbar machen.** ⭐ konsequent für prüfungshäufige Themen; Fragenkatalog
  spiegelt reale Alt-/Musterklausurfragen.
- **Lebendes Dokument.** Bei erneutem Lauf aktualisieren statt alles wegzuwerfen.
