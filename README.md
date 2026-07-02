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

**A) Automatisch (empfohlen).** Rohmaterial in die `Quellen/`-Unterordner legen, dann in
Claude Code den Skill **`/lernplattform-befuellen`** starten. Er liest die Quellen und
generiert die Plattform-Seiten in den Ausgabe-Ordner (`contentDir`, Standard `Inhalte/`).
Claude Code dafür **in diesem Ordner** starten (der Skill liegt in `.claude/`).

**B) Manuell.** Die Markdown-Dateien im `contentDir` (`Inhalte/`) direkt schreiben —
Konventionen siehe [`TEMPLATE.md`](TEMPLATE.md).

Zwei Leitregeln des Skills: **(a)** Alt-/Musterklausuren haben das höchste Gewicht
(prüfungshäufige Themen `⭐`); **(b)** Fachaussagen werden aus dem `Skript` belegt,
Allgemeinwissen nur bei Fehlern/Lücken (als `(Ergänzung)`).

## Quellordner (`Quellen/` — Eingabe)

| Ordner | Rolle | Gewicht |
| --- | --- | --- |
| `Skript/` | Modulskript (Markdown kapitelweise und/oder PDF) — primäre Wissensbasis | Basis |
| `Vorlesungen/` | Folien (PDF/PPT) — ergänzend | ergänzend |
| `Altklausuren/` + `Musterklausuren/` | vergangene / Muster-Klausuren | **⭐ höchste** |
| `Gedächtnisprotokolle/` | erinnerte Prüfungsfragen | hoch |
| `Abgaben/` | bewertete Zwischenabgaben (Bewertungskriterien/Fehler) | hoch |
| `Zusammenfassungen/` | eigene vorhandene Notizen | optional |

Details: [`Quellen/README.md`](Quellen/README.md).

## Wichtige Dateien

- [`TEMPLATE.md`](TEMPLATE.md) — ausführliche Anleitung + alle Markdown-Konventionen.
- [`CLAUDE.md`](CLAUDE.md) — Leitplanken für Claude Code in diesem Repo.
- [`content.config.json`](content.config.json) — Titel, Modul-`id`, `brandMark`, Dateizuordnung.
- `.claude/skills/lernplattform-befuellen/` — der Befüll-Skill (reist mit dem Repo).

## Neues Fach anlegen

1. Repo kopieren (`git clone` oder `cp -r`).
2. `Quellen/` mit dem Material des Fachs füllen.
3. `content.config.json` anpassen (`title`, `subtitle`, `id`, `brandMark`).
4. Skill `/lernplattform-befuellen` starten (oder `Inhalte/` von Hand pflegen).
5. `npm run build` → `dist/index.html`.
# Lernplattform
