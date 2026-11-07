# Graph Report - material  (2026-11-07)

## Corpus Check
- Corpus is ~1,132 words - fits in a single context window. You may not need a graph.

## Summary
- 263 nodes · 543 edges · 9 communities
- Extraction: 78% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 116 edges (avg confidence: 0.83)
- Token cost: 256,399 input · 0 output

## Community Hubs (Navigation)
- Handlungskompetenzen Informatik
- Tag 1: Grundlagen & Stakeholder
- Tag 2: Rechtstag & Fallbeispiele
- Planung betriebliche Bildung
- Bildungsplan & Lernorte
- Ablaufplan der Lehrzeit
- Bildungssystem Schweiz
- Bildungsverordnung Informatiker
- Reflexionen

## God Nodes (most connected - your core abstractions)
1. `Lernort Lehrbetrieb` - 46 edges
2. `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` - 45 edges
3. `Präsenztag 2: Rechtstag – Rahmenbedingungen der Berufsbildung` - 35 edges
4. `Planung und Umsetzung der betrieblichen Bildung` - 25 edges
5. `Ablaufplan der Lehrzeit für Berufsbildner/innen` - 24 edges
6. `Bildungsverordnung Informatiker/in EFZ – Antworten` - 13 edges
7. `Verordnung des SBFI über die berufliche Grundbildung Informatiker/in EFZ (SR 412.101.220.10)` - 12 edges
8. `Handlungskompetenzbereich a: Begleiten von ICT-Projekten` - 11 edges
9. `Handlungskompetenzbereich f: Betreiben von Serversystemen und Serverdiensten` - 11 edges
10. `Schaubild Bildungssystem Schweiz (SBFI 2026)` - 10 edges

## Surprising Connections (you probably didn't know these)
- `DBW – Dienststelle Berufs- und Weiterbildung` --semantically_similar_to--> `Dienststelle Berufs- und Weiterbildung (DBW), Abt. Betriebliche Bildung`  [INFERRED] [semantically similar]
  graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → Tag 2/WBZLU_KBB_BEKU_Präsenz_PP_Tag 2.pdf
- `Rekrutierung von Lernenden` --semantically_similar_to--> `Phase Rekrutierung`  [INFERRED] [semantically similar]
  graphify-out/converted/WBZLU BEKU_Tabelle meine Rolle als BB_406c9bb8.md → Tag 1/Ablaufplan der Lehrzeit-Druckversion ohne Verlinkungen.pdf
- `PEX – Prüfungsexperte` --semantically_similar_to--> `Prüfungsexpert/in`  [INFERRED] [semantically similar]
  graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → Tag 1/WBZLU_BEKU_Präsenz_PP_Tag 1.pdf
- `Reflexion Rechte und Pflichten von Lehrbetrieb und Lernenden` --semantically_similar_to--> `Rechte und Pflichten Lehrbetrieb und Lernende`  [INFERRED] [semantically similar]
  graphify-out/converted/WBZLU BEKU_Vorlage Reflexionen_8e5f7b21.md → Tag 2/WBZLU_KBB_BEKU_Präsenz_PP_Tag 2.pdf
- `BP – Berufsprüfung` --conceptually_related_to--> `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)`  [AMBIGUOUS]
  graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md → Tag 1/DE_Bildungssystem_cmyk_frutiger.pdf

