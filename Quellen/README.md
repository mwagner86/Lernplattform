# Quellen (Lernmaterial → Eingabe für den Skill)

Hier hinein kommen die **Rohmaterialien** deines Moduls. Der Skill
`lernplattform-befuellen` **liest diese Ordner** und generiert daraus die
Plattform-Seiten im Ausgabe-Ordner (`contentDir` aus `content.config.json`,
standardmäßig `../Inhalte`). Danach wird gebaut → `dist/index.html`.

Material, das schon anderswo gepflegt wird (Obsidian-Vault, Cloud-Ordner), muss nicht
hierher kopiert werden: **`../quellen.config.json`** kann es unter `extern` mit derselben
Rolle einbinden. Dann veraltet keine Kopie, und neue Dateien dort meldet `npm run quellen`.

## Ordner & Rolle

| Ordner | Rolle | Gewicht |
| --- | --- | --- |
| `Skript/` | **Primäre Wissensbasis / Wahrheitsquelle** — Modulskript (Markdown kapitelweise und/oder PDF). Fachantworten werden **hieraus** belegt. | Basis (Fakten) |
| `Vorlesungen/` | Folien (PDF/PPT) — **ergänzende** Fachquelle + strukturgebend. | ergänzend |
| `Altklausuren/` | Echte vergangene Klausuren → Themenpriorisierung + Prüfungsfragen/Musterlösungen. | **⭐ höchste** (Profil A) |
| `Musterklausuren/` | Muster-/Probeklausuren → wie Altklausuren. | **⭐ höchste** (Profil A) |
| `Sprechstunden/` | Transkripte/Notizen aufgezeichneter Vorlesungen und Sprechstunden → Prüfungshinweise des Dozenten, besprochene Aufgaben. | hoch · **⭐ höchste** (Profil B) |
| `Übungen/` | Übungsaufgaben mit Musterlösungen → Karteikarten und Fragenkatalog. | hoch |
| `Gedächtnisprotokolle/` | Erinnerte Fragen aus mündl./schriftl. Prüfungen, auch Probeprüfungen. | hoch |
| `Abgaben/` | Vom Dozenten **bewertete Zwischenabgaben** (Feedback/Punkte) → Bewertungskriterien & typische Fehler. | hoch |
| `Zusammenfassungen/` | **Deine bereits vorhandenen** Notizen/Summaries (optional, als Zusatzquelle/Startpunkt). | ergänzend |

## Zwei Kernregeln des Skills

1. **Gewichtung nach Prüfungsprofil.**
   - **Profil A — mit Alt- oder Musterklausuren:** Was dort vorkommt, bestimmt die
     Themen-Priorität (⭐) und den Fragenkatalog am stärksten.
   - **Profil B — ohne:** Dann zählen die **Prüfungshinweise des Dozenten** aus den
     `Sprechstunden` am meisten, danach die dort **besprochenen Aufgaben**, dann die übrigen
     `Übungen`. Sagt der Dozent, dass etwas nicht gefragt wird, bekommt es kein ⭐.

   `Abgaben` zeigen in beiden Profilen, worauf der Dozent bei der Bewertung achtet. Ob die
   Prüfung schriftlich oder mündlich ist, steht in `quellen.config.json` unter `pruefung`.
2. **Quellentreue:** Fachaussagen **wo möglich aus dem `Skript`** belegen (dann
   `Vorlesungen`). Allgemeingültiges Wissen nur bei **offensichtlichen Fehlern oder
   Lücken** ergänzen — solche Stellen mit `(Ergänzung)` markieren.

Akzeptierte Formate: **PDF** (nativ lesbar), **PPT/PPTX** (werden zu Text/PDF
konvertiert), Markdown/Text. Bilder-only-PDFs brauchen ggf. OCR.
