# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## Was dieses Repository ist (Lernplattform-Template)

Wiederverwendbares Template einer **offline-fähigen Lernplattform** (Vite + React →
**eine einzige `dist/index.html`**, per `file://` ohne Server nutzbar). Aus Markdown wird
eine Lernwebsite gebaut. Maßgebliche Details & Konventionen stehen in **`TEMPLATE.md`**
(dort nachschlagen, nicht hierher duplizieren).

### Datenfluss

`Quellen/` (Rohmaterial, **Eingabe**) → Skill `lernplattform-befuellen` → `contentDir`
aus `content.config.json` (generierte `*.md`, **Ausgabe**, Standard `Inhalte/`) →
`npm run build` → `dist/index.html`.

**Single Source of Truth:** Inhalt lebt in den Markdown-Dateien des `contentDir`, **nie**
im React-Code duplizieren. Nach Inhaltsänderung `npm run build`, dann ggf. Root-Kopie der
`dist/index.html`.

### Quellen-Hierarchie & Gewichtung (für den Befüll-Skill)

- **Fakten-Wahrheitsquelle:** `Quellen/Skript/` (**primär**) → `Quellen/Vorlesungen/`
  (ergänzend). Fachaussagen „wo möglich aus dem Skript"; allgemeingültiges Wissen nur bei
  **offensichtlichen Fehlern oder Lücken**, dann mit `(Ergänzung)` markiert.
- **Prüfungs-Gewicht (Priorisierung ⭐ + Fragenkatalog):** `Altklausuren/` +
  `Musterklausuren/` haben **höchstes Gewicht**; `Gedächtnisprotokolle/` liefern
  zusätzliche Fragen; `Abgaben/` (bewertete Zwischenabgaben) zeigen Bewertungskriterien &
  typische Fehler; `Zusammenfassungen/` = optionale eigene Notizen.

### Neues Modul/Fach

Template kopieren → `Quellen/` befüllen → `content.config.json` anpassen (Titel, `id`,
`brandMark`) → Skill `/lernplattform-befuellen` starten (oder Inhalte von Hand pflegen) →
bauen. Der Skill reist in `.claude/` mit — Claude Code dafür **im Template-Ordner** starten.
