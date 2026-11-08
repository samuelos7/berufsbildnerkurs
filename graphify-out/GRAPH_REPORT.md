# Graph Report - berufsbildnerkurs  (2026-11-08)

## Corpus Check
- 16 files · ~54,274 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

> Note: material/ semantic layer reused from the 2026-11-07 extraction (256,399 input tokens); app/ code added via AST on 2026-11-08 (0 tokens).

## Summary
- 343 nodes · 703 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Handlungskompetenzen Informatik
- App: 3D-Welt (scene3d.js)
- Tag 1: Rolle & Grundlagen
- Planung betriebliche Bildung
- Tag 2: Rechtstag & BiVo Informatik
- Bildungsplan & Lernorte
- App: UI & Screens (main.js)
- Ablaufplan der Lehrzeit
- Bildungssystem Schweiz
- Reflexionen

## God Nodes (most connected - your core abstractions)
1. `Lernort Lehrbetrieb` - 46 edges
2. `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` - 45 edges
3. `Präsenztag 2: Rechtstag – Rahmenbedingungen der Berufsbildung` - 35 edges
4. `Planung und Umsetzung der betrieblichen Bildung` - 25 edges
5. `Ablaufplan der Lehrzeit für Berufsbildner/innen` - 24 edges
6. `M()` - 19 edges
7. `Bildungsverordnung Informatiker/in EFZ – Antworten` - 13 edges
8. `Verordnung des SBFI über die berufliche Grundbildung Informatiker/in EFZ (SR 412.101.220.10)` - 12 edges
9. `mesh()` - 11 edges
10. `Handlungskompetenzbereich a: Begleiten von ICT-Projekten` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DBW – Dienststelle Berufs- und Weiterbildung` --semantically_similar_to--> `Dienststelle Berufs- und Weiterbildung (DBW), Abt. Betriebliche Bildung`  [INFERRED] [semantically similar]
  material/graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → material/Tag 2/WBZLU_KBB_BEKU_Präsenz_PP_Tag 2.pdf
- `Rekrutierung von Lernenden` --semantically_similar_to--> `Phase Rekrutierung`  [INFERRED] [semantically similar]
  material/graphify-out/converted/WBZLU BEKU_Tabelle meine Rolle als BB_406c9bb8.md → material/Tag 1/Ablaufplan der Lehrzeit-Druckversion ohne Verlinkungen.pdf
- `PEX – Prüfungsexperte` --semantically_similar_to--> `Prüfungsexpert/in`  [INFERRED] [semantically similar]
  material/graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → material/Tag 1/WBZLU_BEKU_Präsenz_PP_Tag 1.pdf
- `Reflexion Rechte und Pflichten von Lehrbetrieb und Lernenden` --semantically_similar_to--> `Rechte und Pflichten Lehrbetrieb und Lernende`  [INFERRED] [semantically similar]
  material/graphify-out/converted/WBZLU BEKU_Vorlage Reflexionen_8e5f7b21.md → material/Tag 2/WBZLU_KBB_BEKU_Präsenz_PP_Tag 2.pdf
- `BP – Berufsprüfung` --conceptually_related_to--> `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)`  [AMBIGUOUS]
  material/graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → material/Tag 1/DE_Bildungssystem_cmyk_frutiger.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Drei Beurteilungsarten in der betrieblichen Grundbildung** — material_tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_prognostische_beurteilung, material_tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_summative_beurteilung, material_tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_formative_beurteilung [EXTRACTED 1.00]
- **Die drei Lernorte der beruflichen Grundbildung** — material_tag_1_wbzlu_beku_präsenz_pp_tag_1_1_lernort_lehrbetrieb, material_tag_1_wbzlu_beku_präsenz_pp_tag_1_2_lernort_berufsfachschule, material_tag_1_wbzlu_beku_präsenz_pp_tag_1_3_lernort_überbetriebliche_kurse_ük, material_tag_1_wbzlu_beku_präsenz_pp_tag_1_die_drei_lernorte_der_berufsbildung [EXTRACTED 1.00]
- **Interventionsschema: Eskalationsstufen leichter, mittlerer, schwerer Verstoss** — material_tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_interventionsschema, material_tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_leichter_verstoss, material_tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_mittlerer_verstoss, material_tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_schwerer_verstoss [EXTRACTED 1.00]
- **Drei Lernorte der beruflichen Grundbildung** — material_tag_2_bipla_88611_d_lehrbetrieb, material_tag_2_bipla_88611_d_bfs, material_tag_2_bipla_88611_d_uek, material_tag_2_bipla_88611_d_lernortkooperation [EXTRACTED 1.00]
- **Kompetenzmodell: HKB – Handlungskompetenz – Leistungsziel mit K-Stufe** — material_tag_2_bipla_88611_d_hkb, material_tag_2_bipla_88611_d_handlungskompetenz, material_tag_2_bipla_88611_d_leistungsziele, material_tag_2_bipla_88611_d_vier_dimensionen, material_tag_2_bipla_88611_d_taxonomie [EXTRACTED 1.00]
- **Überwachung im laufenden Betrieb (Netze, Server, Applikationen)** — material_tag_2_bipla_88611_d_hk_e6, material_tag_2_bipla_88611_d_hk_f5, material_tag_2_bipla_88611_d_hk_h4 [INFERRED 0.85]

## Communities (11 total, 1 thin omitted)

### Community 0 - "Handlungskompetenzen Informatik"
Cohesion: 0.08
Nodes (62): Berufsbild (Arbeitsgebiet, Berufsausübung, Bedeutung), Fachrichtung Applikationsentwicklung, Fachrichtung Plattformentwicklung, a1: Bedürfnisse von Stakeholdern abklären und dokumentieren, a2: Vorgehensmodell für ein ICT-Projekt bestimmen, a3: Informationen zu ICT-Lösungen und Innovationen recherchieren, a4: ICT-Projekte gemäss Vorgehensmodell planen, a5: Varianten für ICT-Lösungen visualisieren und präsentieren (+54 more)

### Community 1 - "App: 3D-Welt (scene3d.js)"
Cohesion: 0.08
Nodes (48): addExtras(), amt(), animateChar(), applyTheme(), branche(), buildCarousel(), bundeshaus(), canvasTex() (+40 more)

### Community 2 - "Tag 1: Rolle & Grundlagen"
Cohesion: 0.07
Nodes (48): PEX – Prüfungsexperte, Aufgabe: Meine Rolle als Berufsbildner/in (Tabelle), Beziehungsgestaltung mit Lernenden, Erwartungen an die Rolle als Berufsbildner/in, Gleichstellung/Gleichberechtigung und Haltung des Lehrbetriebs, Kommunikation mit allen Anspruchsgruppen, Rekrutierung von Lernenden, Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen (+40 more)

### Community 3 - "Planung betriebliche Bildung"
Cohesion: 0.09
Nodes (39): Vorbereitung der Lern- und Arbeitsumgebung, Bildungsbericht (Formular, Ende jedes Semesters), Planung und Umsetzung der betrieblichen Bildung, Betrieblicher Bildungsplan, Bildungsbericht, Bildungsplan, Erster Arbeitstag / Einführung in den Betrieb, Fachkompetenz (+31 more)

### Community 4 - "Tag 2: Rechtstag & BiVo Informatik"
Cohesion: 0.10
Nodes (35): Mit Herausforderungen umgehen, Rechtliche Grundlagen der Lehrzeit (BBG, BBV, ArG, OR, BiVo, Bipla, DSG, ArGV 5, BehiG, GAV), Begleitende Massnahmen für gefährliche Arbeiten Jugendlicher, Lostly und Help Point (Kanton Luzern, DBW), Sexuelle Belästigung am Arbeitsplatz, Mini-Fallbeispiele (Interventionen), Mini-Fallbeispiel 1: Maria (Friseurin), Mini-Fallbeispiel 2: Sarah und Herr Bauer (+27 more)

### Community 5 - "Bildungsplan & Lernorte"
Cohesion: 0.11
Nodes (23): Allgemeinbildung, Anforderungsniveau des Berufes, Ausbildungsprogramm und Organisationsreglement üK, Ausführungsbestimmungen zum Qualifikationsverfahren, Berufsbildungsgesetz (BBG), Berufsbildungsverordnung (BBV), Lernort Berufsfachschule, Bildungsbericht (Vorlage SDBB) (+15 more)

### Community 6 - "App: UI & Screens (main.js)"
Cohesion: 0.12
Nodes (7): back(), crumbs(), go(), listNav(), patch(), render(), start()

### Community 7 - "Ablaufplan der Lehrzeit"
Cohesion: 0.17
Nodes (21): Ablaufplan der Lehrzeit für Berufsbildner/innen, Berufsbildungsamt des Lehrortskantons, Bildungsbewilligung, Bildungsplan (SBFI) als verbindliche Grundlage, Kurs für Berufsbildner/innen (40h), Lehrvertrag ausfüllen und einreichen, Lehrzeugnis und Abschlussgespräch, Lerndokumentation/Portfolio prüfen (ca. 1x pro Monat) (+13 more)

### Community 8 - "Bildungssystem Schweiz"
Cohesion: 0.16
Nodes (18): Glossar zum Bildungssystem der Schweiz, BP – Berufsprüfung, DBW – Dienststelle Berufs- und Weiterbildung, HFP – Höhere Fachprüfung, Berufsmaturität BM 1 / BM 2, Schaubild Bildungssystem Schweiz (SBFI 2026), Allgemeinbildende Schulen (Gymnasien, Fachmittelschulen), Berufliche Grundbildung (EFZ, EBA, Berufsmaturität) (+10 more)

### Community 9 - "Reflexionen"
Cohesion: 0.36
Nodes (10): Vorlage Reflexionen, Reflexion Instruieren und Anleiten, Reflexion Leistungsbeurteilung, Reflexion Rechte und Pflichten von Lehrbetrieb und Lernenden, Reflexion Rekrutierungsprozess, Reflexion Rückmeldungen, Reflexion Schwierige Gespräche führen, Reflexionsthemen des Kurses (+2 more)

## Ambiguous Edges - Review These
- `BP – Berufsprüfung` → `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)`  [AMBIGUOUS]
  material/graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md · relation: conceptually_related_to

## Knowledge Gaps
- **17 isolated node(s):** `Nationaler Qualifikationsrahmen Berufsbildung (NQR)`, `Erwartungen an die Rolle als Berufsbildner/in`, `Gleichstellung/Gleichberechtigung und Haltung des Lehrbetriebs`, `Berufsabschluss für Erwachsene – vier Wege`, `Berufsberatung` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 41 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` connect `Tag 1: Rolle & Grundlagen` to `Bildungssystem Schweiz`, `Reflexionen`, `Planung betriebliche Bildung`, `Tag 2: Rechtstag & BiVo Informatik`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Are the 44 inferred relationships involving `Lernort Lehrbetrieb` (e.g. with `Bildungsbericht (Vorlage SDBB)` and `a1: Bedürfnisse von Stakeholdern abklären und dokumentieren`) actually correct?**
  _`Lernort Lehrbetrieb` has 44 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Nationaler Qualifikationsrahmen Berufsbildung (NQR)`, `Erwartungen an die Rolle als Berufsbildner/in`, `Gleichstellung/Gleichberechtigung und Haltung des Lehrbetriebs` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Handlungskompetenzen Informatik` be split into smaller, more focused modules?**
  _Cohesion score 0.07680491551459294 - nodes in this community are weakly interconnected._
- **Why does `Präsenztag 2: Rechtstag – Rahmenbedingungen der Berufsbildung` connect `Tag 2: Rechtstag & BiVo Informatik` to `Tag 1: Rolle & Grundlagen`, `Planung betriebliche Bildung`, `Ablaufplan der Lehrzeit`, `Bildungssystem Schweiz`, `Reflexionen`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` (e.g. with `Glossar zum Bildungssystem der Schweiz` and `Schaubild Bildungssystem Schweiz (SBFI 2026)`) actually correct?**
  _`Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` has 2 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `BP – Berufsprüfung` and `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._