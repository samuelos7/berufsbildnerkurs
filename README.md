# Berufsbildner – Das Spiel der Lehrzeit

Mein Take-away aus dem Kurs für Berufsbildnerinnen und Berufsbildner am Weiterbildungszentrum (WBZ) Kanton Luzern: eine Zusammenfassung des Kursstoffs im Stil eines Game-Menüs. Die fünf Kurstage sind die Level, die Akteure der Berufsbildung sind die wählbaren Rollen.

Die App läuft offline im Browser und ist für eine Präsentation von 5 bis 9 Minuten gebaut.

## Starten

1. Repository herunterladen oder klonen.
2. `app/index.html` im Browser öffnen (Chrome oder Edge).

Es braucht keinen Server und keine Installation.

## Inhalt

| Bereich | Was drin ist |
| --- | --- |
| Kurstage | 5 Level mit 90 Missionen – von «Grundlagen & Lebenswelt» bis «Fair beurteilen & Take-away» |
| Rollen | Lernende, Berufsbildner/in, Eltern, Berufsfachschule, üK, DBW und weitere – mit Rechten, Pflichten und Beziehungen |
| Beispielberuf | Informatiker/in EFZ: BiVo, Bildungsplan, QV und meine eigene Umsetzung aus Tag 3 bis 5 |
| Lehrzeit | Ablauf der Lehre von der Rekrutierung bis zum Qualifikationsverfahren |
| Lexikon | Begriffe und Abkürzungen der Berufsbildung mit Erklärung |
| Arena | Quiz als Bosskampf und ein Duell zum Interventionsschema |
| Präsentation | Mein Take-away, Station für Station – entlang der Fragen aus dem Reflexionsbogen |

## Steuerung

| Taste | Funktion |
| --- | --- |
| ← → ↑ ↓ | Auswahl bewegen |
| Enter | Öffnen / bestätigen |
| Esc | Zurück |
| P | Präsentationsmodus (→ / Enter = weiter, ← = zurück) |
| 1–8 | Direktwahl im Menü |
| M | Ton an / aus |
| C | Credits (im Hauptmenü) |

Einzelne Ansichten lassen sich direkt über die Adresse öffnen, zum Beispiel `index.html#level-5`, `index.html#lexikon` oder `index.html#demo`.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `app/data.js` | Alle Inhalte: Level, Rollen, Lexikon, Quiz, Präsentationsstationen, Credits |
| `app/main.js` | Oberfläche, Navigation, Arena und Präsentationsmodus |
| `app/scene3d.js` | 3D-Kulisse Luzern und die Figuren (Three.js) |
| `app/style.css` | Gestaltung |
| `material/` | Kursunterlagen der Präsenztage 1 bis 5 und meine ausgefüllten Vorlagen |
| `graphify-out/` | Wissensgraph der Kursunterlagen (Arbeitswerkzeug bei der Entwicklung) |

Die App ist datengetrieben: Wer Inhalte ändern will, passt nur `app/data.js` an.

## Technik

HTML, CSS und JavaScript ohne Framework. Die 3D-Grafik nutzt Three.js r149 (MIT-Lizenz); Welt und Figuren sind im Code modelliert, der Ton wird live mit der Web Audio API erzeugt.

## Quellen und Hinweis

Die Inhalte stammen aus den Kursunterlagen des WBZ Kanton Luzern; die vollständige Quellenliste steht in den Credits der App (Taste C).

Private Lernhilfe ohne Gewähr – kein offizielles Angebot des Kantons Luzern oder des WBZ. Wappen und Logo dienen nur der Illustration. Massgebend sind die geltenden Erlasse (BBG, BBV, BiVo, Bildungsplan) und die Vorgaben der Dienststelle Berufs- und Weiterbildung (DBW) Luzern.

© 2026 Samuel Sergio da Costa · mit Claude (Anthropic)
