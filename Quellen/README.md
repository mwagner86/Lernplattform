# Quellen (Lernmaterial → Eingabe für den Skill)

Hier hinein kommen die **Rohmaterialien** deines Moduls. Der Skill
`lernplattform-befuellen` **liest diese Ordner** und generiert daraus die
Plattform-Seiten im Ausgabe-Ordner (`contentDir` aus `content.config.json`,
standardmäßig `../Inhalte`). Danach wird gebaut → `dist/index.html`.

## Ordner & Rolle (mit Gewichtung)

| Ordner | Rolle | Gewicht |
| --- | --- | --- |
| `Skript/` | **Primäre Wissensbasis / Wahrheitsquelle** — Modulskript (Markdown kapitelweise und/oder PDF). Fachantworten werden **hieraus** belegt. | Basis (Fakten) |
| `Vorlesungen/` | Folien (PDF/PPT) — **ergänzende** Fachquelle + strukturgebend. | ergänzend |
| `Altklausuren/` | Echte vergangene Klausuren → Themenpriorisierung + Prüfungsfragen/Musterlösungen. | **⭐ höchste** |
| `Musterklausuren/` | Muster-/Probeklausuren → wie Altklausuren. | **⭐ höchste** |
| `Gedächtnisprotokolle/` | Erinnerte Fragen aus mündl./schriftl. Prüfungen. | hoch |
| `Abgaben/` | Vom Dozenten **bewertete Zwischenabgaben** (Feedback/Punkte) → Bewertungskriterien & typische Fehler. | hoch |
| `Zusammenfassungen/` | **Deine bereits vorhandenen** Notizen/Summaries (optional, als Zusatzquelle/Startpunkt). | ergänzend |

## Zwei Kernregeln des Skills

1. **Gewichtung:** Was in **Alt- und Musterklausuren** vorkommt, bestimmt die
   Themen-Priorität (⭐) und den Fragenkatalog am stärksten. `Abgaben` zeigen zusätzlich,
   worauf der Dozent bei der Bewertung achtet.
2. **Quellentreue:** Fachaussagen **wo möglich aus dem `Skript`** belegen (dann
   `Vorlesungen`). Allgemeingültiges Wissen nur bei **offensichtlichen Fehlern oder
   Lücken** ergänzen — solche Stellen mit `(Ergänzung)` markieren.

Akzeptierte Formate: **PDF** (nativ lesbar), **PPT/PPTX** (werden zu Text/PDF
konvertiert), Markdown/Text. Bilder-only-PDFs brauchen ggf. OCR.
