---
name: lernplattform-befuellen
description: >-
  Befüllt das Lernplattform-Template mit Inhalten und hält sie aktuell: liest die Quellen —
  die Ordner unter Quellen/ und die externen Pfade aus quellen.config.json (Skript,
  Vorlesungen, Sprechstunden, Übungen, Alt- und Musterklausuren, Gedächtnisprotokolle,
  Abgaben, Zusammenfassungen) —, generiert daraus die Plattform-Markdown im contentDir
  (Inhalte/*.md) mit den tragenden Abbildungen aus Skript und Vorlesungen und baut zu
  dist/index.html. Gewichtet nach Prüfungsprofil: mit Alt- oder
  Musterklausuren zählen sie am meisten, ohne (z. B. mündliche Prüfung) die Hinweise des
  Dozenten und die besprochenen Aufgaben. Fachantworten aus dem Skript, Allgemeinwissen nur
  bei Lücken/Fehlern (als "(Ergänzung)"). Update-Modus: arbeitet nur neue oder geänderte
  Quellen ein. Use when the user wants to auto-fill / populate / generate / update the
  learning platform from its sources. Trigger: "Template befüllen", "Lernplattform
  generieren", "aus Quellen bauen", "Lernplattform aktualisieren", "neue Sprechstunde
  einarbeiten", "fill the platform".
---

# Lernplattform aus Quellen befüllen

Generiert die Inhalte des Lernplattform-Templates **aus Rohmaterialien** und zieht sie nach,
wenn neues Material dazukommt. Datenfluss: **Quellen (Eingabe) → Skill → `contentDir`
(Ausgabe, z. B. `Inhalte/`) → `npm run build` → `dist/index.html`**.

Quellen sind die Unterordner von `Quellen/` **und** die Einträge unter `extern` in
`quellen.config.json` — beide mit denselben Rollen (Ordnernamen). Die Konventionen der
Zieldateien stehen in **`TEMPLATE.md`** (Dateiname-Präfix = Reihenfolge, erste `#` = Titel,
Index-Tabelle = Kacheltext, Karteikarten `**N. …**` im Abschnitt `## Klausurfragen …` oder
`## Prüfungsfragen …`, Callouts, Mermaid). **Diese strikt einhalten** — sonst rendert die
Plattform Inhalte/Karten nicht.

## Zwei nicht verhandelbare Regeln

1. **Gewichtung nach Prüfungsprofil** (Abschnitt unten). Mit Alt- oder Musterklausuren
   bestimmen sie Themen-Priorität und Fragenkatalog am stärksten. Ohne sie bestimmen das die
   **Prüfungshinweise des Dozenten** und die **in der Lehrveranstaltung besprochenen
   Aufgaben**. Prüfungshäufige oder vom Dozenten genannte Themen mit `⭐` markieren und
   ausführlicher behandeln.
2. **Quellentreue — das Skript ist die Wahrheit.** Fachaussagen **wo möglich aus
   `Skript`** belegen (dann ergänzend `Vorlesungen`, `Übungen`). Allgemeingültiges
   Modellwissen **nur** bei *offensichtlichen Fehlern* oder *fehlenden Infos* ergänzen — und
   solche Stellen mit **`(Ergänzung)`** markieren. Nichts erfinden; bei echter Unsicherheit
   lieber Lücke markieren/nachfragen.

Dazu ein Grundsatz: **Wo eine Abbildung aus Skript oder Vorlesung den Stoff trägt, zeigt die
Plattform sie** — Auswahl, Herkunft und Ablage im Abschnitt *Abbildungen aus Skript und
Vorlesungen*.

## Prüfungsprofil

`quellen.config.json` → `pruefung`:

- **`form`** — `"schriftlich"` oder `"mündlich"`. Bestimmt die Form der Antworten (unten).
- **`hinweise`** — Liste dessen, was über die Prüfung bekannt ist, je Eintrag mit Fundstelle
  (z. B. „Definitionen werden nicht abgefragt — Sprechstunde 21.09., 00:26:22"). Gehört auf
  die Prüfungsseite und steuert die Gewichtung wie ein Dozentenhinweis.

Das **Profil** folgt aus den Quellen, nicht aus der Config:

| Profil | Wann | Rangfolge der Gewichtung |
| --- | --- | --- |
| **A — mit Altklausuren** | Rolle `Altklausuren` oder `Musterklausuren` hat Dateien | 1. Alt-/Musterklausuren · 2. Gedächtnisprotokolle · 3. Prüfungshinweise aus `Sprechstunden` · 4. `Übungen` |
| **B — ohne Altklausuren** | beide Rollen leer | 1. ausdrückliche Prüfungshinweise des Dozenten (`Sprechstunden`, `pruefung.hinweise`) · 2. in der Lehrveranstaltung **besprochene** Aufgaben · 3. übrige `Übungen` und Skript-Aufgaben · 4. Gedächtnisprotokolle und Probeprüfungen, sobald vorhanden |

In beiden Profilen gilt:

- **Mitschriften früherer Semester** (Stoffsammlungen, Prüfungsvorbereitungen, meist unter
  `Gedächtnisprotokolle`) mit **ausdrücklichen Dozentenhinweisen** („rot = prüfungsrelevant",
  „nicht in Prüfung") zählen wie Hinweise des Dozenten — mit Semester als Fundstelle
  („Stoffsammlung WS 21/22"). Widerspricht das aktuelle Semester, gilt das aktuelle; die
  Abweichung vermerken. Ihre **Antworten** sind Mitschriften von Studierenden: nur übernehmen, was
  das Skript oder der Dozent stützt. Namen der Verfasser nicht übernehmen.
- **Negativhinweise gehen vor.** Sagt der Dozent, etwas wird nicht gefragt („Definitionen
  frage ich nicht", „rechnen lasse ich Sie das nicht"), bekommt es **kein ⭐** und keine
  Karteikarte in dieser Form; im Kapitel steht der Hinweis mit Fundstelle. Der Stoff selbst
  bleibt drin, wenn er zum Verständnis nötig ist.
- **Stand der Lehrveranstaltung sichtbar machen.** Jede Kapitelseite sagt am Anfang, ob und
  wann das Kapitel besprochen wurde („besprochen in der Sprechstunde am 12.10.2026") oder
  dass es **noch nicht besprochen** ist. Ein noch nicht besprochenes Kapitel bekommt ⭐ nur
  über ausdrückliche Hinweise, nicht über Vermutungen.
- `Abgaben` liefern Bewertungskriterien und typische Fehler.

**Form der Antworten:**

- **Schriftlich** — Musterlösung wie in der Klausur: vollständig, mit Rechenweg.
- **Mündlich** — jede Karte beginnt mit einer **sprechbaren Kurzantwort** (2–4 Sätze, so wie
  man sie in der Prüfung sagt), danach Stichpunkte zum Vertiefen und, wo naheliegend, die
  **typische Nachfrage** („Und warum ist das bei Software schwierig?"). Fragen als Prüfer
  formulieren: „Erklären Sie …", „Wie gehen Sie vor, wenn …", „Was passiert, wenn …".
  Reine Definitionsabfragen vermeiden, wenn der Dozent sie ausgeschlossen hat. Bei
  Rechenverfahren das Prinzip abfragen, die Rechnung als Worked Example im Kapitel lassen.

## Vorbedingungen prüfen

- Aktuelles Verzeichnis ist ein Template-Ordner: es existieren `content.config.json`,
  `scripts/build-content.mjs`, `scripts/quellen-status.mjs` und `Quellen/`. Sonst abbrechen
  und darauf hinweisen.
- `content.config.json` lesen → **`contentDir`** (Ausgabeordner), Modul-`id`/`title`/
  `brandMark`, `examFile`, `cheatsheetFile(s)`. **Immer in dieses `contentDir` schreiben**,
  nicht hart nach `Inhalte/`.
- `quellen.config.json` lesen (fehlt sie: nur `Quellen/`, Form `schriftlich`).
- `node_modules` fehlt → `npm install`.
- **`npm run quellen`** — listet alle Quellen je Rolle, löst die Wurzeln für diese Maschine
  auf und vergleicht mit `quellenstand.json`. Meldet es eine Wurzel als „nicht gesetzt" oder
  einen Pfad als nicht erreichbar: **nachfragen, nicht suchen** — der Pfad gehört in
  `wurzeln`. Sind gar keine Quellen da → dem User sagen, welche Materialien wohin gehören
  (siehe `Quellen/README.md`), dann stoppen.

## Modus wählen

- **Erstbefüllung** — es gibt kein `quellenstand.json`, oder der `contentDir` enthält nur die
  Beispielseiten des Templates. → Ablauf A.
- **Update** — `quellenstand.json` existiert und der `contentDir` hat echte Inhalte. →
  Ablauf B. Meldet `npm run quellen` nichts Neues oder Geändertes, ist nichts zu tun — das
  sagen und stoppen.

## Ablauf A — Erstbefüllung (staged, jede Stufe verifizieren)

### A1. Text gewinnen
Für jede Datei Text gewinnen, Zwischenergebnisse im Scratchpad:
- **PDF:** `pdftotext -layout <datei> -` (schnell). Fallback: Read-Tool mit `pages`.
- **PPT/PPTX:** nach PDF wandeln — `libreoffice --headless --convert-to pdf --outdir <tmp>
  <datei>` → dann `pdftotext`. Fallback ohne LibreOffice: `unzip -p <datei>
  'ppt/slides/slide*.xml'` und XML-Tags entfernen.
- **Markdown/Text:** direkt lesen. Obsidian-Notizen nach dem Abschnitt *Obsidian-Quellen*
  unten umsetzen.
- Liegt das Skript als Markdown **und** PDF vor, ist das Markdown führend; das PDF dient zum
  Gegenprüfen von Zahlen, Formeln und Abbildungsnummern.
- **Abbildungen erfassen:** beim Lesen notieren, welche Abbildungen es gibt — das
  Abbildungsverzeichnis des Skript-PDFs, `![[…]]` in den Notizen, Folien, in Aufzeichnungen
  gezeigte Bilder —, jeweils mit Fundstelle. Auswahl und Ablage: Abschnitt *Abbildungen*.
- **Verify:** Jede Quelle hat nicht-leeren Text. Scan-/Bild-PDFs (kein Text) melden — OCR
  nötig oder überspringen.

### A2. Kapitelstruktur & Wissensbasis (primär aus Skript)
Kapitelliste **primär aus dem Skript** ableiten (kapitelweise Markdown mappt fast direkt;
sonst aus der Gliederung des Skript-PDFs), ersatzweise aus `Vorlesungen`. Pro Kapitel die
belegten Kernaussagen sammeln, mit Abschnittsnummer des Skripts als Fundstelle. Anhänge und
Beispiele des Skripts in die Kapitel ziehen, zu denen sie gehören, statt eigene Seiten.
- **Verify:** Kapitelliste deckt das Skript ab; sinnvolle Reihenfolge.

### A3. Prüfungsanalyse (nach Profil)
- **Fragen sammeln** aus allen Quellen mit Prüfungsbezug (Profil A: Alt-/Musterklausuren,
  Gedächtnisprotokolle; Profil B: `Übungen`, Skript-Aufgaben, in `Sprechstunden` besprochene
  Aufgaben). Jeder Frage ein Kapitel und die Herkunft zuordnen (Klausur WS23 A3,
  Aufgabe 3.3.6, besprochen am 12.10.).
- **Hinweise sammeln** aus `Sprechstunden` und `pruefung.hinweise`: was gefragt wird, wie
  tief, was nicht. Mit Datum und Zeitmarke festhalten.
- **Priorisieren** nach der Rangfolge des Profils → Themen-Ranking; Top-Themen `⭐`.
- **Musterantworten** formulieren — aus dem Skript belegt, in der Form der Prüfung (oben).
  Weicht die Lösung des Dozenten in der Sprechstunde von der Musterlösung in `Übungen` ab:
  **den Weg des Dozenten zeigen** und die Abweichung vermerken.
- `Abgaben` auswerten: **Bewertungskriterien & typische Fehler** → in Musterlösungen und
  „häufige Fehler"-Hinweise.
- **Verify:** Jede Prüfungsfrage hat Kapitelzuordnung, Herkunft und Musterantwort.

### A4. Zieldateien generieren (in `contentDir`)
Beispielseiten des Templates ersetzen (Beispielinhalt darf weg; echte frühere Generierungen
nicht blind zerstören — dann Ablauf B).
- **`00-Index.md`** — Einleitung (Modul, Prüfungsform), Kapitel-Tabelle
  `| NN | [Titel](NN-*.md) | Themen |` (Themen-Spalte = Kacheltext; ⭐ und Stand der
  Lehrveranstaltung dürfen hinein), „Hilfsmittel"-Links auf Prüfungsseite/Spickzettel und
  ein Abschnitt **`## Stand der Quellen`**: was eingearbeitet ist (z. B. „Sprechstunden
  21.09.–12.10.2026, Musterlösungen Kapitel 1–6, Skript vollständig"), Datum.
- **`NN-<Kapitel>.md`** je Kapitel — Kopf mit Stand der Lehrveranstaltung und, falls
  vorhanden, den Hinweisen des Dozenten als Callout `> **Prüfungsrelevanz:** …` (bzw.
  `> **Klausurrelevanz:** …` bei schriftlicher Prüfung). Dann die geerdete Zusammenfassung
  (⭐-Themen tiefer) mit den tragenden Abbildungen an ihrer Stelle, am Ende `## Prüfungsfragen — Musterantworten` (mündlich) bzw.
  `## Klausurfragen — Musterantworten` (schriftlich) mit Karten `**1. …**`, `**2. …**`
  (kapitel-intern fortlaufend). Wo hilfreich: Tabellen, `mermaid`-Diagramme, Worked
  Examples.
- **`examFile`** (z. B. `Altklausur.md` oder `Pruefungsfragen.md`) — Prüfungsform und
  `pruefung.hinweise`, Abschnitt „Was nicht gefragt wird", **voller Fragenkatalog** mit
  Mapping-Tabelle (Frage → Kapitel → Herkunft → ⭐) und eigener Karteikarten-Abschnitt.
- **`cheatsheetFile`** — 1-Seiten-Verdichtung: Formeln, Listen, Kernbegriffe,
  ⭐-Schwerpunkte, die wichtigsten Hinweise des Dozenten.
- Quellentreue-Regel + `(Ergänzung)`-Marker durchgängig anwenden.
- **Verify:** `node scripts/build-content.mjs` läuft fehlerfrei, zeigt die erwartete
  Seitenzahl und meldet kein `! Bild nicht gefunden`; Stichprobe: Karteikarten werden erkannt
  (siehe `extractFlashcards`).

### A5. `content.config.json` anpassen
`platformTitle`, Modul-`title`/`subtitle`/`brandMark`/`id`, `examFile` aus Modulname und
Quellen setzen. Ist der Modulname unklar → **einmal nachfragen**. `brandMark` = 2–4 Zeichen.

### A6. Bauen & Export
- `npm run build`.
- **Verify:** `dist/index.html` entsteht, ist self-contained (keine externen `http(s)`-Refs
  außer Links im Inhalt), Seitenzahl passt. Auf Wunsch Root-Kopie:
  `cp dist/index.html ../<Modul>-Lernplattform.html`.

### A7. Quellenstand festhalten
Erst wenn A6 fehlerfrei war: **`npm run quellen -- --speichern`**. Ab jetzt meldet
`npm run quellen` nur noch, was seitdem neu ist.

## Ablauf B — Update (neue oder geänderte Quellen)

1. **`npm run quellen`** — die Listen *Neu*, *Geändert*, *Entfernt* sind der Auftrag. Nur
   diese Dateien lesen, dazu die betroffenen Seiten im `contentDir`.
2. **Betroffene Seiten bestimmen:**
   - neue **Sprechstunde** → die dort besprochenen Kapitel (Stand der Lehrveranstaltung,
     neue Hinweise, ⭐), die Prüfungsseite, ggf. der Spickzettel;
   - geänderte **Übung/Musterlösung** → Karten des Kapitels und der Prüfungsseite;
   - geändertes **Skript** → Zusammenfassung des Kapitels;
   - neue **Folien** oder neues **Skriptkapitel** → auch die Abbildungen (Abschnitt
     *Abbildungen*); in Vorlesung oder Sprechstunde gezeigte Bilder bekommen Bildfragen;
   - neues **Gedächtnisprotokoll / Probeprüfung / Altklausur** → Prüfungsseite und Ranking
     aller Kapitel (kann das Profil von B nach A wechseln — dann die Gewichtung neu
     bewerten und das dem User sagen).
3. **Gezielt ändern, nicht neu schreiben.** Bestehende Formulierungen bleiben, wo die Quelle
   sie nicht berührt. „Noch nicht besprochen" → „besprochen am …". Neue Karten anhängen und
   die Nummerierung des Abschnitts lückenlos halten. Widerspricht neues Material dem
   bisherigen Inhalt, gilt die Rangfolge (Dozent vor Musterlösung, Skript vor
   Allgemeinwissen) — die Abweichung vermerken.
4. **Entfernte Quellen** nicht stillschweigend aus dem Inhalt tilgen: melden und fragen.
5. `## Stand der Quellen` in `00-Index.md` nachführen.
6. Bauen und prüfen wie A6, dann **`npm run quellen -- --speichern`**.
7. **Bericht an den User:** je Seite, was sich geändert hat (neue ⭐, neue Karten, neue
   Hinweise, Abweichungen).

## Abbildungen aus Skript und Vorlesungen

Die Plattform arbeitet **mit den Bildern des Kurses**: Wo das Skript oder die Folien eine
Abbildung haben, die einen Stoff trägt, steht sie neben dem Text — das Modell, das Diagramm, die
Kurve, die man in der Prüfung wiedererkennen und erklären soll. Der Text erklärt trotzdem, was
das Bild zeigt; Suche und Karteikarten lesen nur Text.

**Aufnehmen:**

- Abbildungen, die der Dozent in Vorlesung, Sprechstunde oder Prüfungsvorbereitung gezeigt oder
  abgefragt hat — sie zählen wie ein Hinweis des Dozenten und bekommen eine Bildfrage (unten),
- Abbildungen zu ⭐-Themen und zu besprochenen Aufgaben,
- Modelle und Abläufe, die als Bild schneller zu erfassen sind als als Text: Vorgehensmodelle,
  Organigramme, Netzpläne, Kurven, Pyramiden, Matrizen.

**Nicht als Bild:** reine Textfolien und Tabellen (abtippen, ein Bild höchstens zusätzlich),
Formeln (als Unicode und Inline-Code), Deko, Logos, Fotos ohne Inhalt. Gibt es keine Vorlage,
darf ein `mermaid`-Diagramm den Ablauf nachbauen.

**Woher:**

- **Obsidian-Notizen:** eingebettete Bilder `![[datei.png]]` — die Datei im Vault suchen (meist
  im `images/`-Ordner des Moduls); die Bildunterschrift steht oft in der Zeile darunter
  (`*Abbildung 3.3.4.1: …*`).
- **PDF (Skript, Folien):** eingebettete Grafiken mit `pdfimages -list <pdf>` finden und mit
  `pdfimages -png -f <S> -l <S> <pdf> <präfix>` holen; Vektorgrafiken oder ganze Folien mit
  `pdftoppm -png -r 150 -f <S> -l <S> <pdf> <präfix>` rendern und zuschneiden.
- **PPTX:** Die Bilder liegen in `ppt/media/` (`unzip -j <datei> 'ppt/media/*' -d <ordner>`).
- **Aufzeichnungen:** Standbild mit `ffmpeg -ss <hh:mm:ss> -i <video> -frames:v 1 <bild>.png`,
  dann zuschneiden; die Zeitmarke ist die Fundstelle.

**Ablage:** `<contentDir>/bilder/<quelle>-<nummer>-<thema>.<webp|png>`, klein, ohne Leerzeichen
und Umlaute — etwa `skript-3-3-4-1-vorgangsknoten.webp` oder `folie-12-use-case.webp`.
Verkleinern auf höchstens etwa 1000 px Breite, am besten als WebP:
`ffmpeg -i <ein>.png -vf "scale='min(1000,iw)':-2" -c:v libwebp -quality 80 <aus>.webp`
(ohne ffmpeg: `cwebp`, sonst PNG behalten). Richtwert unter 100 KB je Bild — jedes Bild steckt
als `data:`-URI im HTML.

**Einbetten:** in einer eigenen Zeile direkt beim Abschnitt, die Bildunterschrift nennt, was zu
sehen ist, und die Fundstelle (Skriptabschnitt und Abbildungsnummer oder Vorlesung und Folie):
`![Vorgangsknoten mit FAZ, FEZ, SAZ, SEZ (Skript 3.3.4, Abbildung 3.3.4.1)](bilder/skript-3-3-4-1-vorgangsknoten.webp)`

**Bildfragen:** Prüft der Dozent an Abbildungen (mündlich typisch: „Was sehen Sie da?"),
gehören die Bilder auch auf Karteikarten — Bild in der fett gesetzten Fragezeile, Alternativtext
ohne Lösung, Rückseite mit dem Namen der Abbildung, einer Kurzantwort, seinen Nachfragen und der
Fundstelle (Format in `TEMPLATE.md`). Sind es mehr als eine Handvoll, eine eigene Seite
`Abbildungen.md` anlegen und in `cheatsheetFiles` eintragen.

- **Verify:** `npm run build` meldet kein `! Bild nicht gefunden`; Stichprobe im Browser, auch
  im Dark Mode. Ein Repo mit Kursbildern bleibt **privat**.

## Obsidian-Quellen umsetzen

Der Renderer kennt CommonMark mit Tabellen, `mermaid`, Callouts per Blockquote und Bildern aus
`<contentDir>/bilder/` — keine Obsidian-Syntax, keine Formeln. Beim Übernehmen aus
Vault-Notizen:

- **Frontmatter** weglassen.
- **Wikilinks** `[[Ziel|Text]]` → Text; verweist er auf ein Kapitel der Plattform, als Link
  `[Text](NN-Datei.md)`. Skriptabschnitte als Fundstelle in Klammern: „(Skript 3.3.3)".
- **Obsidian-Callouts** `> [!info] Titel` → normaler Blockquote mit fettem Titel
  (`> **Titel.** …`). Prüfungshinweise als `> **Prüfungsrelevanz:** …`. Einklappbare
  Lösungen (`> [!NOTE]-`) auflösen.
- **Formeln** (`$…$`, `$$…$$`) → Unicode und Inline-Code, z. B. `MM = A · Size^E · ∏ EMᵢ`;
  längere Rechnungen als Tabelle (Schritt | Rechnung | Ergebnis).
- **Bilder** (`![[bild.png]]`) nach dem Abschnitt *Abbildungen* übernehmen: Datei im Vault
  suchen, verkleinert nach `<contentDir>/bilder/` legen, als `![Bildunterschrift](bilder/…)`
  einbetten. Was nur Text oder Tabelle ist, abtippen. Platzhalter wie `[Abbildung: …]` ohne
  Datei als Text, Tabelle oder `mermaid`-Diagramm nachbauen, wenn es für das Verständnis
  nötig ist.
- **Zeitmarken** aus Transkripten (`[00:21:35]`) als Fundstelle behalten:
  „(Sprechstunde 12.10.2026, 00:21:35)".
- Interne Arbeitsvermerke der Notizen (Korrekturlese-Protokolle, Whisper-Prompts,
  To-dos, Übergaben) **nicht** übernehmen — nur den Stoff und die Aussagen des Dozenten.

## Leitplanken
- **Skripttreue vor Modellwissen.** Widersprechen Skript und Standardwissen → Skript
  gilt; Abweichung im Kapitel vermerken.
- **Nachvollziehbarkeit.** Ergänztes Wissen `(Ergänzung)`; erfundene Fakten sind ein Fehler.
  Hinweise des Dozenten immer mit Datum (und Zeitmarke, falls vorhanden).
- **Bilder tragen mit, ersetzen keinen Text.** Tragende Abbildungen aus Skript und Vorlesungen
  kommen auf die Plattform (Abschnitt *Abbildungen*); was sie zeigen, steht trotzdem im Text.
- **Gewichtung sichtbar machen.** ⭐ konsequent nach der Rangfolge des Profils; der
  Fragenkatalog spiegelt reale Prüfungsfragen bzw. die besprochenen Aufgaben.
- **Lebendes Dokument.** Bei neuem Material Ablauf B statt Neugenerierung; `quellenstand.json`
  nur nach erfolgreichem Build speichern.
- **Nur Lernstoff.** Persönliches und Vertrauliches aus den Quellen (eigene Abgaben,
  Namen von Kommilitonen, Organisatorisches ohne Prüfungsbezug) gehört nicht auf die
  Plattform.