## Hyperedges (group relationships)
- **Die drei Lernorte der beruflichen Grundbildung** — tag_1_wbzlu_beku_präsenz_pp_tag_1_1_lernort_lehrbetrieb, tag_1_wbzlu_beku_präsenz_pp_tag_1_2_lernort_berufsfachschule, tag_1_wbzlu_beku_präsenz_pp_tag_1_3_lernort_überbetriebliche_kurse_ük, tag_1_wbzlu_beku_präsenz_pp_tag_1_die_drei_lernorte_der_berufsbildung [EXTRACTED 1.00]
- **Interventionsschema: Eskalationsstufen leichter, mittlerer, schwerer Verstoss** — tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_interventionsschema, tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_leichter_verstoss, tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_mittlerer_verstoss, tag_2_wbzlu_kbb_beku_präsenz_pp_tag_2_schwerer_verstoss [EXTRACTED 1.00]
- **Drei Beurteilungsarten in der betrieblichen Grundbildung** — tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_prognostische_beurteilung, tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_summative_beurteilung, tag_1_wbzlu_beku_planung_und_umsetzung_der_betrieblichen_bildung_formative_beurteilung [EXTRACTED 1.00]
- **Drei Lernorte der beruflichen Grundbildung** — tag_2_bipla_88611_d_lehrbetrieb, tag_2_bipla_88611_d_bfs, tag_2_bipla_88611_d_uek, tag_2_bipla_88611_d_lernortkooperation [EXTRACTED 1.00]
- **Kompetenzmodell: HKB – Handlungskompetenz – Leistungsziel mit K-Stufe** — tag_2_bipla_88611_d_hkb, tag_2_bipla_88611_d_handlungskompetenz, tag_2_bipla_88611_d_leistungsziele, tag_2_bipla_88611_d_vier_dimensionen, tag_2_bipla_88611_d_taxonomie [EXTRACTED 1.00]
- **Überwachung im laufenden Betrieb (Netze, Server, Applikationen)** — tag_2_bipla_88611_d_hk_e6, tag_2_bipla_88611_d_hk_f5, tag_2_bipla_88611_d_hk_h4 [INFERRED 0.85]

## Communities (9 total, 0 thin omitted)

### Community 0 - "Handlungskompetenzen Informatik"
Cohesion: 0.07
Nodes (63): Ausführungsbestimmungen zum Qualifikationsverfahren, Berufsbild (Arbeitsgebiet, Berufsausübung, Bedeutung), Fachrichtung Applikationsentwicklung, Fachrichtung Plattformentwicklung, a1: Bedürfnisse von Stakeholdern abklären und dokumentieren, a2: Vorgehensmodell für ein ICT-Projekt bestimmen, a3: Informationen zu ICT-Lösungen und Innovationen recherchieren, a4: ICT-Projekte gemäss Vorgehensmodell planen (+55 more)

### Community 1 - "Tag 1: Grundlagen & Stakeholder"
Cohesion: 0.07
Nodes (47): PEX – Prüfungsexperte, Aufgabe: Meine Rolle als Berufsbildner/in (Tabelle), Beziehungsgestaltung mit Lernenden, Erwartungen an die Rolle als Berufsbildner/in, Gleichstellung/Gleichberechtigung und Haltung des Lehrbetriebs, Kommunikation mit allen Anspruchsgruppen, Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen, 1. Lernort: Lehrbetrieb (+39 more)

### Community 2 - "Tag 2: Rechtstag & Fallbeispiele"
Cohesion: 0.10
Nodes (35): Mit Herausforderungen umgehen, Rechtliche Grundlagen der Lehrzeit (BBG, BBV, ArG, OR, BiVo, Bipla, DSG, ArGV 5, BehiG, GAV), Begleitende Massnahmen für gefährliche Arbeiten Jugendlicher, Lostly und Help Point (Kanton Luzern, DBW), Sexuelle Belästigung am Arbeitsplatz, Mini-Fallbeispiele (Interventionen), Mini-Fallbeispiel 1: Maria (Friseurin), Mini-Fallbeispiel 2: Sarah und Herr Bauer (+27 more)

### Community 3 - "Planung betriebliche Bildung"
Cohesion: 0.13
Nodes (25): Vorbereitung der Lern- und Arbeitsumgebung, Planung und Umsetzung der betrieblichen Bildung, Betrieblicher Bildungsplan, Bildungsbericht, Bildungsplan, Erster Arbeitstag / Einführung in den Betrieb, Fachkompetenz, Formative Beurteilung (+17 more)

### Community 4 - "Bildungsplan & Lernorte"
Cohesion: 0.12
Nodes (22): Allgemeinbildung, Anforderungsniveau des Berufes, Ausbildungsprogramm und Organisationsreglement üK, Berufsbildungsgesetz (BBG), Berufsbildungsverordnung (BBV), Lernort Berufsfachschule, Bildungsbericht (Vorlage SDBB), Bildungsplan Informatikerin/Informatiker EFZ (Berufsnummer 88611) (+14 more)

