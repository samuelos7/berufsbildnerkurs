/* Spielinhalte – abgeleitet aus dem Kursmaterial (material/Tag 1, material/Tag 2).
   Neue Kurstage: im Array "levels" das Level ausfüllen und "placeholder" entfernen.

   Block-Typen für Missionen:
   list   { t:"list",  h, items:[...] }
   steps  { t:"steps", h, items:[...] }               nummerierter Ablauf
   table  { t:"table", h, head:[...], rows:[[...]] }
   cols   { t:"cols",  h, cols:[{h, items:[...]}] }    Karten nebeneinander
   stats  { t:"stats", h, items:[{v, l}] }             grosse Zahlen
   pyramid{ t:"pyramid", h, items:[{h, d}] }           oben → unten
   note   { t:"note",  text }                          Merksatz            */
window.GAME_DATA = {
  title: "Berufsbildner",
  subtitle: "Das Spiel der Lehrzeit",
  tagline: "Ein Kurs, fünf Level, neun Rollen – wer macht was in der beruflichen Grundbildung?",
  meta: "Berufsbildnerkurs · WBZ Kanton Luzern · Take-away",

  /* =====================================================================
     LEVELS = KURSTAGE
     ===================================================================== */
  levels: [
    {
      nr: 1,
      title: "Grundlagen & Lebenswelt",
      subtitle: "Rolle als Berufsbildner/in · Berufsbildungssystem · Lebenswelt der Jugendlichen · Prävention · Erfolgsfaktoren",
      c1: "#2f6fd6", c2: "#11214d",
      missions: [
        {
          ch: "Einführung",
          title: "Kursauftrag & Take-away",
          blocks: [
            { t: "list", h: "Kursziele – als Berufsbildner/in …", items: [
              "… bin ich mir meiner Rolle als Lernbegleiter/in bewusst",
              "… finde ich mich in den rechtlichen Grundlagen gut zurecht",
              "… rekrutiere ich Lernende treffsicher",
              "… bereite ich Arbeits- und Lernumgebungen effizient und effektiv vor",
              "… instruiere ich zielgerichtet und leite wirkungsvoll an",
              "… steuere ich den Lernprozess mit konstruktiven Rückmeldungen und fairer Beurteilung",
              "… löse ich schwierige Situationen konstruktiv",
            ] },
            { t: "cols", h: "Zwei Instrumente", cols: [
              { h: "📝 Reflexionen", items: ["Zu jedem Themenblock", "Welches sind meine wichtigsten Erkenntnisse?", "Welche To-dos und Massnahmen leite ich ab?"] },
              { h: "🎁 Take-away", items: ["Erkenntnisse sammeln und auswerten", "Entwicklungsmassnahmen ableiten", "Präsentation am Präsenztag 5: 5–8 Minuten"] },
            ] },
            { t: "note", text: "Zertifikat «Berufsbildner/in»: 100 % Anwesenheit, aktive Mitarbeit und das persönliche Take-away." },
          ],
          source: "PP Tag 1, Folien 8–15",
        },
        {
          ch: "Block 1 · Meine Rolle",
          title: "Die Rollen des Berufsbildners",
          blocks: [
            { t: "cols", cols: [
              { h: "🧭 Coach", items: ["Lernende im Berufsalltag unterstützen", "Neue Perspektiven aufzeigen", "Lernprozess begleiten", "Kompetenzerwerb begleiten"] },
              { h: "🛠️ Fachperson", items: ["Berufsfachliche Expertise einbringen", "Vorbildfunktion für Lernende", "Leistungsbeurteilung"] },
            ] },
            { t: "list", h: "Dazu kommen", items: ["Berater/in", "Begleiter/in der Lernenden"] },
            { t: "list", h: "Bereiche der Rolle (Tabelle «Meine Rolle als BB»)", items: [
              "Entwicklung und Beurteilung / Standortbestimmung",
              "Vorbereitung der Lern- und Arbeitsumgebung",
              "Rekrutierung von Lernenden",
              "Beziehungsgestaltung",
              "Kommunikation mit allen Anspruchsgruppen (Amt, Eltern, Mitarbeitende)",
              "Gleichstellung",
              "Unterstützung für weitere Schritte im Arbeitsleben",
            ] },
            { t: "note", text: "Aus der Tandem-Übung: «Die erste Woche ist massgebend für die Zukunft.» Respekt vermitteln – die Arbeit der Lernenden nicht belächeln." },
          ],
          source: "PP Tag 1, Folie 34 · Tabelle «Meine Rolle als BB»",
        },
        {
          ch: "Block 1 · Meine Rolle",
          title: "Berufsbildner/in vs. Fachperson",
          blocks: [
            { t: "table", head: ["Berufsbildner/in", "Fachperson («Praxisbildner/in»)"], rows: [
              ["Befähigt (vermittelt das Fachgebiet)", "Macht (beherrscht das Fachgebiet)"],
              ["Entwickelt Kompetenzen", "Erledigt Aufgaben"],
              ["Fokus auf Lernprozesse", "Fokus auf Resultate"],
              ["Nutzt Fehler als Lernchance", "Korrigiert Fehler"],
              ["Denkt aus Sicht der Lernenden", "Denkt aus Sicht der Fachkraft"],
              ["Fachliches & persönliches Vorbild", "Fachliches Vorbild"],
            ] },
          ],
          source: "PP Tag 1, Folie 35",
        },
        {
          ch: "Block 2 · Berufsbildungssystem",
          title: "Die berufliche Grundbildung",
          blocks: [
            { t: "list", h: "Das Wichtigste in Kürze", items: [
              "Vermittelt die grundlegenden Fähigkeiten und Fertigkeiten für die Ausübung eines Berufes",
              "Findet an drei Lernorten statt: Lehrbetrieb (1.), Berufsfachschule (2.), überbetriebliche Kurse (3.)",
              "Zeichnet sich durch eine hohe Durchlässigkeit aus – viele Weiterbildungsmöglichkeiten",
              "Anspruchsgruppen: Lernende, Berufsbildner/innen, Berufsfachschullehrer/innen, üK-Referent/innen, Prüfungsexpert/innen",
            ] },
            { t: "stats", items: [{ v: "3–4 J.", l: "EFZ – Eidg. Fähigkeitszeugnis" }, { v: "2 J.", l: "EBA – Eidg. Berufsattest" }, { v: "3", l: "Lernorte" }] },
          ],
          source: "PP Tag 1, Folien 22 & 35",
        },
        {
          ch: "Block 2 · Berufsbildungssystem",
          title: "Das Bildungssystem der Schweiz",
          blocks: [
            { t: "pyramid", h: "Vom Schulzimmer bis zum Doktorat (Schaubild SBFI 2026)", items: [
              { h: "Tertiärstufe – Hochschulen", d: "Fachhochschulen, Pädagogische Hochschulen, Universitäten / ETH · Bachelor, Master, PhD" },
              { h: "Tertiärstufe – Höhere Berufsbildung", d: "Eidg. Berufsprüfung (Fachausweis), Eidg. höhere Fachprüfung (Diplom), Höhere Fachschule (Diplom HF)" },
              { h: "Sekundarstufe II – Berufliche Grundbildung", d: "EBA, EFZ, Berufsmaturität · Lernorte: Betriebe, Berufsfachschulen, üK" },
              { h: "Sekundarstufe II – Allgemeinbildende Schulen", d: "Gymnasium (gymnasiale Maturität), Fachmittelschule (FMS-Ausweis, Fachmaturität)" },
              { h: "Brückenangebote", d: "Zwischen obligatorischer Schule und Sekundarstufe II" },
              { h: "Obligatorische Schule", d: "Grundlage für alle weiteren Wege" },
            ] },
            { t: "note", text: "Lebenslanges Lernen: Weiterbildung ist auf allen Stufen möglich – der Arbeitsmarkt und die Technologie verändern sich laufend." },
          ],
          source: "Schaubild Bildungssystem (SBFI 2026) · PP Tag 1, Folie 24",
        },
        {
          ch: "Block 2 · Berufsbildungssystem",
          title: "Zuständigkeiten",
          blocks: [
            { t: "table", head: ["Frage", "Zuständig", "Wie?"], rows: [
              ["Wer macht die organisatorischen und inhaltlichen Vorgaben?", "Bund – SBFI", "In Form von Bildungsverordnung (BiVo) und Bildungsplan (BiPla)"],
              ["Wer stellt die Inhalte bereit?", "Organisationen der Arbeitswelt (OdA)", "z. B. Holzbau Schweiz, IGKG, Kaufmännischer Verband, Suissetec"],
              ["Wer setzt die Grundbildung um?", "Kantonale Ämter / Dienststellen für Berufsbildung", "In Luzern: Dienststelle Berufs- und Weiterbildung (DBW)"],
              ["Wo findet die schulische Ausbildung statt?", "Berufsfachschulen", "Berufskunde und Allgemeinbildung"],
            ] },
          ],
          source: "PP Tag 1, Folie 26",
        },
        {
          ch: "Block 2 · Berufsbildungssystem",
          title: "Die drei Lernorte",
          blocks: [
            { t: "cols", cols: [
              { h: "🏭 1. Lehrbetrieb", items: ["Betriebliche Bildung", "Berufliches Handwerk und berufliche Kompetenzen", "Berufliche Sozialisation und Persönlichkeitsentwicklung", "Gesellschaftliche Werte: Höflichkeit, Pünktlichkeit, Zuverlässigkeit"] },
              { h: "🏫 2. Berufsfachschule", items: ["Schulische Bildung", "Theoretisches Wissen: Berufskunde und Allgemeinbildung", "In der Regel ein Tag pro Woche", "Rahmenlehrplan als Grundlage für den ABU"] },
              { h: "🛠️ 3. Überbetriebliche Kurse", items: ["Grundlegende Fertigkeiten", "Ergänzung zu Praxis und Schule", "Ziel: Transfer zwischen Theorie und Praxis", "Durchführung liegt bei den OdA"] },
            ] },
          ],
          source: "PP Tag 1, Folien 27–30 · PP Tag 2, Folie 33",
        },
        {
          ch: "Block 2 · Berufsbildungssystem",
          title: "Dokumente & Akteure",
          blocks: [
            { t: "cols", h: "Grundlagendokumente der Ausbildung", cols: [
              { h: "📕 Bildungsverordnung (BiVo)", items: ["Gesetzlicher Rahmen für die Grundbildung", "Einzeln für jeden Beruf"] },
              { h: "📗 Bildungsplan (BiPla)", items: ["Handlungskompetenzen", "Leistungsziele pro Lernort"] },
            ] },
            { t: "list", h: "Umsetzungsdokumente für den Lernort «Lehrbetrieb»", items: [
              "Betriebsinternes Ausbildungskonzept",
              "Lerndokumentation",
              "Bildungsbericht – Instrument der OdA zur Qualitätssicherung",
            ] },
            { t: "list", h: "Akteure der beruflichen Grundbildung", items: [
              "Lernende/r",
              "Berufsbildner/in im Lehrbetrieb (früher Lehrmeister/in)",
              "Berufsschullehrperson",
              "Referent/in in überbetrieblichen Kursen",
              "Prüfungsexpert/in",
            ] },
          ],
          source: "PP Tag 1, Folien 31–33",
        },
        {
          ch: "Block 3 · Lebenswelt der Jugendlichen",
          title: "Pubertät & Adoleszenz",
          blocks: [
            { t: "list", h: "Entwicklungsaufgaben", items: [
              "Geschlechterrolle annehmen",
              "Veränderung des Körpers akzeptieren",
              "Ablösung von den Eltern",
              "Weltanschauung entwickeln",
              "Zukunftsperspektive aufbauen",
              "Freundeskreis aufbauen",
            ] },
            { t: "list", h: "Der Weg zur Selbständigkeit", items: [
              "Neue Bezugsgruppen: die Gleichaltrigen (Peers)",
              "Jugendliche bilden ihr eigenes Wertesystem aus",
              "Materielle / finanzielle und räumliche Ablösung",
            ] },
            { t: "note", text: "Bewusste Abgrenzung von der Erwachsenenwelt – zu der auch Sie als Berufsbildner/in gehören! Die Jugendphase beginnt heute früher, kann länger dauern, und die Grenzen sind fliessend." },
          ],
          source: "PP Tag 1, Folien 42–44",
        },
        {
          ch: "Block 3 · Lebenswelt der Jugendlichen",
          title: "Hineinwachsen in neue Rollen",
          blocks: [
            { t: "cols", cols: [
              { h: "🏛️ Gesellschaft & Politik", items: ["Sich selbst als Teil der Gesellschaft sehen", "Das soziale Geschehen aktiv mitbeeinflussen", "Interesse am politischen und wirtschaftlichen Geschehen"] },
              { h: "💼 Arbeitsplatz", items: ["Finanzielle Unabhängigkeit erreichen", "Sich an Regeln des Berufs halten", "Positive Berufsidentität entwickeln", "Auf Augenhöhe mit Erwachsenen interagieren"] },
              { h: "👥 Soziales Umfeld", items: ["Persönliche Identität: Wer bin ich, was will ich?", "Eigene Meinungen und Werte entwickeln", "Als Bezugsperson für Peers agieren", "Eigene Beziehungen eingehen"] },
            ] },
          ],
          source: "PP Tag 1, Folie 46 (Hurrelmann & Quenzel 2016)",
        },
        {
          ch: "Block 3 · Lebenswelt der Jugendlichen",
          title: "Generationen im Vergleich",
          blocks: [
            { t: "table", head: ["Generation", "Geboren", "Prägendes Ereignis", "Führungsstil", "Lerntyp", "Werte"], rows: [
              ["Traditionalisten", "1922–1945", "2. Weltkrieg", "Kontrollieren", "Formal", "Loyalität"],
              ["Baby Boomer", "1946–1964", "Mondlandung 1969", "Anweisen", "Strukturiert", "Freiheit"],
              ["Generation X", "1965–1979", "Börsencrash 1987", "Koordinieren", "Partizipativ", "Unabhängigkeit"],
              ["Generation Y", "1980–1994", "September 2001", "Anleiten", "Interaktiv", "Kommunikation"],
              ["Generation Z", "1995–2009", "Finanzkrise 2008", "Befähigen", "Multi-modal", "Technologie"],
              ["Generation Alpha", "2010–2024", "Corona / Energiekrise", "Inspirieren", "Virtuell", "Nachhaltigkeit"],
            ] },
            { t: "note", text: "Die Generationen Z und Alpha treten jetzt in den Arbeitsmarkt ein – sie lassen sich lieber befähigen und inspirieren als kontrollieren." },
          ],
          source: "PP Tag 1, Folien 47–48",
        },
        {
          ch: "Block 3 · Lebenswelt der Jugendlichen",
          title: "Was Jugendliche bewegt",
          blocks: [
            { t: "stats", h: "Pro Juventute Jugendstudie – grösste Stressoren (häufig / sehr häufig)", items: [
              { v: "48 %", l: "Mädchen: Prüfungen" },
              { v: "36 %", l: "Jungen: Prüfungen" },
              { v: "39 %", l: "Mädchen: Terminstress" },
              { v: "26 %", l: "Jungen: Leistungsdruck" },
            ] },
            { t: "list", h: "Jugendbarometer 2025 (1009 Befragte, 16–30 Jahre)", items: [
              "Gesundheit wird zum zentralen Lebensprinzip",
              "Arbeit soll Sinn bieten – Sicherheit bleibt zentral",
              "Abschied vom Mythos der rebellischen Jugend",
              "Mehr Vertrauen in Fachpersonen als in Influencer",
              "Familienplanung wird bewusster und flexibler",
              "Zunehmende Unterschiede innerhalb der Generation",
            ] },
            { t: "list", h: "Die Jugend wird politischer", items: ["Gleichstellung «MeToo»", "Klimawandel «Fridays for Future»", "Rassismus «Black Lives Matter»"] },
          ],
          source: "PP Tag 1, Folien 49–55",
        },
        {
          ch: "Block 3 · Lebenswelt der Jugendlichen",
          title: "Digital Natives im Betrieb",
          blocks: [
            { t: "list", items: [
              "Die Lernenden sind Digital Natives und praktisch rund um die Uhr online",
              "Sie wenden viel Energie dafür auf, ihre Kontakte zu pflegen",
              "Unterhaltungen sind weniger persönlich und mehr digital",
              "Instagram, Snapchat, TikTok und Co.: eigene digitale Identitäten",
            ] },
            { t: "note", text: "Für Berufsbildner/innen heisst das: Digitalisierung als Lebensbestandteil akzeptieren – und z. B. klare Regeln über den Gebrauch digitaler Medien am Arbeitsplatz vereinbaren." },
          ],
          source: "PP Tag 1, Folie 57",
        },
        {
          ch: "Block 4 · Prävention",
          title: "Sexuelle Belästigung",
          blocks: [
            { t: "note", text: "Jedes Verhalten mit sexuellem Bezug oder aufgrund der Geschlechtszugehörigkeit, das von einer Seite unerwünscht ist und eine Person in ihrer Würde verletzt. Ausschlaggebend ist das Empfinden der belästigten Person – nicht die Absicht. Mit Worten, Bildern, Gesten oder Taten." },
            { t: "steps", h: "Wie reagieren?", items: [
              "Gerüchte, Hinweise oder Beschwerden ernst nehmen – und sofort nachgehen",
              "Rasch ein Gespräch mit der betroffenen Person führen",
              "Rasch ein Gespräch mit der beschuldigten Person führen",
              "Eindeutiger Fall: belästigende Person sofort stoppen",
              "Unklare Situation: Untersuchung anordnen, provisorische Schutzmassnahmen ergreifen",
              "Bei Belästigung: Sanktionen – die belästigte Person hat Anspruch auf Wiedergutmachung",
              "Mitarbeitende in geeigneter Form informieren",
              "Präventive Massnahmen ergreifen oder verstärken",
            ] },
          ],
          source: "PP Tag 1, Folien 63–64",
        },
        {
          ch: "Block 4 · Prävention",
          title: "Sucht & Jugendschutz",
          blocks: [
            { t: "pyramid", h: "Die Präventions-Pyramide", items: [
              { h: "Suchthilfe", d: "Für Jugendliche mit Suchtproblematik – ambulante Beratung oder stationäre Therapie" },
              { h: "Früherkennung & Frühintervention", d: "Für gefährdete Jugendliche mit risikoreichem Konsum: «Hinschauen und handeln»" },
              { h: "Gesundheitsförderung & Prävention", d: "Für alle Kinder und Jugendlichen: Nein sagen, mit Stress und Gruppendruck umgehen" },
              { h: "Strukturelle Rahmenbedingungen", d: "Gesetzlicher Jugendschutz als Fundament" },
            ] },
            { t: "list", h: "Gesetzlicher Jugendschutz", items: [
              "Abgabeverbot von Suchtmitteln an Minderjährige",
              "Mindestalter bei Alkohol und Tabak",
              "Preisregulierung, Werbeeinschränkungen, Verkaufs- und Zugangsbeschränkungen",
            ] },
            { t: "cols", h: "Kampagnen", cols: [
              { h: "🚭 zackstark", items: ["Nikotinfrei durch die Lehre"] },
              { h: "🎰 GameChanger", items: ["Angebot bei Geldspielsucht"] },
            ] },
          ],
          source: "PP Tag 1, Folien 65–71",
        },
        {
          ch: "Erfolgsfaktoren",
          title: "Erfolgsfaktoren der Grundbildung",
          blocks: [
            { t: "note", text: "Auf eine wertschätzende und respektvolle Haltung kommt es an: wahrnehmen, ernst nehmen, anerkennen." },
            { t: "cols", h: "Was trägt zu einer gelungenen Beziehung bei?", cols: [
              { h: "❤️ Haltung", items: ["Herausforderungen, Einstellungen und Verhalten anerkennen", "Respektvolle und wertschätzende Kommunikation", "Die Persönlichkeit der Lernenden akzeptieren"] },
              { h: "📐 Struktur", items: ["Vollständige Aufträge", "Klare Instruktionen", "Regelmässige Rückmeldungen"] },
              { h: "🌱 Werte", items: ["Werte der neuen Berufswelt", "Übergreifende Werte der Gesellschaft", "Respekt, Toleranz, Umweltschutz, Wertschätzung"] },
            ] },
            { t: "list", h: "Lostly – Hilfe für Lernende im Kanton Luzern (DBW)", items: ["Schulische Unterstützung", "Unterstützung bei Problemen im Lehrbetrieb", "Psychologische Beratung", "Help Point"] },
          ],
          source: "PP Tag 1, Folien 74–82",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Handlungskompetenzen",
          blocks: [
            { t: "cols", h: "Die vier Kompetenzen im Bildungsplan", cols: [
              { h: "Fachkompetenz", items: ["Berufstypische Situationen zielorientiert, sachgerecht und selbstständig bewältigen"] },
              { h: "Methodenkompetenz", items: ["Aufgaben planen, zielgerichtet, strukturiert und effektiv vorgehen"] },
              { h: "Sozialkompetenz", items: ["Soziale Beziehungen im Beruf bewusst und konstruktiv gestalten"] },
              { h: "Selbstkompetenz", items: ["Die eigene Persönlichkeit und Haltung im Berufsalltag einbringen"] },
            ] },
            { t: "list", h: "Ressourcen je Handlungssituation", items: [
              "Kenntnisse – Theorien, Begriffe, Regeln",
              "Fähigkeiten – eingeübte Abläufe, Prozeduren, Fertigkeiten",
              "Haltungen – Einstellungen, Werte, Normen",
            ] },
            { t: "note", text: "Jede Kompetenz ist durch mindestens eine Handlungssituation beschrieben – mit Tätigkeiten (beobachtbar) und Normen (Bestimmungen)." },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 1–2",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Den Bildungsverlauf planen",
          blocks: [
            { t: "table", head: ["Instrument", "Zuständig", "Regelt"], rows: [
              ["BBG / BBV", "Bund", "Qualitätsentwicklung und Qualitätsstandards (BBG Art. 8 + 19, BBV Art. 3, 12, 13)"],
              ["Bildungsverordnung des Berufs", "OdA mit Kantonen erarbeitet, vom Bund erlassen", "Gegenstand, Dauer, Ziele, Lernort-Anteile, QV, Ausweise und Titel"],
              ["Bildungsplan / Ausbildungsprogramm", "OdA erarbeitet, vom Bund genehmigt", "Welche Ziele am Ende erfüllt sein müssen und wie sie auf die Lernorte verteilt sind"],
              ["Betrieblicher Bildungsplan", "Lehrbetrieb, Berufsbildner/in", "Ziele auf Lehrjahre / Semester und Stationen im Betrieb verteilen – vom Einfachen zum Schwierigen"],
              ["Individueller Bildungsplan", "Berufsbildner/in mit der lernenden Person", "Anpassung an die einzelne Person: Kapazität, Überprüfung, Freifächer, Prüfungsvorbereitung"],
            ] },
            { t: "note", text: "Ein guter Bildungsplan ist flexibel – die Planung geht vom «Ideal» aus, die Praxis weicht oft ab." },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 2 & 4–5",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Bildungsbericht & Lerndokumentation",
          blocks: [
            { t: "steps", h: "Das Bildungsgespräch nach SDBB (mind. 1x pro Semester, BBG Art. 20)", items: [
              "Kompetenzen – Bildungsstand fachlich, methodisch, sozial und persönlich festhalten",
              "Lerndokumentation – kommentieren und beurteilen",
              "Leistungen – Zeugnis der Berufsfachschule und üK besprechen",
              "Sicht der lernenden Person – Erfahrungen und Meinung einholen",
              "Ziele und Massnahmen – gemeinsam für die nächste Periode festlegen",
              "Verbindlichkeit – alle Beteiligten unterschreiben",
            ] },
            { t: "list", h: "Wozu die Lerndokumentation? (Lernberichte mind. 1x pro Monat)", items: [
              "Strukturiert und dokumentiert die betriebliche Grundbildung",
              "Arbeitsabläufe mit Text und Bild nachvollziehen",
              "Die Ausbildung reflektieren – Verantwortung übernehmen",
              "Vorbereitung auf den Bildungsbericht",
              "Nachschlagewerk für die Abschlussprüfung",
            ] },
            { t: "note", text: "Auch schwächere Lernende führen sie – Skizzen und Fotos reduzieren den Schreibaufwand. Am Anfang systematisch (auch unangemeldet) kontrollieren." },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 2–3",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Ziele festlegen & instruieren",
          blocks: [
            { t: "list", h: "Voraussetzungen klären", items: [
              "Arbeitstechnisch – welche Arbeits- und Lerntechniken?",
              "Fachlich – welches Vorwissen?",
              "Sozial – welche Grundhaltung gegenüber anderen?",
              "Emotional – welche Haltung gegenüber Aufträgen?",
              "Kulturell – welcher Hintergrund?",
              "Individuell – droht Über- oder Unterforderung?",
            ] },
            { t: "cols", cols: [
              { h: "Instruktionsmethode", items: ["1. Demonstrieren", "2. Nachvollziehen", "3. Kontrollieren", "4. Korrigieren", "➕ Neue Techniken werden schnell gelernt", "➖ Lernende ahmen nur nach, Fehler gelten als Störfaktor"] },
              { h: "6-Schritte-Methode", items: ["1. Informieren", "2. Planen", "3. Entscheiden", "4. Realisieren", "5. Kontrollieren", "6. Auswerten", "➕ Selbstorganisiertes, eigenständiges Lernen"] },
            ] },
            { t: "note", text: "Neugier ist eine gute Voraussetzung fürs Lernen – Angst ist ein grosser Lernbehinderer. Wertschätzung zeigen!" },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 5–6",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Der erste Arbeitstag",
          blocks: [
            { t: "steps", items: [
              "Die lernende Person wird erwartet und empfangen – Vertrauen aufbauen",
              "Berufskleidung und Namensschild aushändigen",
              "Arbeitsplatz, Garderobe und persönliche Bereiche zeigen",
              "Zeitlichen Ablauf bekanntgeben: Arbeitszeiten, Pausen, Mittag",
              "Alle Mitarbeitenden vorstellen – eine Patin oder einen Paten bestimmen",
              "Erste Arbeiten ermöglichen Erfolge, positive Rückmeldungen nehmen Stress",
              "Über den Bildungsrahmen informieren: Bildungsplan, Berufsfachschule, üK",
              "Zeitnah über Arbeitssicherheit und Gesundheitsschutz informieren",
              "Austausch nach dem ersten Tag und am Ende der ersten Woche",
            ] },
            { t: "note", text: "Alles ist neu: Gesichter, Namen, Räume, Vorschriften, Betriebsklima. Fragen stets wohlwollend beantworten." },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 7",
        },
        {
          ch: "Begleitdokument · Planung",
          title: "Arbeitsergebnisse beurteilen",
          blocks: [
            { t: "table", head: ["Beurteilung", "Zweck", "Beispiele"], rows: [
              ["Prognostisch", "Vorhersage: Passen die Fähigkeiten zu den Anforderungen?", "Auswahl von Lernenden vor der Anstellung"],
              ["Summativ", "Bilanz am Ende einer Lernphase – bestimmt den weiteren Verlauf", "Test, Qualifikationsgespräch, Abschlussprüfung"],
              ["Formativ", "Qualität sichern während des Lernprozesses – laufend, fast täglich", "Gemeinsam arbeiten, sprechen, Probleme erkennen und lösen"],
            ] },
            { t: "note", text: "Klar verständliche Beurteilungskriterien zu formulieren gehört zu den anspruchsvollsten Aufgaben von Berufsbildner/innen." },
          ],
          source: "Planung und Umsetzung der betrieblichen Bildung, S. 8",
        },
      ],
    },
    {
      nr: 2,
      title: "Der Rechtstag",
      subtitle: "DBW · Gesetzliche Grundlagen · Lernortkooperation · Lehrvertrag · Rechte & Pflichten · Interventionen · Unterstützungsangebote",
      c1: "#8a4fe0", c2: "#22114d",
      missions: [
        {
          ch: "Einstieg",
          title: "Tagesziele Rechtstag",
          blocks: [
            { t: "list", items: [
              "Die Verordnung und das Qualifikationsverfahren des eigenen Berufs kennen",
              "Die gesetzlichen Vorschriften kennen – insbesondere zum Lehrvertrag und zu den Bildungstypen",
              "Mit gesetzlichen Vertretungen, Behörden, OdA, Berufsfachschulen, üK-Anbietern und Beratungsstellen zusammenarbeiten",
              "Vorschriften und begleitende Massnahmen für Arbeitssicherheit, Gesundheitsschutz und Hygiene kennen",
              "Für spezifische Probleme von Lernenden sensibilisiert sein und Hilfestellungen geben",
            ] },
          ],
          source: "PP Tag 2, Folie 2",
        },
        {
          ch: "DBW",
          title: "Die DBW stellt sich vor",
          blocks: [
            { t: "stats", h: "Berufsbildung Luzern in Zahlen (Stand 1.9.2025)", items: [
              { v: "12'889", l: "Aktive Lehrverträge" },
              { v: "4'920", l: "Neue Lehrverträge 2025" },
              { v: "4'356", l: "Aktive Lehrbetriebe" },
              { v: "200", l: "Berufe mit Lehrverhältnissen" },
              { v: "50", l: "üK-Zentren" },
            ] },
            { t: "list", h: "Gesetzlicher Auftrag «Lehraufsicht» – ab Lehrvertragsunterzeichnung bis QV", items: [
              "Genehmigung, Anpassung und Auflösung von Lehrverhältnissen",
              "Erteilung und Entzug von Bildungsbewilligungen",
              "Leistungsverträge bzw. Bewilligungen mit Organisationen (üK, KBB, KQV)",
            ] },
            { t: "cols", h: "Auftrag und Rollen der Abteilung Betriebliche Bildung", cols: [
              { h: "🔍 Lehraufsicht", items: ["Qualitätssicherung"] },
              { h: "🤝 Beratung", items: ["Unterstützung"] },
              { h: "📂 Support", items: ["Lehrvertragsmanagement"] },
            ] },
            { t: "note", text: "Ziel aller Lernorte in der Lernortkooperation: der individuelle Lernerfolg (98 %)." },
          ],
          source: "PP Tag 2, Folien 7–9",
        },
        {
          ch: "Bildungssystem",
          title: "Berufsmaturität & Grundkompetenzen",
          blocks: [
            { t: "list", h: "Mehrwert der Berufsmaturität für den Betrieb", items: [
              "BM-Lernende sind leistungsfähiger",
              "Die BM vermittelt auch Sozial- und Selbstkompetenzen",
              "Berufsmaturand/innen können für anspruchsvollere Aufgaben eingesetzt werden",
              "Die BM macht Lehrstellen für leistungsstarke Lernende attraktiver",
              "Die Fehlzeiten werden durch eine hohe Produktivität ausgeglichen",
            ] },
            { t: "list", h: "Grundkompetenzen Erwachsener (Weiterbildungsgesetz 2017)", items: [
              "Lesen, Schreiben und mündliche Ausdrucksfähigkeit in einer Landessprache",
              "Grundkenntnisse der Mathematik",
              "Anwendung von Informations- und Kommunikationstechnologien (IKT)",
            ] },
            { t: "cols", h: "500 CHF Gutschein – besser-jetzt.ch/luzern", cols: [
              { h: "Wer?", items: ["18–65 Jahre, wohnhaft im Kanton Luzern", "Nicht in Ausbildung auf Sek-II-Stufe", "Ab Sprachniveau A2"] },
              { h: "Wie?", items: ["Neu 2 Gutscheine pro Person und Jahr", "Entwertung nach 60 % Kursbesuch", "Gratis-Hotline 0800 47 47 47, Kurzberatung im BIZ"] },
              { h: "Nutzen für Betriebe", items: ["Gegen Fachkräftemangel", "Mehr Effizienz und Qualität", "Weniger Unfälle, Absenzen, Support", "Mehr Zufriedenheit und Bindung"] },
            ] },
          ],
          source: "PP Tag 2, Folien 13–19",
        },
        {
          ch: "Bildungssystem",
          title: "Berufsabschluss für Erwachsene",
          blocks: [
            { t: "table", head: ["", "Reguläre Grundbildung", "Verkürzte Grundbildung", "Direkte Zulassung zum QV", "Validierung"], rows: [
              ["Lehrvertrag", "Ja", "Ja", "Nein", "Nein"],
              ["Voraussetzung", "Obligatorische Schule", "Abgeschlossene Ausbildung Sek II", "5 Jahre Berufserfahrung, ein Teil im Beruf", "5 Jahre Berufserfahrung, ein Teil im Beruf"],
              ["Dauer", "EBA 2, EFZ 3–4 Jahre", "Meist 1–2 Jahre kürzer", "Meist 1–2 Jahre", "Meist 2–3 Jahre"],
              ["Pensum", "Vollzeit", "Vollzeit", "Berufsbegleitend", "Berufsbegleitend"],
              ["Qualifikation", "Reguläre Abschlussprüfung", "Reguläre Abschlussprüfung", "Abschlussprüfung ohne Erfahrungsnote", "Dossier + Beurteilungsgespräch"],
            ] },
            { t: "note", text: "Alle vier Wege führen zum gleichen Abschluss: eidgenössisches Fähigkeitszeugnis EFZ oder eidgenössisches Berufsattest EBA." },
          ],
          source: "PP Tag 2, Folie 20",
        },
        {
          ch: "Gesetzliche Grundlagen",
          title: "Die Gesetzespyramide",
          blocks: [
            { t: "pyramid", h: "Alles beginnt bei der Bundesverfassung", items: [
              { h: "Bildungsverordnung & Bildungsplan", d: "Kernelemente jeder beruflichen Grundbildung" },
              { h: "Berufsbildungsverordnung (BBV)", d: "Konkretisiert das Berufsbildungsgesetz" },
              { h: "Berufsbildungsgesetz (BBG)", d: "Öffentlich-rechtlich – gestützt auf BV Art. 63" },
              { h: "Bundesverfassung (BV)", d: "Art. 63 Berufsbildung · Art. 122 Zivilrecht · Art. 110 / 118 Arbeits- und Gesundheitsschutz" },
            ] },
            { t: "cols", cols: [
              { h: "⚖️ Zivilrechtlich (BV Art. 122)", items: ["Obligationenrecht (OR)", "Lehrvertrag", "Einzelarbeitsvertrag"] },
              { h: "🏛️ Öffentlich-rechtlich (BV Art. 63)", items: ["Berufsbildungsgesetz BBG", "Berufsbildungsverordnung BBV", "Bildungsverordnung (Bildungsplan etc.)"] },
              { h: "🦺 Öffentlich-rechtlich (BV Art. 110 / 118)", items: ["Arbeitsgesetz ArG", "Verordnungen (z. B. ArGV 5)", "Spezialrechtliche Bestimmungen"] },
            ] },
          ],
          source: "PP Tag 2, Folien 22–23",
        },
        {
          ch: "Gesetzliche Grundlagen",
          title: "Jugendarbeitsschutz",
          blocks: [
            { t: "stats", items: [{ v: "18", l: "Gefährliche Arbeiten grundsätzlich erst ab 18 Jahren" }, { v: "15", l: "Ausnahme ab 15 – wenn in der BiVo vorgesehen" }] },
            { t: "list", h: "Bedingung: begleitende Massnahmen (ArGV 5, Art. 4)", items: [
              "Schulung und Ausbildung der Lernenden",
              "Anleitung – durch wen und wann?",
              "Überwachung durch eine Fachkraft oder den/die Berufsbildner/in",
            ] },
            { t: "note", text: "Die begleitenden Massnahmen gelten ergänzend zur Schulung der anderen Mitarbeitenden. Der Lehrbetrieb ist verpflichtet, sie einzuhalten (sbbk.ch)." },
          ],
          source: "PP Tag 2, Folien 24–26 · Planung, S. 7",
        },
        {
          ch: "Gesetzliche Grundlagen",
          title: "BiVo & Bildungsplan",
          blocks: [
            { t: "cols", cols: [
              { h: "📕 Bildungsverordnung regelt …", items: ["Schwerpunkte, Ausbildungs- und Prüfungsbranchen, Dauer", "Ziele und Anforderungen", "Handlungskompetenzen", "Arbeitssicherheit, Gesundheits- und Umweltschutz", "Umfang der Bildung pro Lernort (Lektionen, üK)", "Anforderungen an Berufsbildner/innen", "Lerndokumentation, Bildungsbericht", "Qualifikationsverfahren", "Ausweise und Titel"] },
              { h: "📗 Bildungsplan enthält …", items: ["Berufspädagogische Grundlagen – Handlungskompetenzorientierung, Lernortkooperation", "Qualifikationsprofil: Berufsbild, Anforderungsniveau, Übersicht Handlungskompetenzen", "Handlungskompetenzbereiche und Handlungskompetenzen", "Leistungsziele – je nach Lernort unterteilt"] },
            ] },
          ],
          source: "PP Tag 2, Folie 28",
        },
        {
          ch: "Gesetzliche Grundlagen",
          title: "Staat & OdA – die Verbundpartner",
          blocks: [
            { t: "table", head: ["Partner", "Aufgabe"], rows: [
              ["Bund", "Erlass von Gesetzen, Verordnungen und Reglementen · strategische Steuerung und Entwicklung"],
              ["Kantone", "Erlass von Ausführungsbestimmungen · Umsetzung und Aufsicht"],
              ["Organisationen der Arbeitswelt", "Bildungsinhalte · Ausbildungsplätze"],
              ["Betriebe", "Berufliche Praxis"],
              ["Im Zentrum: die lernende Person", "Lernt in Berufsfachschule, überbetrieblichen Kursen und beruflicher Praxis"],
            ] },
            { t: "steps", h: "Die 5-Jahres-Überprüfung der BiVo", items: [
              "5-Jahres-Überprüfung: Umfrage, Handlungsbedarf feststellen",
              "Qualifikationsprofil entwickeln",
              "Bildungserlasse erarbeiten: Bildungsverordnung und Bildungsplan",
              "Anhörung durch das SBFI und Bereinigung",
              "Erlass und Genehmigung durch das SBFI, Veröffentlichung",
              "Umsetzung – Einstufung NQR-BB, Kommission B&Q",
            ] },
          ],
          source: "PP Tag 2, Folien 29–30",
        },
        {
          ch: "Lernortkooperation",
          title: "Planungsinstrumente der Lernorte",
          blocks: [
            { t: "table", head: ["Lernort", "Instrument", "Erarbeitet von"], rows: [
              ["Lehrbetrieb", "Ausbildungsprogramm für die Lehrbetriebe", "OdA (oft dient direkt der Bildungsplan)"],
              ["Lehrbetrieb", "Betrieblicher Bildungsplan", "Berufsbildner/innen"],
              ["Lehrbetrieb", "Individueller Bildungsplan", "Berufsbildner/innen und Lernende"],
              ["Berufsfachschule", "Lehrplan für die Berufsfachschulen", "OdA mit den Berufsfachschulen"],
              ["Berufsfachschule", "Schulischer Lehrplan", "Berufsfachschule"],
              ["üK-Zentrum", "Ausbildungsprogramm für die üK", "OdA mit Kantonen und üK-Zentren"],
              ["üK-Zentrum", "Detailplanung des Kurses", "Kursleitende"],
            ] },
            { t: "note", text: "Lernortkooperation (LOK): Betrieb, Berufsfachschule und üK stimmen sich ab – damit Theorie und Praxis zusammenpassen." },
          ],
          source: "PP Tag 2, Folien 32–34",
        },
        {
          ch: "Lehrvertrag",
          title: "Der Lehrvertrag",
          blocks: [
            { t: "cols", h: "3 Besonderheiten", cols: [
              { h: "⏳ Befristet", items: ["Befristeter Arbeitsvertrag"] },
              { h: "✍️ Schriftlich", items: ["Zwingende Formvorschrift"] },
              { h: "✅ Genehmigt", items: ["Genehmigungspflichtig durch die DBW"] },
            ] },
            { t: "table", head: ["Punkt", "Inhalt"], rows: [
              ["Vertrag zwischen", "Lehrbetrieb und lernender Person (gesetzliche Vertretung)"],
              ["Genehmigung", "Durch die kantonale Behörde (Berufsbildungsamt)"],
              ["Form", "Schriftlich"],
              ["Inhalt", "Vertragsparteien · Berufsbezeichnung, Bildungsdauer, Probezeit · verantwortliche/r Berufsbildner/in · Unterricht an der Berufsfachschule · Entschädigung · Arbeitszeit · Ferien · berufsnotwendige Beschaffungen · Versicherungen"],
              ["Beilagen (fakultativ)", "Weitere besondere Vereinbarungen"],
            ] },
            { t: "list", h: "Rechtliche Grundlagen", items: ["Berufsbildungsgesetz und -verordnung (BBG / BBV)", "Bildungsverordnung (BiVo)", "Obligationenrecht (OR)", "Jugendarbeitsschutz (ArG)", "Unfallversicherungsgesetz (UVG)"] },
          ],
          source: "PP Tag 2, Folien 36–38",
        },
        {
          ch: "Lehrvertrag",
          title: "Portal Berufsbildung",
          blocks: [
            { t: "list", h: "Funktionen", items: [
              "Lernenden- und Lehrbetriebsdaten mutieren",
              "Lena-Daten erfassen und mutieren",
              "Lehrverträge erfassen und verwalten",
              "Berufsbildner/innen verwalten",
              "Bildungsbewilligungen verwalten und neue beantragen",
              "Lehrvertragsverlängerungen erfassen",
              "QV-Daten einsehen, Abmeldungen beantragen",
              "Dokumente herunter- und heraufladen",
            ] },
            { t: "list", h: "Mehrwert für Lehrbetriebe", items: [
              "Alles auf einen Blick – ein zentrales System",
              "Höhere Datenqualität durch eigenständige Mutationen",
              "Unabhängig von Büro-Öffnungszeiten",
              "Kürzere Wege zur DBW",
            ] },
          ],
          source: "PP Tag 2, Folien 43–44",
        },
        {
          ch: "Rechte & Pflichten",
          title: "Rechte & Pflichten im Lehrverhältnis",
          blocks: [
            { t: "note", text: "Am Rechtstag in der Gruppenarbeit erarbeitet: Welche Rechte und Pflichten haben Berufsbildende – und welche die Lernenden? Grundlage sind Lehrvertrag, OR und BBG." },
            { t: "cols", h: "Was der Lehrvertrag für beide Seiten regelt", cols: [
              { h: "📄 Rahmen", items: ["Bildungsdauer und Probezeit", "Verantwortliche/r Berufsbildner/in", "Unterricht an der Berufsfachschule"] },
              { h: "💰 Arbeit", items: ["Entschädigung (Lohn)", "Arbeitszeit", "Ferien"] },
              { h: "🧰 Weiteres", items: ["Berufsnotwendige Beschaffungen", "Versicherungen", "Besondere Vereinbarungen"] },
            ] },
            { t: "list", h: "Abwesenheiten, die geregelt sein müssen (Ablaufplan)", items: [
              "üK-Tage, Ferien, Kompensation",
              "Militär / Zivilschutz / Zivildienst",
              "Schwangerschaft / Mutterschaft, Krankheit / Unfall",
              "Jugendurlaub, anderer bezahlter Urlaub (Todesfall, eigene Hochzeit, Umzug …)",
            ] },
            { t: "note", text: "Tipp: Die Rechte und Pflichten jeder Rolle findest du in der Charakterwahl – inklusive Lehrbetrieb/Arbeitgeber." },
          ],
          source: "PP Tag 2, Folien 36 & 47 · Ablaufplan",
        },
        {
          ch: "Interventionen",
          title: "Herausforderungen erkennen",
          blocks: [
            { t: "list", h: "Gängigste Herausforderungen", items: [
              "Mangelhafte Leistungen der Lernenden",
              "Zwischenmenschliche Probleme",
              "Regelverletzungen (z. B. zu spät zur Arbeit erscheinen)",
              "Gesundheitliche Aspekte, auch im psychischen Bereich",
              "Falsche Berufswahl",
              "Unpassendes Niveau – z. B. EBA statt EFZ oder umgekehrt",
              "Suchtprobleme",
            ] },
            { t: "note", text: "Richtig triagieren: Die wichtigste Aufgabe ist, Probleme frühzeitig zu erkennen und einzuordnen. Mit der richtigen, verhältnismässigen Intervention werden unerwünschte Entwicklungen rechtzeitig gestoppt." },
          ],
          source: "PP Tag 2, Folien 49–51",
        },
        {
          ch: "Interventionen",
          title: "Das Interventionsschema",
          blocks: [
            { t: "cols", cols: [
              { h: "🟢 Leichter Verstoss", items: ["Informelles Gespräch (Feedback)", "Aktennotiz erstellen", "Konsequenzen aufzeigen", "Keine Besserung → mittlerer Verstoss"] },
              { h: "🟠 Mittlerer Verstoss", items: ["Formelles, angekündigtes Gespräch", "Schriftlich definierte Massnahmen", "Aktennotiz / Verwarnung", "Empfohlen: DBW und Eltern einbeziehen", "Eltern unterschreiben, gemeinsames Gespräch", "Keine Besserung → schwerer Verstoss"] },
              { h: "🔴 Schwerer Verstoss", items: ["Nach mehreren Schriftlichkeiten, ohne Besserungswillen oder bei schweren Verstössen wie Diebstahl", "Schriftliche Verwarnung und Androhung der Lehrvertragsauflösung", "Direkte Auflösung nur in sehr wenigen, schweren Fällen", "Zwingend: DBW und Eltern einbeziehen"] },
            ] },
          ],
          source: "PP Tag 2, Folie 52",
        },
        {
          ch: "Unterstützung",
          title: "Sie stehen nicht alleine da!",
          blocks: [
            { t: "note", text: "Viele Berufsbildner/innen denken, sie müssten Herausforderungen auf eigene Faust lösen – und reagieren oft viel zu spät. Im Zweifel lieber etwas zu früh Hilfe holen als zu spät!" },
            { t: "list", h: "Bei privaten Problemen (Sucht, Finanzen …)", items: [
              "Lernende direkt an die DBW oder die zuständige Beratungsstelle verweisen",
              "Nicht beginnen, die Probleme selbst zu lösen",
            ] },
            { t: "list", h: "Die DBW als Beratungs- und Unterstützungsstelle", items: [
              "Aufsicht über das Lehrverhältnis und rechtliche Beratung",
              "Einordnung des Problems und Hilfe beim weiteren Vorgehen",
              "Gesprächsführung im Lehrbetrieb mit allen Vertragsparteien",
              "Weiterleitung an die zuständige Fachstelle",
            ] },
          ],
          source: "PP Tag 2, Folien 53–57",
        },
        {
          ch: "Unterstützung",
          title: "Unterstützungsangebote",
          blocks: [
            { t: "table", head: ["Angebot", "Für wen / wofür"], rows: [
              ["Help Point an den BFS", "Niederschwellige erste Anlaufstelle für Probleme aller Art, auch schulisch – triagiert weiter"],
              ["Fachstelle Psychologische Beratung", "Abklärung, Beratung, Begleitung bei persönlichen, psychischen und sozialen Problemen und Krisen"],
              ["Fachstelle Berufsintegration", "Komplexe Gesamtsituation oder Mehrfachproblematik – koordiniert die Beteiligten"],
              ["Berufsberatung", "Erste Berufswahl oder Wunsch nach einem Berufswechsel"],
              ["SB – Schulische Begleitung", "EBA: Coaching im Unterricht – auch zur Vorbereitung des Übertritts in die EFZ-Lehre"],
              ["SB Plus", "EBA: zusätzliches Coaching ausserhalb des Unterrichts"],
              ["IB – Individuelle Begleitung", "EBA: erweiterte Hilfe in berufspraktischen, schulischen, sozialen oder persönlichen Bereichen"],
              ["Opferberatungsstelle", "Körperliche, psychische und sexuelle Gewalt – auch für Bezugspersonen"],
            ] },
          ],
          source: "PP Tag 2, Folien 59–60",
        },
        {
          ch: "Praxis",
          title: "Fallbeispiele: Maria & Sarah",
          blocks: [
            { t: "cols", cols: [
              { h: "💇 Fall 1 – Maria", items: ["Friseurin im Traumberuf, bisher sehr gute Arbeit", "Seit einigen Wochen fehlt der Enthusiasmus", "Mehr Fehler bei Haarschnitten, vergisst wichtige Schritte", "Kann sich schlecht konzentrieren – plaudert aber ausgiebig mit der Kundschaft"] },
              { h: "⏰ Fall 2 – Sarah & Herr Bauer", items: ["Sarah war engagiert, ist nun unmotiviert, kommt oft zu spät", "Herr Bauer will keinen Druck machen und lässt es durchgehen", "Mitarbeitende beschweren sich", "Er findet Sarah versteckt im Pausenraum – sie reagiert emotional und will den Lehrvertrag spontan auflösen"] },
            ] },
            { t: "list", h: "Was der Kurs daraus mitgibt", items: [
              "Veränderungen früh erkennen und ansprechen – nicht wegschauen",
              "Verhältnismässig nach Interventionsschema handeln",
              "Private Probleme nicht selbst lösen – weiterverweisen",
              "Ein Lehrvertrag lässt sich nicht spontan auflösen: Berufsbildungsamt früh einbeziehen",
            ] },
          ],
          source: "Mini-Fallbeispiele · Ablaufplan",
        },
        {
          ch: "Praxis · Mein Beruf",
          title: "BiVo Informatiker/in EFZ",
          blocks: [
            { t: "list", h: "Anforderungen an Berufsbildner/innen (Art. 10)", items: [
              "Informatiker/in EFZ mit mind. 2 Jahren Berufserfahrung, oder",
              "EFZ in verwandtem Beruf mit Informatikkenntnissen und mind. 5 Jahren, oder",
              "Einschlägiger Abschluss der höheren Berufsbildung, oder",
              "Einschlägiger Hochschulabschluss mit mind. 2 Jahren Berufserfahrung",
            ] },
            { t: "list", h: "Höchstzahl Lernende (Art. 11)", items: [
              "1 Lernende/r: 1 Berufsbildner/in zu 100 % oder 2 zu je mind. 60 %",
              "Jede weitere lernende Person: zusätzlich 1 Fachkraft zu 100 % oder 2 zu je mind. 60 %",
              "Zweite Person darf beginnen, wenn die erste im letzten Lehrjahr ist",
            ] },
            { t: "table", h: "Qualifikationsverfahren (Art. 18/19)", head: ["Bereich", "Gewicht"], rows: [
              ["IPA – 70 bis 90 Stunden (Ausführung 50 %, Doku 20 %, Präsentation/Fachgespräch 30 %)", "40 %"],
              ["Erfahrungsnote «Informatikkompetenzen» (80 % BFS-Module, 20 % üK)", "30 %"],
              ["Allgemeinbildung", "20 %"],
              ["Erfahrungsnote «erweiterte Grundkompetenzen»", "10 %"],
            ] },
            { t: "note", text: "Bestanden, wenn IPA ≥ 4, Erfahrungsnote Informatikkompetenzen ≥ 4 und Gesamtnote ≥ 4. Lerndokumentation: mind. 1x pro Semester kontrollieren und unterzeichnen – an der IPA als Hilfsmittel erlaubt. üK: 35 Tage in 7 Kursen." },
          ],
          source: "BiVo Informatiker/in EFZ (SR 412.101.220.10)",
        },
        {
          ch: "Praxis · Mein Beruf",
          title: "Bildungsplan Informatiker/in EFZ",
          blocks: [
            { t: "cols", h: "Zwei Fachrichtungen", cols: [
              { h: "🖧 Plattformentwicklung", items: ["Netze, Dienste und Serversysteme aufbauen, betreiben und überwachen"] },
              { h: "💻 Applikationsentwicklung", items: ["Software-Lösungen realisieren"] },
            ] },
            { t: "table", h: "8 Handlungskompetenzbereiche", head: ["", "Bereich", "Für"], rows: [
              ["a", "Begleiten von ICT-Projekten", "Alle"],
              ["b", "Unterstützen und Beraten im ICT-Umfeld", "Alle"],
              ["c", "Aufbauen und Pflegen von digitalen Daten", "Alle"],
              ["d", "Ausliefern und Betreiben von ICT-Lösungen", "Plattformentwicklung"],
              ["e", "Betreiben von Netzen", "Plattformentwicklung"],
              ["f", "Betreiben von Serversystemen und -diensten", "Plattformentwicklung"],
              ["g", "Entwickeln von Applikationen", "Applikationsentwicklung"],
              ["h", "Ausliefern und Betreiben von Applikationen", "Applikationsentwicklung"],
            ] },
            { t: "list", h: "Kompetenzmodell", items: [
              "Handlungskompetenzbereich → Handlungskompetenz → Leistungsziele je Lernort",
              "Taxonomie K1 Wissen · K2 Verstehen · K3 Anwenden · K4 Analyse · K5 Synthese · K6 Beurteilen",
              "Berufsfachschule: 24 Module + erweiterte Grundkompetenzen (Mathematik 120, Englisch 200 Lektionen)",
              "üK: 7 Kurse (4 Pflicht, 3 Wahl)",
            ] },
          ],
          source: "Bildungsplan Informatiker/in EFZ, Nr. 88611 (SBFI 2020)",
        },
      ],
    },
    { nr: 3, title: "Kurstag 3", placeholder: true, c1: "#1f9e7a", c2: "#0d2f2a", missions: [] },
    { nr: 4, title: "Kurstag 4", placeholder: true, c1: "#d6812f", c2: "#3d200c", missions: [] },
    { nr: 5, title: "Kurstag 5 · Take-away", placeholder: true, c1: "#d63f5a", c2: "#3d0d18", missions: [] },
  ],

  /* =====================================================================
     CHARAKTERE = AKTEURE  (look = Bauplan für die 3D-Figur, env = Umgebung)
     ===================================================================== */
  characters: [
    {
      id: "lernende", name: "Lernende/r", short: "Die Hauptfigur",
      color: "#5fd4ff", env: "lernorte",
      look: { skin: "#f1c27d", shirt: "#2f8fd8", pants: "#2b3550", hair: "#4a2e1a", hairStyle: "cap", cap: "#ff8a3d", extra: ["backpack"], scale: 0.92 },
      tagline: "Lernt an drei Lernorten – und wächst dabei in neue Rollen hinein.",
      role: "Absolviert die berufliche Grundbildung (EFZ oder EBA) an drei Lernorten und ist – mit der gesetzlichen Vertretung – Vertragspartei des Lehrvertrags.",
      aufgaben: [
        "Lernt im Lehrbetrieb, in der Berufsfachschule und im üK",
        "Meistert Entwicklungsaufgaben: Ablösung, Identität, Zukunftsperspektive, Freundeskreis",
        "Wächst in neue Rollen hinein: Gesellschaft, Arbeitsplatz, soziales Umfeld",
        "Bringt im Bildungsgespräch die eigene Sicht ein",
        "Hält sich an die Regeln des Berufs und des Betriebs",
      ],
      rechte: [
        "Ausbildung gemäss Bildungsplan – an allen drei Lernorten",
        "Lehrvertrag mit Entschädigung, Arbeitszeit, Ferien und Versicherungen",
        "Nachteilsausgleich – auch im Qualifikationsverfahren",
        "Stützkurse (z. B. Legasthenie, Dyskalkulie), Case Management, FiB für EBA",
        "Bezahlte Absenzen: üK-Tage, Ferien, Jugendurlaub, Militär/Zivildienst, anderer bezahlter Urlaub",
        "Schutz: begleitende Massnahmen bei gefährlichen Arbeiten, Schutz vor Belästigung",
        "Zugang zu Help Point, Lostly, psychologischer Beratung, SB / SB Plus / IB, Opferberatung",
        "Füllt im 1. Lehrjahr den QualiCarte-Fragebogen aus",
      ],
      pflichten: [
        "Führt die Lerndokumentation laufend (Lernberichte mind. 1x pro Monat)",
        "Unterschreibt den Bildungsbericht mit",
        "Besucht Berufsfachschule und überbetriebliche Kurse",
        "Meldet sich selbst für die BM an (BM 1 mit Einverständnis des Betriebs)",
      ],
      beziehungen: [
        { to: "betrieb", text: "Vertragspartner im Lehrvertrag – der Lehrbetrieb ist zugleich Arbeitgeber." },
        { to: "bb", text: "Wird begleitet, gefördert und beurteilt – Bildungsbericht jedes Semester." },
        { to: "bfs", text: "Lernt die Theorie – meist 1 Tag pro Woche." },
        { to: "uek", text: "Übt grundlegende Fertigkeiten, Transfer Theorie ↔ Praxis." },
        { to: "eltern", text: "Löst sich ab – die Eltern bleiben aber gesetzliche Vertretung." },
        { to: "dbw", text: "Beaufsichtigt das Lehrverhältnis und hilft bei Problemen." },
      ],
      sources: "PP Tag 1 & 2 · Ablaufplan · Planung",
    },
    {
      id: "betrieb", name: "Lehrbetrieb", short: "Der Arbeitgeber",
      color: "#ff5d73", env: "fabrik",
      look: { skin: "#e0ac69", shirt: "#26324f", pants: "#1c2236", hair: "#2b2b2b", hairStyle: "short", extra: ["tie", "briefcase"] },
      tagline: "Bietet die Lehrstelle – und ist Arbeitgeber der lernenden Person.",
      role: "1. Lernort und Arbeitgeber: schliesst den Lehrvertrag ab, braucht eine Bildungsbewilligung und vermittelt das berufliche Handwerk.",
      aufgaben: [
        "Berufliches Handwerk, Sozialisation und gesellschaftliche Werte vermitteln",
        "Rolle der Beteiligten definieren, Ressourcen einplanen, Aufgabe ins Stellenprofil aufnehmen",
        "Lehrstelle ausschreiben, Schnupperlehre durchführen, Lernende auswählen",
        "Lehrvertrag ausfüllen, unterschreiben und einreichen",
        "Daten im Portal Berufsbildung pflegen",
      ],
      rechte: [
        "Wählt die eigenen Lernenden aus (Bewerbung, Schnupperlehre, Selektion)",
        "Kann bei überdurchschnittlichem Ausbildungserfolg mehr Lernende ausbilden",
        "Kann bei schweren Verstössen die Lehrvertragsauflösung androhen – via DBW",
        "Erhält Beratung und Unterstützung durch Berufsbildungsamt, OdA und Fachstellen",
        "Profitiert von BM-Lernenden: leistungsfähig, anspruchsvollere Aufgaben",
      ],
      pflichten: [
        "Bildungsbewilligung beim Berufsbildungsamt beantragen",
        "Lehrvertrag schriftlich abschliessen – inkl. Entschädigung, Arbeitszeit, Ferien, Versicherungen",
        "Höchstzahl der Lernenden gemäss BiVo einhalten",
        "Begleitende Massnahmen bei gefährlichen Arbeiten einhalten",
        "Gesetze beachten: BBG, BBV, ArG, OR, BiVo/Bipla, DSG, ArGV 5, BehiG, GAV",
        "Qualität prüfen mit der QualiCarte (1x pro Jahr)",
        "Lehrzeugnis erstellen, Austritt oder Anstellung planen",
      ],
      beziehungen: [
        { to: "lernende", text: "Arbeitgeber und Vertragspartner im Lehrvertrag." },
        { to: "bb", text: "Setzt Berufsbildner/innen ein und gibt ihnen Zeit und Ressourcen." },
        { to: "dbw", text: "Bildungsbewilligung, Lehrvertragsgenehmigung, Portal Berufsbildung." },
        { to: "oda", text: "Nutzt Ausbildungsprogramm und branchenspezifische Unterlagen." },
        { to: "eltern", text: "Die gesetzliche Vertretung unterschreibt den Lehrvertrag mit." },
      ],
      sources: "Ablaufplan · PP Tag 1 & 2 · BiVo Informatiker/in",
    },
    {
      id: "bb", name: "Berufsbildner/in", short: "Coach & Fachperson",
      color: "#ffcc4d", env: "werkstatt",
      look: { skin: "#f1c27d", shirt: "#f2a516", pants: "#3a3f55", hair: "#8a5a2b", hairStyle: "bun", extra: ["glasses", "clipboard"] },
      tagline: "Befähigt statt nur zu machen – Coach, Fachperson und Vorbild in einem.",
      role: "Bildet im Lehrbetrieb aus (früher «Lehrmeister/in»). Coach, Fachperson, Berater/in, Begleiter/in und fachliches wie persönliches Vorbild.",
      aufgaben: [
        "Betrieblichen und individuellen Bildungsplan erstellen",
        "Voraussetzungen klären und Ziele festlegen",
        "Instruieren (Instruktionsmethode, 6-Schritte-Methode) und Rückmeldungen geben",
        "Ersten Arbeitstag und erste Woche planen und begleiten",
        "Prognostisch, summativ und formativ beurteilen",
        "Mit allen Anspruchsgruppen kommunizieren: Amt, Eltern, Mitarbeitende",
      ],
      rechte: [
        "Unterstützung durch DBW und Fachstellen – «Sie stehen nicht alleine da!»",
        "Bei Verstössen nach dem Interventionsschema handeln: Aktennotiz, Verwarnung",
        "Probleme an Beratungsstellen weiterverweisen statt sie selbst lösen zu müssen",
        "Kursausweis gilt lebenslang und in allen Kantonen",
      ],
      pflichten: [
        "Sich für den Lernerfolg einsetzen und ihn überprüfen (BBG Art. 20)",
        "Bildungsbericht am Ende jedes Semesters",
        "Lerndokumentation regelmässig prüfen und Feedback geben",
        "Über Arbeitssicherheit informieren und begleitende Massnahmen umsetzen",
        "Probezeitgespräch ca. 2 Wochen vor Ende der Probezeit",
        "Probleme früh erkennen, einordnen und verhältnismässig intervenieren",
        "Anforderungen der BiVo erfüllen (z. B. Informatik: EFZ + 2 Jahre Praxis)",
      ],
      beziehungen: [
        { to: "lernende", text: "Begleitet, fördert und beurteilt – denkt aus Sicht der Lernenden." },
        { to: "betrieb", text: "Handelt im Auftrag des Lehrbetriebs." },
        { to: "eltern", text: "Bezieht sie bei mittleren Verstössen ein (empfohlen), bei schweren zwingend." },
        { to: "dbw", text: "Holt früh Hilfe – vor allem vor einer Lehrvertragsauflösung." },
        { to: "bfs", text: "Lernortkooperation – das Zeugnis fliesst in den Bildungsbericht ein." },
        { to: "uek", text: "Lernortkooperation – üK-Leistungen zählen ebenfalls." },
      ],
      sources: "PP Tag 1 & 2 · Planung · BiVo Informatiker/in",
    },
    {
      id: "eltern", name: "Eltern", short: "Gesetzliche Vertretung",
      color: "#ff8fb1", env: "zuhause",
      look: { skin: "#f5d0a9", shirt: "#e0607e", pants: "#4b3a5a", hair: "#6b3f1f", hairStyle: "long", extra: ["partner"] },
      tagline: "Wichtige Bezugspersonen – auch wenn die Jugendlichen sich ablösen.",
      role: "Gesetzliche Vertretung der minderjährigen Lernenden – unterschreiben den Lehrvertrag mit und sind wichtige Bezugspersonen.",
      aufgaben: [
        "Begleiten die Ablösung der Jugendlichen vom Elternhaus",
        "Früherkennung: ungünstige Rahmenbedingungen wahrnehmen – «Hinschauen und handeln»",
        "Unterstützen beim Lehrstart und während der Ausbildung",
      ],
      rechte: [
        "Sind als gesetzliche Vertretung Vertragspartei des Lehrvertrags",
        "Werden schriftlich informiert, wenn der Ausbildungserfolg gefährdet ist",
        "Werden bei schweren Verstössen zwingend einbezogen",
      ],
      pflichten: [
        "Unterschreiben den Lehrvertrag mit",
        "Unterschreiben bei mittleren Verstössen die Aktennotiz bzw. Verwarnung",
        "Nehmen am gemeinsamen Gespräch mit dem Lehrbetrieb teil",
      ],
      beziehungen: [
        { to: "lernende", text: "Bezugspersonen – die Peers werden aber immer wichtiger." },
        { to: "bb", text: "Partner bei Problemen: gemeinsames Gespräch, Aktennotiz unterschreiben." },
        { to: "betrieb", text: "Vertragspartei im Lehrvertrag." },
        { to: "dbw", text: "Bei schweren Verstössen sitzen DBW und Eltern mit am Tisch." },
      ],
      sources: "PP Tag 1 & 2 · BiVo Informatiker/in",
    },
    {
      id: "dbw", name: "DBW", short: "Dienststelle Berufs- und Weiterbildung",
      color: "#9b8cff", env: "amt",
      look: { skin: "#c68642", shirt: "#6c5ce7", pants: "#2d2a4a", hair: "#1e1e1e", hairStyle: "short", extra: ["stamp", "badge"] },
      tagline: "Die Lehraufsicht des Kantons – vom Lehrvertrag bis zum QV.",
      role: "Kantonale Dienststelle Berufs- und Weiterbildung Luzern, Abteilung Betriebliche Bildung. Setzt die Grundbildung im Kanton um.",
      aufgaben: [
        "Lehraufsicht und Qualitätssicherung",
        "Lehrverhältnisse genehmigen, anpassen und auflösen",
        "Bildungsbewilligungen erteilen und entziehen",
        "Rechtliche Beratung, Gespräche mit allen Vertragsparteien, Weiterleitung an Fachstellen",
        "Lehrvertragsmanagement und Portal Berufsbildung",
        "Angebote wie Lostly und Help Point",
      ],
      rechte: [
        "Genehmigt jeden Lehrvertrag – ohne DBW kein Lehrverhältnis",
        "Kann Bildungsbewilligungen entziehen",
        "Kann bei überdurchschnittlichem Erfolg mehr Lernende pro Betrieb bewilligen",
        "Schliesst Leistungsverträge mit üK-, KBB- und KQV-Organisationen",
      ],
      pflichten: [
        "Beaufsichtigt das Lehrverhältnis von der Unterzeichnung bis zum QV",
        "Wird bei Gefährdung des Ausbildungserfolgs informiert und handelt",
        "Bearbeitet Gesuche um Nachteilsausgleich und QV-Anmeldungen bei Nichtbestehen",
      ],
      beziehungen: [
        { to: "betrieb", text: "Bewilligt, genehmigt und beaufsichtigt." },
        { to: "bb", text: "Berät und unterstützt – möchte früh einbezogen werden." },
        { to: "lernende", text: "Ansprechstelle bei Problemen, Nachteilsausgleich, QV." },
        { to: "eltern", text: "Gemeinsam am Tisch bei schweren Verstössen." },
        { to: "uek", text: "Leistungsverträge mit den üK-Zentren (50 in Luzern)." },
        { to: "sbfi", text: "Setzt die Vorgaben des Bundes im Kanton um." },
      ],
      sources: "PP Tag 2 · Ablaufplan · BiVo Informatiker/in",
    },
    {
      id: "bfs", name: "Berufsfachschule", short: "2. Lernort",
      color: "#5be3a0", env: "schule",
      look: { skin: "#f1c27d", shirt: "#2fb67a", pants: "#24413a", hair: "#c9a26b", hairStyle: "long", extra: ["book"] },
      tagline: "Theorie, Allgemeinbildung und Sport – meist ein Tag pro Woche.",
      role: "Vermittelt die schulische Bildung: Berufskenntnisse und Allgemeinbildung (ABU nach Rahmenlehrplan).",
      aufgaben: [
        "Berufskunde und Allgemeinbildung vermitteln",
        "Stütz- und Freikurse anbieten",
        "Help Point als niederschwellige erste Anlaufstelle",
        "Erstellt den schulischen Lehrplan",
      ],
      pflichten: [
        "Unterricht nach Lehrplan und Rahmenlehrplan",
        "Zeugnisse bzw. Modulnoten – z. B. 80 % der Erfahrungsnote Informatik",
      ],
      beziehungen: [
        { to: "lernende", text: "Unterrichtet und unterstützt – auch mit dem Help Point." },
        { to: "bb", text: "Lernortkooperation – Zeugnis fliesst in den Bildungsbericht." },
        { to: "oda", text: "Der Lehrplan wird von der OdA mit den Berufsfachschulen erarbeitet." },
        { to: "uek", text: "Gemeinsam den Transfer zur Praxis ermöglichen." },
      ],
      sources: "PP Tag 1 & 2 · BiVo Informatiker/in",
    },
    {
      id: "uek", name: "üK", short: "Überbetriebliche Kurse",
      color: "#ff9a4d", env: "kurszentrum",
      look: { skin: "#e0ac69", shirt: "#ff8a1f", pants: "#33404f", hair: "#3b2a1a", hairStyle: "helmet", extra: ["wrench"] },
      tagline: "Die Brücke zwischen Schule und Betrieb.",
      role: "3. Lernort: vermittelt grundlegende Fertigkeiten und ergänzt Praxis und Schule.",
      aufgaben: [
        "Grundlegende Fertigkeiten vermitteln",
        "Transfer zwischen Theorie und Praxis",
        "Detailplanung der Kurse durch die Kursleitenden",
        "Beispiel Informatik: 35 Tage in 7 Kursen (je ein Modul)",
      ],
      pflichten: [
        "Kurse nach dem Ausbildungsprogramm für die üK durchführen",
        "Leistungen bewerten – z. B. 20 % der Erfahrungsnote Informatik",
      ],
      beziehungen: [
        { to: "oda", text: "Die OdA ist für die Durchführung verantwortlich." },
        { to: "dbw", text: "Leistungsvertrag mit der DBW." },
        { to: "lernende", text: "üK-Tage sind Arbeitszeit – die Noten zählen fürs QV." },
        { to: "bfs", text: "Ergänzt den Unterricht der Berufsfachschule." },
      ],
      sources: "PP Tag 1 & 2 · BiVo Informatiker/in",
    },
    {
      id: "oda", name: "OdA", short: "Organisation der Arbeitswelt",
      color: "#ff6b6b", env: "branche",
      look: { skin: "#f1c27d", shirt: "#d94848", pants: "#3a2a2a", hair: "#2b2b2b", hairStyle: "short", extra: ["flag"] },
      tagline: "Die Branche bestimmt mit, was gelernt wird.",
      role: "Berufsverbände wie Holzbau Schweiz, IGKG, Kaufmännischer Verband, Suissetec oder ICT-Berufsbildung Schweiz.",
      aufgaben: [
        "Stellen die Bildungsinhalte und Ausbildungsplätze bereit",
        "Erarbeiten die BiVo zusammen mit den Kantonen",
        "Erarbeiten den Bildungsplan und das Ausbildungsprogramm",
        "Erarbeiten den Lehrplan für die Berufsfachschulen mit",
        "Führen die überbetrieblichen Kurse durch",
        "Bieten branchenspezifische Unterlagen und Unterstützung",
      ],
      beziehungen: [
        { to: "sbfi", text: "Der Bund erlässt die BiVo und genehmigt den Bildungsplan." },
        { to: "uek", text: "Verantwortlich für die Durchführung." },
        { to: "betrieb", text: "Liefert Ausbildungsprogramm und Unterlagen." },
        { to: "bfs", text: "Erarbeitet den Lehrplan gemeinsam." },
      ],
      sources: "PP Tag 1 & 2 · Planung · Ablaufplan",
    },
    {
      id: "sbfi", name: "Bund / SBFI", short: "Staatssekretariat für Bildung, Forschung und Innovation",
      color: "#e6e9f5", env: "bundeshaus",
      look: { skin: "#f5d0a9", shirt: "#5a6275", pants: "#2c3040", hair: "#b8b8b8", hairStyle: "short", extra: ["swiss", "scroll"] },
      tagline: "Setzt den Rahmen – von der Bundesverfassung bis zur BiVo.",
      role: "Macht die organisatorischen und inhaltlichen Vorgaben. Grundlage: Bundesverfassung Art. 63, BBG und BBV.",
      aufgaben: [
        "Erlass von Gesetzen, Verordnungen und Reglementen",
        "Strategische Steuerung und Entwicklung der Berufsbildung",
        "Erlässt die Bildungsverordnungen (BiVo) der Berufe",
        "Genehmigt die Bildungspläne",
        "Führt die Anhörung bei der 5-Jahres-Überprüfung der BiVo",
      ],
      beziehungen: [
        { to: "oda", text: "Arbeitet mit den OdA zusammen – BiVo-Überprüfung alle 5 Jahre." },
        { to: "dbw", text: "Die Kantone setzen die Vorgaben um und üben die Aufsicht aus." },
      ],
      sources: "PP Tag 1 & 2 · Planung",
    },
  ],

  /* =====================================================================
     LEHRZEIT-REISE (Ablaufplan der Lehrzeit, Stand Januar 2026)
     ===================================================================== */
  journey: [
    {
      icon: "🎓", title: "Voraussetzungen", when: "vor allem anderen",
      items: [
        "Kurs für Berufsbildner/innen (40 h) besuchen – der Ausweis gilt lebenslang und in allen Kantonen",
        "Bildungsbewilligung beim Berufsbildungsamt des Lehrortskantons beantragen",
        "Rolle der Beteiligten klar definieren – Berufsbildung ist eine Aufgabe mit Verantwortung",
        "Ressourcen einplanen und die Aufgabe ins Stellenprofil aufnehmen",
        "Anforderungsprofil erstellen (Checkliste Anforderungsprofil)",
      ],
    },
    {
      icon: "🔎", title: "Rekrutierung", when: "6–12 Monate vor Lehrstart",
      items: [
        "Lehrstelle ausschreiben – frühestens im August vor Lehrstart, keine Genehmigung vor September (Chancengleichheit)",
        "Bewerbungen prüfen, Vorselektion und Gespräche (Checklisten Vorselektion, Vorstellungsgespräch)",
        "Schnupperlehre planen – Einblick in den Beruf und gegenseitiges Kennenlernen",
        "Lernende auswählen (Selektionsmappe), Nachteilsausgleich und BM 1 klären",
        "Lehrvertrag frühestens 12 Monate vor Lehrstart unterschreiben und einreichen",
      ],
    },
    {
      icon: "📋", title: "Lehre planen", when: "bis 2 Wochen vor Start",
      items: [
        "6–12 Monate vorher: betriebliche und individuelle Planung – Bildungsplan (SBFI) als verbindliche Grundlage",
        "Ca. 3 Monate vorher: Arbeitskleidung, Lehrmittel, üK-Termine, gebuchte Ferien, Lohnkonto, Versicherung",
        "2–4 Wochen vorher: Willkommensmail an die lernende Person",
        "2–4 Wochen vorher: Arbeitsplatz vorbereiten, Arbeiten für die erste Woche definieren",
      ],
    },
    {
      icon: "🚀", title: "Lehrstart", when: "August",
      items: [
        "Ersten Arbeitstag begleiten: Vorstellungsrunde, Einführung, erste Aufgaben",
        "Erste Woche begleiten: Lerndokumentation erklären, Regeln zeigen, Termine besprechen",
        "Probezeitgespräch ca. 2 Wochen vor Ende der Probezeit",
        "Bedarf an Stütz- und Freikursen im ersten Semester abklären",
      ],
    },
    {
      icon: "📈", title: "Ausbilden & Qualität", when: "die ganze Lehrzeit",
      items: [
        "Semesterplanung zu Beginn jedes Semesters – Ziele für Betrieb, üK und BFS",
        "Bildungsbericht am Ende jedes Semesters ausfüllen und besprechen",
        "Lerndokumentation ca. 1x pro Monat prüfen und Feedback geben",
        "QualiCarte 1x pro Jahr · Fragebogen der lernenden Person am Ende des 1. Lehrjahres",
        "Führen und motivieren: Feedback, Zielvereinbarungen, Praxisaufträge, Gleichstellung",
        "Herausforderungen: Mobbing, Rassismus, Sucht, Depression, Belästigung, Gewalt, Prüfungsangst",
      ],
    },
    {
      icon: "🏁", title: "Qualifikations­verfahren", when: "letztes Lehrjahr",
      items: [
        "Nachteilsausgleich spätestens im September vor dem QV beantragen",
        "Ca. 10 Monate vorher zum QV anmelden (nicht in jedem Kanton nötig)",
        "QV-Vorbereitung unterstützen: Zeit und Material bereitstellen",
        "IPA / VPA im letzten Semester begleiten",
        "Nicht bestanden? Berufsbildungsamt kontaktieren, ungenügende Positionen wiederholen",
      ],
    },
    {
      icon: "🎉", title: "Abschluss", when: "1–6 Monate vorher",
      items: [
        "Ca. 6 Monate vorher: Austritt oder Anstellung planen",
        "Ca. 1 Monat vorher: Lehrzeugnis erstellen und Abschlussgespräch führen",
        "Den erfolgreichen Abschluss feiern!",
      ],
    },
  ].map((j) => ({ ...j, source: "Ablaufplan der Lehrzeit (Stand Januar 2026)" })),

  /* =====================================================================
     LEXIKON
     ===================================================================== */
  lexikon: [
    ["ABU", "Allgemeinbildender Unterricht an der Berufsfachschule – Grundlage ist der Rahmenlehrplan."],
    ["ArG", "Arbeitsgesetz – regelt u. a. Arbeits- und Ruhezeiten sowie den Gesundheitsschutz."],
    ["ArGV 5", "Jugendarbeitsschutzverordnung – Art. 4 regelt gefährliche Arbeiten für Jugendliche."],
    ["BB", "Berufsbildner/in – bildet die Lernenden im Lehrbetrieb aus."],
    ["BBG", "Berufsbildungsgesetz – gestützt auf Bundesverfassung Art. 63."],
    ["BBV", "Berufsbildungsverordnung – konkretisiert das BBG."],
    ["BehiG", "Behindertengleichstellungsgesetz."],
    ["BFS", "Berufsfachschule – 2. Lernort, vermittelt die schulische Bildung."],
    ["Bildungsbericht", "Hält den Bildungsstand fest – am Ende jedes Semesters, alle unterschreiben."],
    ["Bildungsbewilligung", "Erlaubnis zum Ausbilden – beim Berufsbildungsamt des Lehrortskantons zu beantragen."],
    ["BiPla / Bipla", "Bildungsplan – Handlungskompetenzen und Leistungsziele pro Lernort, von der OdA erarbeitet und vom Bund genehmigt."],
    ["BiVo", "Bildungsverordnung – gesetzlicher Rahmen pro Beruf, vom Bund erlassen."],
    ["BIZ", "Berufsinformationszentrum – u. a. Kurzberatung zu Grundkompetenzen."],
    ["BM 1 / BM 2", "Berufsmaturität während bzw. nach der beruflichen Grundbildung."],
    ["BP", "Eidg. Berufsprüfung – höhere Berufsbildung, Abschluss mit eidg. Fachausweis."],
    ["BV", "Bundesverfassung – Art. 63 (Berufsbildung), 122 (Zivilrecht), 110/118 (Arbeitsschutz)."],
    ["DBW", "Dienststelle Berufs- und Weiterbildung des Kantons Luzern – Lehraufsicht, Beratung, Lehrvertragsmanagement."],
    ["DSG", "Datenschutzgesetz."],
    ["EBA", "Eidgenössisches Berufsattest – 2-jährige Grundbildung."],
    ["EFZ", "Eidgenössisches Fähigkeitszeugnis – 3- bis 4-jährige Grundbildung."],
    ["FH", "Fachhochschule."],
    ["FiB", "Fachkundige individuelle Begleitung für EBA-Lernende."],
    ["GAV", "Gesamtarbeitsvertrag."],
    ["Handlungskompetenz", "Fach-, Methoden-, Sozial- und Selbstkompetenz zum Bewältigen beruflicher Handlungssituationen."],
    ["HF", "Höhere Fachschule – Diplom HF."],
    ["HFP", "Eidg. höhere Fachprüfung – eidg. Diplom."],
    ["IB", "Individuelle Begleitung – erweiterte Unterstützung für EBA-Lernende."],
    ["IPA", "Individuelle praktische Arbeit – Teil des Qualifikationsverfahrens."],
    ["Lehraufsicht", "Gesetzlicher Auftrag des Kantons – von der Lehrvertragsunterzeichnung bis zum QV."],
    ["Lerndokumentation", "Von den Lernenden geführt – Lernberichte mind. 1x pro Monat."],
    ["LOK", "Lernortkooperation – Zusammenarbeit von Betrieb, Berufsfachschule und üK."],
    ["Lostly", "Unterstützungsangebot der DBW für Lernende im Kanton Luzern."],
    ["Nachteilsausgleich", "Ausgleich für Lernende mit Beeinträchtigung – auch im QV, rechtzeitig beantragen."],
    ["OdA", "Organisation der Arbeitswelt – Berufsverbände, verantwortlich für Inhalte und üK."],
    ["OR", "Obligationenrecht – regelt den Lehrvertrag als Einzelarbeitsvertrag."],
    ["PEX", "Prüfungsexpert/in im Qualifikationsverfahren."],
    ["QualiCarte", "Instrument zur Qualitätsprüfung im Lehrbetrieb – 1x pro Jahr."],
    ["QV", "Qualifikationsverfahren – Abschluss der beruflichen Grundbildung."],
    ["SB / SB Plus", "Schulische Begleitung für EBA-Lernende – im bzw. ausserhalb des Unterrichts."],
    ["SBFI", "Staatssekretariat für Bildung, Forschung und Innovation – Vorgaben des Bundes."],
    ["SDBB", "Schweizerisches Dienstleistungszentrum Berufsbildung – Formulare wie Bildungsbericht."],
    ["üK", "Überbetriebliche Kurse – 3. Lernort, grundlegende Fertigkeiten."],
    ["UVG", "Unfallversicherungsgesetz."],
    ["VPA", "Vorgegebene praktische Arbeit – Teil des Qualifikationsverfahrens."],
  ],

  /* =====================================================================
     ARENA – BOSSKAMPF
     ===================================================================== */
  boss: { name: "Der QV-Drache" },
  quiz: [
    { q: "Wie viele Stunden umfasst der Kurs für Berufsbildner/innen?", a: ["20 h", "40 h", "60 h", "100 h"], correct: 1, why: "40 Stunden – der Ausweis gilt lebenslang und in allen Kantonen." },
    { q: "Was unterscheidet die Berufsbildnerin / den Berufsbildner von der Fachperson?", a: ["Fokus auf Resultate", "Korrigiert Fehler", "Nutzt Fehler als Lernchance", "Denkt aus Sicht der Fachkraft"], correct: 2, why: "BB befähigen und denken aus Sicht der Lernenden." },
    { q: "Wer macht die Vorgaben in Form von BiVo und Bildungsplan?", a: ["Die kantonale Dienststelle", "Der Bund / das SBFI", "Die Berufsfachschule", "Die Prüfungsexperten"], correct: 1, why: "Der Bund erlässt die BiVo und genehmigt den Bildungsplan." },
    { q: "Wer ist für die Durchführung der überbetrieblichen Kurse verantwortlich?", a: ["SBFI", "Berufsfachschule", "Organisationen der Arbeitswelt (OdA)", "Lehrbetrieb"], correct: 2, why: "Die OdA führen die üK durch." },
    { q: "Welche drei Besonderheiten hat der Lehrvertrag?", a: ["Unbefristet, mündlich, genehmigungsfrei", "Befristet, schriftlich, genehmigungspflichtig", "Befristet, mündlich, nur Eltern unterschreiben", "Unbefristet, schriftlich, genehmigungsfrei"], correct: 1, why: "Befristet, zwingend schriftlich und von der DBW zu genehmigen." },
    { q: "Auf welchen Artikel der Bundesverfassung stützt sich das Berufsbildungsgesetz?", a: ["Art. 8", "Art. 63", "Art. 122", "Art. 118"], correct: 1, why: "BV Art. 63 – Befugnis, Vorschriften über die Berufsbildung zu erlassen." },
    { q: "Ab wann sind gefährliche Arbeiten grundsätzlich erlaubt?", a: ["Ab 15 ohne Bedingungen", "Ab 16", "Ab 18 – ab 15 nur mit begleitenden Massnahmen", "Nie für Lernende"], correct: 2, why: "ArGV 5 Art. 4 – Ausnahme ab 15, wenn die BiVo das vorsieht." },
    { q: "Wie oft wird der Bildungsbericht erstellt?", a: ["Monatlich", "Am Ende jedes Semesters", "Einmal pro Lehrjahr", "Nur vor dem QV"], correct: 1, why: "Am Ende jedes Semesters – alle unterschreiben." },
    { q: "Wie oft schreiben Lernende mindestens einen Lernbericht?", a: ["Wöchentlich", "Monatlich", "Pro Semester", "Pro Lehrjahr"], correct: 1, why: "Lernberichte sind der Kern der Lerndokumentation – mind. 1x pro Monat." },
    { q: "Wann findet das Probezeitgespräch statt?", a: ["Am ersten Arbeitstag", "Ca. 2 Wochen vor Ende der Probezeit", "Nach dem ersten Lehrjahr", "Gar nicht"], correct: 1, why: "So bleibt noch Zeit zum Reagieren." },
    { q: "Warum werden Lehrstellen frühestens im August vor Lehrstart ausgeschrieben?", a: ["Wegen der Ferien", "Wegen der Chancengleichheit", "Weil die BiVo dann ändert", "Weil das Portal sonst geschlossen ist"], correct: 1, why: "Verbundpartner-Commitment: gleiche Chancen für alle." },
    { q: "Was gehört zu einem mittleren Verstoss?", a: ["Nur ein informelles Feedback", "Formelles Gespräch, schriftliche Massnahmen, Verwarnung", "Direkte Lehrvertragsauflösung", "Nichts unternehmen"], correct: 1, why: "Einbezug von DBW und Eltern wird empfohlen." },
    { q: "Bei welchem Verstoss MÜSSEN DBW und Eltern einbezogen werden?", a: ["Leichter Verstoss", "Mittlerer Verstoss", "Schwerer Verstoss", "Nie"], correct: 2, why: "Beim schweren Verstoss ist der Einbezug zwingend." },
    { q: "Sarah kommt oft zu spät, Herr Bauer lässt es durchgehen. Was empfiehlt der Kurs?", a: ["Abwarten, das löst sich", "Früh erkennen, verhältnismässig intervenieren, DBW beiziehen", "Alles privat alleine lösen", "Lehrvertrag sofort auflösen"], correct: 1, why: "Wegschauen macht es schlimmer – früh und verhältnismässig handeln." },
    { q: "Maria hat vermutlich private Probleme. Was ist richtig?", a: ["Selbst therapieren", "An DBW oder Beratungsstelle verweisen", "Ignorieren, die Kunden mögen sie", "Den Eltern die Schuld geben"], correct: 1, why: "Private Probleme nicht selbst lösen – «Sie stehen nicht alleine da!»" },
    { q: "Woraus besteht eine Handlungskompetenz?", a: ["Lesen, Schreiben, Rechnen, IKT", "Fach-, Methoden-, Sozial- und Selbstkompetenz", "Kenntnisse, Normen, Noten", "Theorie und Praxis"], correct: 1, why: "Die vier Kompetenzdimensionen des Bildungsplans." },
    { q: "Welche Methode fördert selbstorganisiertes Lernen am stärksten?", a: ["Instruktionsmethode", "6-Schritte-Methode", "Vormachen und Nachmachen", "Frontalunterricht"], correct: 1, why: "Informieren → Planen → Entscheiden → Realisieren → Kontrollieren → Auswerten." },
    { q: "Welche Beurteilung findet laufend – fast täglich – statt?", a: ["Prognostisch", "Summativ", "Formativ", "Gar keine"], correct: 2, why: "Formative Beurteilung sichert die Qualität im Lernprozess." },
    { q: "Was ist bei sexueller Belästigung massgebend?", a: ["Die Absicht der handelnden Person", "Das Empfinden der belästigten Person", "Ob es Zeugen gibt", "Die Hierarchiestufe"], correct: 1, why: "Entscheidend ist, wie es die betroffene Person empfindet." },
    { q: "Welcher Führungsstil passt laut Generationenvergleich zur Generation Z?", a: ["Kontrollieren", "Anweisen", "Befähigen", "Koordinieren"], correct: 2, why: "Generation Z: befähigen – Alpha: inspirieren." },
    { q: "Wer genehmigt in Luzern den Lehrvertrag?", a: ["Die Berufsfachschule", "Die OdA", "Die DBW", "Das SBFI"], correct: 2, why: "Die Dienststelle Berufs- und Weiterbildung – die Lehraufsicht des Kantons." },
    { q: "Wann ist das QV Informatiker/in EFZ bestanden?", a: ["Gesamtnote ≥ 4 reicht", "IPA ≥ 4, Erfahrungsnote Informatik ≥ 4 und Gesamtnote ≥ 4", "Allgemeinbildung ≥ 4", "IPA ≥ 5"], correct: 1, why: "BiVo Informatiker/in Art. 19 – drei Bedingungen." },
  ],

  /* =====================================================================
     ARENA – INTERVENTIONS-DUELL  (Übungsfälle nach dem Interventionsschema)
     level: 0 = leicht, 1 = mittel, 2 = schwer, 3 = weiterverweisen
     ===================================================================== */
  duell: [
    { s: "Lea kommt zum ersten Mal 15 Minuten zu spät und entschuldigt sich.", level: 0, why: "Leichter Verstoss: informelles Gespräch, Feedback, Konsequenzen aufzeigen." },
    { s: "Tim kommt trotz Gespräch und Aktennotiz weiterhin regelmässig zu spät.", level: 1, why: "Keine Besserung → mittlerer Verstoss: formelles Gespräch, schriftliche Massnahmen, DBW und Eltern empfohlen." },
    { s: "Ein Lernender hat im Betrieb nachweislich Material gestohlen.", level: 2, why: "Schwerer Verstoss wie Diebstahl: schriftliche Verwarnung, Androhung der Auflösung – DBW und Eltern zwingend." },
    { s: "Nina erzählt, dass sie zu Hause grosse finanzielle Probleme hat.", level: 3, why: "Private Probleme nicht selbst lösen – an die DBW oder eine Beratungsstelle verweisen." },
    { s: "Ein Lernender vergisst zum ersten Mal seine Lerndokumentation nachzuführen.", level: 0, why: "Leichter Verstoss: Feedback geben und die Erwartungen klarmachen." },
    { s: "Nach einer Verwarnung mit Eltern-Unterschrift verletzt ein Lernender die Regeln erneut massiv.", level: 2, why: "Mehrere Schriftlichkeiten ohne Besserung → schwerer Verstoss." },
    { s: "Du vermutest bei einer Lernenden ein Suchtproblem.", level: 3, why: "Hinschauen und handeln – aber an Fachstellen verweisen, nicht selbst therapieren." },
    { s: "Ein Lernender hält sich wiederholt nicht an die vereinbarten Handy-Regeln, trotz Feedbackgespräch.", level: 1, why: "Wiederholt trotz Gespräch → mittlerer Verstoss mit schriftlich definierten Massnahmen." },
    { s: "Eine Lernende wirkt seit Wochen bedrückt und erwähnt psychische Krisen.", level: 3, why: "Weiterverweisen: Fachstelle Psychologische Beratung, Help Point oder DBW." },
    { s: "Ein Lernender antwortet bei einer Instruktion einmal patzig.", level: 0, why: "Leichter Verstoss: das Gespräch suchen und Feedback geben." },
  ],
  duellLevels: [
    { icon: "🟢", lbl: "Leichter Verstoss" },
    { icon: "🟠", lbl: "Mittlerer Verstoss" },
    { icon: "🔴", lbl: "Schwerer Verstoss" },
    { icon: "🤝", lbl: "Weiterverweisen" },
  ],

  credits: [
    "Take-away im Berufsbildnerkurs – WBZ Kanton Luzern.",
    "Inhalte: Kursunterlagen Tag 1 und Tag 2 – PP-Präsentationen, Ablaufplan der Lehrzeit, Planung und Umsetzung der betrieblichen Bildung, Glossar, BiVo und Bildungsplan Informatiker/in EFZ, Mini-Fallbeispiele.",
    "3D-Grafik mit Three.js (WebGL) · HTML, CSS und JavaScript · läuft ohne Internet.",
  ],
};
