# Lernplattform-Template

Wiederverwendbares Template einer **offline-fähigen Klausur-Lernplattform** (Vite +
React). Aus Markdown-Inhalten wird eine Lernwebsite gebaut, die zu **einer einzigen, in
sich geschlossenen `dist/index.html`** kompiliert — per Doppelklick (`file://`) auf jedem
Gerät ohne Server oder Internet nutzbar (Laptop, Handy, USB-Stick).

Für ein neues Modul/Fach: **dieses Repo kopieren**, Rohmaterial in `Quellen/` ablegen,
Inhalte generieren (Skill) oder von Hand pflegen, bauen.

## Schnellstart

```bash
npm install        # einmalig
npm run build      # -> dist/index.html  (der fertige Export)
npm run dev        # Entwicklung mit Live-Reload
```

`dist/index.html` ist der Export: vollständig inline (JS, CSS, Inhalte, Diagramme),
offline im Browser öffenbar.

## Inhalte befüllen — zwei Wege

**A) Automatisch (empfohlen).** Rohmaterial in die `Quellen/`-Unterordner legen oder in
[`quellen.config.json`](quellen.config.json) auf externe Ordner (Vault, Cloud) verweisen,
dort auch die Prüfungsform eintragen. Dann in Claude Code den Skill
**`/lernplattform-befuellen`** starten. Er liest die Quellen und generiert die
Plattform-Seiten in den Ausgabe-Ordner (`contentDir`, Standard `Inhalte/`). Kommt später
Material dazu, den Skill erneut starten: Er arbeitet nur ein, was `npm run quellen` als neu
oder geändert meldet. Claude Code dafür **in diesem Ordner** starten (der Skill liegt in
`.claude/`).

**B) Manuell.** Die Markdown-Dateien im `contentDir` (`Inhalte/`) direkt schreiben —
Konventionen siehe [`TEMPLATE.md`](TEMPLATE.md).

Zwei Leitregeln des Skills: **(a)** Gewichtung nach Prüfungsprofil — Alt-/Musterklausuren
haben das höchste Gewicht, ohne sie die Hinweise des Dozenten und die besprochenen Aufgaben
(prüfungsrelevante Themen `⭐`); **(b)** Fachaussagen werden aus dem `Skript` belegt,
Allgemeinwissen nur bei Fehlern/Lücken (als `(Ergänzung)`).

## Quellordner (`Quellen/` — Eingabe)

| Ordner | Rolle | Gewicht |
| --- | --- | --- |
| `Skript/` | Modulskript (Markdown kapitelweise und/oder PDF) — primäre Wissensbasis | Basis |
| `Vorlesungen/` | Folien (PDF/PPT) — ergänzend | ergänzend |
| `Altklausuren/` + `Musterklausuren/` | vergangene / Muster-Klausuren | **⭐ höchste** |
| `Sprechstunden/` | Aufzeichnungen mit Prüfungshinweisen des Dozenten | hoch, ohne Altklausuren **⭐ höchste** |
| `Übungen/` | Übungsaufgaben mit Musterlösungen | hoch |
| `Gedächtnisprotokolle/` | erinnerte Prüfungsfragen | hoch |
| `Abgaben/` | bewertete Zwischenabgaben (Bewertungskriterien/Fehler) | hoch |
| `Zusammenfassungen/` | eigene vorhandene Notizen | optional |

Details: [`Quellen/README.md`](Quellen/README.md).

## Wichtige Dateien

- [`TEMPLATE.md`](TEMPLATE.md) — ausführliche Anleitung + alle Markdown-Konventionen.
- [`CLAUDE.md`](CLAUDE.md) — Leitplanken für Claude Code in diesem Repo.
- [`content.config.json`](content.config.json) — Titel, Modul-`id`, `brandMark`, Dateizuordnung.
- [`quellen.config.json`](quellen.config.json) — Prüfungsform, externe Quellen für den Skill.
- `.claude/skills/lernplattform-befuellen/` — der Befüll-Skill (reist mit dem Repo).

## Neues Fach anlegen

1. Repo kopieren (`git clone` oder `cp -r`).
2. `Quellen/` mit dem Material des Fachs füllen oder externe Ordner in
   `quellen.config.json` eintragen, dort auch `pruefung.form`.
3. `content.config.json` anpassen (`title`, `subtitle`, `id`, `brandMark`).
4. Skill `/lernplattform-befuellen` starten (oder `Inhalte/` von Hand pflegen).
5. `npm run build` → `dist/index.html`.
# Lernplattform