### Community 5 - "Ablaufplan der Lehrzeit"
Cohesion: 0.16
Nodes (23): Rekrutierung von Lernenden, Ablaufplan der Lehrzeit für Berufsbildner/innen, Berufsbildungsamt des Lehrortskantons, Bildungsbericht (Formular, Ende jedes Semesters), Bildungsbewilligung, Bildungsplan (SBFI) als verbindliche Grundlage, Kurs für Berufsbildner/innen (40h), Lehrvertrag ausfüllen und einreichen (+15 more)

### Community 6 - "Bildungssystem Schweiz"
Cohesion: 0.16
Nodes (18): Glossar zum Bildungssystem der Schweiz, BP – Berufsprüfung, DBW – Dienststelle Berufs- und Weiterbildung, HFP – Höhere Fachprüfung, Berufsmaturität BM 1 / BM 2, Schaubild Bildungssystem Schweiz (SBFI 2026), Allgemeinbildende Schulen (Gymnasien, Fachmittelschulen), Berufliche Grundbildung (EFZ, EBA, Berufsmaturität) (+10 more)

### Community 7 - "Bildungsverordnung Informatiker"
Cohesion: 0.32
Nodes (13): Bildungsverordnung Informatiker/in EFZ (Scan), Bildungsverordnung Informatiker/in EFZ – Antworten, Anforderungen an Berufsbildner/innen (Art. 10), Arbeitssicherheit, Gesundheits- und Umweltschutz (Art. 5), Bestehensregeln Qualifikationsverfahren (Art. 19 Abs. 1), Bildungsbericht Informatiker/in (Art. 13), Erfahrungsnote (Art. 19), Handlungskompetenzen Informatiker/in (Art. 3) (+5 more)

### Community 8 - "Reflexionen"
Cohesion: 0.36
Nodes (10): Vorlage Reflexionen, Reflexion Instruieren und Anleiten, Reflexion Leistungsbeurteilung, Reflexion Rechte und Pflichten von Lehrbetrieb und Lernenden, Reflexion Rekrutierungsprozess, Reflexion Rückmeldungen, Reflexion Schwierige Gespräche führen, Reflexionsthemen des Kurses (+2 more)

## Ambiguous Edges - Review These
- `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)` → `BP – Berufsprüfung`  [AMBIGUOUS]
  graphify-out/converted/WBZLU BEKU_Glossar Bildungssystem Schweiz_914e2f18.md · relation: conceptually_related_to

## Knowledge Gaps
- **17 isolated node(s):** `Voraussetzungen zum Ziele festlegen (arbeitstechnisch, fachlich, sozial, emotional, kulturell, individuell)`, `Prognostische Beurteilung`, `Formative Beurteilung`, `Handbuch betriebliche Grundbildung (Knutti, Dirren & Lehmann 2019)`, `Gleichstellung/Gleichberechtigung und Haltung des Lehrbetriebs` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 18 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` connect `Tag 1: Grundlagen & Stakeholder` to `Reflexionen`, `Tag 2: Rechtstag & Fallbeispiele`, `Planung betriebliche Bildung`, `Bildungssystem Schweiz`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Are the 44 inferred relationships involving `Lernort Lehrbetrieb` (e.g. with `Bildungsbericht (Vorlage SDBB)` and `a1: Bedürfnisse von Stakeholdern abklären und dokumentieren`) actually correct?**
  _`Lernort Lehrbetrieb` has 44 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Voraussetzungen zum Ziele festlegen (arbeitstechnisch, fachlich, sozial, emotional, kulturell, individuell)`, `Prognostische Beurteilung`, `Formative Beurteilung` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Handlungskompetenzen Informatik` be split into smaller, more focused modules?**
  _Cohesion score 0.07490079365079365 - nodes in this community are weakly interconnected._
- **Why does `Präsenztag 2: Rechtstag – Rahmenbedingungen der Berufsbildung` connect `Tag 2: Rechtstag & Fallbeispiele` to `Tag 1: Grundlagen & Stakeholder`, `Ablaufplan der Lehrzeit`, `Bildungssystem Schweiz`, `Bildungsverordnung Informatiker`, `Reflexionen`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` (e.g. with `Glossar zum Bildungssystem der Schweiz` and `Schaubild Bildungssystem Schweiz (SBFI 2026)`) actually correct?**
  _`Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen` has 2 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Höhere Berufsbildung (Eidg. Berufs- und höhere Fachprüfungen, Höhere Fachschulen)` and `BP – Berufsprüfung`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._