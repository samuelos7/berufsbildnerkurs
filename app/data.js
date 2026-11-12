/* Spielinhalte – abgeleitet aus dem Kursmaterial (material/Tag 1, Tag 2, Tag 3).
   Neue Kurstage: im Array "levels" das Level ausfüllen und "placeholder" entfernen.

   Block-Typen für Missionen:
   list   { t:"list",  h, items:[...] }
   steps  { t:"steps", h, items:[...] }               nummerierter Ablauf
   table  { t:"table", h, head:[...], rows:[[...]] }
   cols   { t:"cols",  h, cols:[{h, items:[...]}] }    Karten nebeneinander
   stats  { t:"stats", h, items:[{v, l}] }             grosse Zahlen
   pyramid{ t:"pyramid", h, items:[{h, d}] }           oben → unten
   note   { t:"note",  text }                          Merksatz

   Inhalte bleiben generisch (gelten für alle Berufe). Das Beispiel «Informatiker/in EFZ»
   steht separat: Rolle "informatik", Listen "informatik" pro Rolle und das Modul "beruf".
   Running Gags aus dem Kurs: die Mini-Rolle "pferd" (Pferdefachmann/-frau) und die Giraffe
   auf der Insel im Hauptmenü (scene3d.js) – bewusst klein gehalten. */
window.GAME_DATA = {
  title: "Berufsbildner",
  subtitle: "Das Spiel der Lehrzeit",
  tagline: "Ein Kurs, fünf Level, zehn Rollen, ein Pferdefachmann und eine Giraffe – wer macht was in der beruflichen Grundbildung?",
  meta: "Berufsbildnerkurs · WBZ Kanton Luzern · Take-away",
  example: { name: "Informatiker/in EFZ", short: "Beispielberuf" },

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
    {
      nr: 3,
      title: "Rekrutieren & Planen",
      subtitle: "Lehrstellenmarketing · Schnupperlehre · Potenzial erkennen · Bewerbungsgespräch · Beurteilungsfehler · BiVo & BiPla · Ausbildungsplanung",
      c1: "#1f9e7a", c2: "#0d2f2a",
      missions: [
        {
          ch: "Einstieg",
          title: "Tagesziele: Rekrutieren & Planen",
          blocks: [
            { t: "list", h: "Was wollen wir heute erreichen?", items: [
              "Neue Lernende treffsicher und passend zum Betrieb rekrutieren",
              "Handlungswissen zur inhaltlichen und organisatorischen Vorbereitung von Arbeits- und Lernumgebungen vertiefen",
              "Zielführende Ausbildungspläne für die Lernenden im eigenen Betrieb erstellen",
            ] },
            { t: "cols", h: "Drei Blöcke", cols: [
              { h: "🔎 Block 1", items: ["Lernende treffsicher rekrutieren", "Marketing, Schnupperlehre, Bewerbungsgespräch, Beurteilungsfehler"] },
              { h: "📋 Block 2", items: ["Arbeits- und Lernumgebungen vorbereiten", "Ziele erkennen, Ausbildungsplan erstellen und umsetzen"] },
              { h: "🚦 Block 3", items: ["Abschluss", "Persönliche Reflexion und Ampelabfrage"] },
            ] },
          ],
          source: "PP Tag 3, Folien 2–3",
        },
        {
          ch: "Block 1 · Rekrutieren",
          title: "Berufsvorstellung",
          blocks: [
            { t: "list", h: "Leitfragen – Einzelarbeit, dann kurz im Plenum", items: [
              "Welchen Beruf bilde ich aus?",
              "Dauer, Berufsschule, üK und deren Dauer",
              "Wichtigste Tätigkeiten",
              "Rekrutierung",
              "Wieso sollte ich genau diesen Beruf auswählen?",
            ] },
            { t: "table", h: "Zwei Berufe aus der Runde", head: ["", "💻 Informatiker/in EFZ", "🐴 Pferdefachmann/-frau EFZ"], rows: [
              ["Dauer", "4 Jahre (8 Semester)", "3 Jahre"],
              ["Berufsfachschule", "24 Module + erweiterte Grundkompetenzen", "1 Tag pro Woche"],
              ["üK", "35 Tage in 7 Kursen", "15 Tage"],
              ["Ausrichtung", "Plattform- oder Applikationsentwicklung", "Von Pferdepflege über Reiten bis Gespannfahren"],
              ["Tätigkeiten", "ICT-Lösungen planen, bauen und betreiben", "Pferde pflegen, füttern, bewegen und ausbilden"],
            ] },
            { t: "note", text: "So verschieden die Berufe sind – der Rahmen ist derselbe: BiVo, Bildungsplan, drei Lernorte und ein Lehrvertrag. Darum bleibt dieses Spiel generisch." },
          ],
          source: "PP Tag 3, Folie 4 · BiVo Informatiker/in EFZ · Eckdaten Pferdefachmann/-frau EFZ: berufsberatung.ch",
        },
        {
          ch: "Block 1 · Rekrutieren",
          title: "Lehrstellenmarketing",
          blocks: [
            { t: "list", h: "Aktiv werden und sich von anderen Firmen abheben", items: [
              "Attraktive Schnupperlehren bieten",
              "Auf Schülerinnen und Schüler zugehen: Schulklassen einladen, an der ZEBI teilnehmen, Zukunftstag und Schnupperlehren anbieten",
              "Die bevorzugten Medien der Jugendlichen nutzen: Instagram, TikTok & Co.",
              "Videobotschaften anstelle von Inseraten",
            ] },
            { t: "list", h: "Job-Plattformen für Lehrstellen", items: ["Yousty", "Gateway One", "Jobeagle"] },
          ],
          source: "PP Tag 3, Folien 5 & 10",
        },
        {
          ch: "Block 1 · Rekrutieren",
          title: "Warum Social Media?",
          blocks: [
            { t: "stats", items: [{ v: "99 %", l: "der Jugendlichen besitzen ein Smartphone" }, { v: "bis 4 h", l: "verbringen sie durchschnittlich auf Social Media" }, { v: "100 %", l: "messbar – schnelle Reaktion möglich" }] },
            { t: "list", h: "Vorteile fürs Lehrstellenmarketing", items: [
              "Bewusstsein: Die Bekanntheit des Unternehmens steigt",
              "Reichweite: Jugendliche mitten in der Berufswahl erreichen",
              "Datenbasierte Kommunikation: Algorithmen kennen die Vorlieben und spielen Inhalte gezielt aus",
              "Bindung: Auf Augenhöhe kommunizieren und Vertrauen schaffen",
              "Optimierung: Alles ist messbar – rasch reagieren und anpassen",
            ] },
            { t: "table", h: "Welcher Content bringt die besten Resultate? (Umfrage Yousty)", head: ["Content", "1. Platz", "2. Platz", "Total"], rows: [
              ["Video", "40 %", "23 %", "63 %"],
              ["Fotos / Grafiken", "27 %", "29 %", "56 %"],
              ["Blog Posts", "12 %", "13 %", "25 %"],
              ["Texte / Zitate", "10 %", "13 %", "23 %"],
              ["Infografiken", "9 %", "13 %", "22 %"],
            ] },
          ],
          source: "PP Tag 3, Folien 7–9",
        },
        {
          ch: "Block 1 · Rekrutieren",
          title: "Stereotypen & Gleichstellung",
          blocks: [
            { t: "list", h: "Rekrutierung und Rollenbilder – Fragen an den eigenen Beruf", items: [
              "Bilde ich einen typischen Männer- oder Frauenberuf aus? Wenn ja, weshalb?",
              "Was zeichnet den Beruf aus – gibt es spezifische Rollenbilder?",
              "Ist das Berufsfeld stärker oder weniger stark von Stereotypen geprägt?",
              "Wie wirkt sich das auf die Rekrutierung aus?",
            ] },
            { t: "list", h: "Auftrag: Lehrstellenausschreibungen prüfen", items: [
              "Sind meine ausgeschriebenen Lehrstellen konform mit dem Gleichstellungsgesetz?",
              "Direkt bei den ausgeschriebenen Lehrstellen recherchieren – bei den eigenen und bei weiteren",
            ] },
            { t: "note", text: "Beispiel aus der Praxis: Kurse für «Dipl. Arztsekretärin», «Spitalsekretärin» und «Chefarztsekretärin» – eine stereotype Darstellung von Gesundheitsberufen. Stichwort: (un)sichtbare Vorbilder." },
          ],
          source: "PP Tag 3, Folien 6, 11 & 12",
        },
        {
          ch: "Block 1 · Schnupperlehre",
          title: "Die Schnupperlehre",
          blocks: [
            { t: "cols", h: "Sie hilft beiden Seiten bei der Entscheidung", cols: [
              { h: "🎒 Jugendliche", items: ["Erster Kontakt mit der Berufswelt der Erwachsenen", "Durch praktisches Arbeiten die Atmosphäre im Betrieb kennenlernen", "Eigene Interessen mit den Anforderungen des Berufs vergleichen", "Herausfinden, ob der Beruf der Vorstellung entspricht"] },
              { h: "🏭 Betrieb", items: ["Prüfen, ob sich die Person für den Ausbildungsplatz eignet", "Grundlegende Fähigkeiten werden schnell erkennbar", "Offen bleiben für Lernende, die nicht zu 100 % passen"] },
            ] },
            { t: "stats", items: [{ v: "3–5 Tage", l: "dauert sie in der Theorie" }, { v: "1 Tag", l: "ist es in der Praxis oft – aus Zeitmangel" }, { v: "immer", l: "werden die Jugendlichen betreut" }] },
            { t: "steps", h: "Zum Abschluss", items: [
              "Gespräch über die gegenseitigen Erfahrungen",
              "Beobachtungen auf einem Beurteilungsbogen festhalten",
              "Die Jugendlichen nehmen den Bogen mit – er unterstützt sie in ihrer weiteren Entwicklung",
            ] },
          ],
          source: "Grundlagen zur Schnupperlehre (Aufgabe 1) · PP Tag 3, Folie 13",
        },
        {
          ch: "Block 1 · Schnupperlehre",
          title: "Der Beurteilungsbogen",
          blocks: [
            { t: "cols", h: "Wie haben Sie die/den Jugendliche/n erlebt?", cols: [
              { h: "🛠️ Arbeitsweise", items: ["Auffassungsgabe", "Selbständigkeit", "Vorgehen, Geschicklichkeit", "Arbeitstempo", "Arbeitsqualität"] },
              { h: "💪 Arbeitshaltung", items: ["Interesse", "Ausdauer", "Ordnung, Sauberkeit", "Einsatz", "Zuverlässigkeit, Pünktlichkeit"] },
              { h: "🤝 Umgang & Erscheinung", items: ["Erster Eindruck", "Auftreten", "Kontaktfähigkeit, Kommunikation", "Zusammenarbeit"] },
              { h: "🎯 Eignung für den Beruf", items: ["Charakterlich", "Körperlich", "Praktische Veranlagung", "Sprachliches Verständnis", "Schulisch"] },
            ] },
            { t: "list", h: "So funktioniert der Bogen", items: [
              "Jedes Kriterium hat vier Stufen – z. B. Arbeitsqualität: sehr gut, exakt · gut, sorgfältig · brauchbar · unsorgfältig",
              "Gesamturteil «Eignung für den Betrieb»: bestens, gut, bedingt oder nicht geeignet",
              "Kurze Begründung schreiben und den Bogen mit der/dem Jugendlichen besprechen",
            ] },
          ],
          source: "BIZ Luzern (DBW) – «Schnupperlehre: Beurteilung durch den Lehrbetrieb», Stand 08/25",
        },
        {
          ch: "Block 1 · Schnupperlehre",
          title: "Fall: Schnupperlehrling Marco Gut",
          blocks: [
            { t: "stats", items: [{ v: "15", l: "Jahre alt" }, { v: "1 Woche", l: "Schnupperlehre im Betrieb" }, { v: "Zimmermann", l: "Wunschberuf" }] },
            { t: "cols", cols: [
              { h: "👍 Das spricht für Marco", items: ["Motiviert, pünktlich, positive Arbeitseinstellung", "Handwerkliches Geschick: einfache Holzarbeiten nach Instruktion selbstständig und schnell", "Gepflegtes Erscheinungsbild, freundlich und interessiert", "Technisches Gestalten 5.5 · Praktika und Sommerjob in Schreinereien"] },
              { h: "🤔 Das gibt zu denken", items: ["Schnupperheft verschmutzt, Seiten herausgerissen – nur eine von mehreren Aufgaben dokumentiert", "Stellt kaum Fragen, wenn er etwas nicht versteht", "Mathematik 3.5 (Niveau A), Natur und Technik 4.0", "Lehrer berichten von wenig Initiative und Eigenmotivation"] },
            ] },
            { t: "list", h: "Fazit der Fallbeschreibung", items: [
              "Insgesamt ein positives Bild – aber es braucht weitere Schritte",
              "Weitere Schnuppertage planen und das handwerkliche Können in verschiedenen Bereichen testen",
              "Arbeitsweise und Kommunikation müssten in der Ausbildung gezielt gefördert werden",
            ] },
            { t: "note", text: "Aus unserem Beurteilungsbogen: «Marco hat uns sein handwerkliches Geschick bestens bewiesen. […] Im Grossen und Ganzen sind wir sehr zufrieden und würden uns sehr auf seine Bewerbung um eine Lehrstelle freuen.»" },
          ],
          source: "Fallbeschreibung und Bewerbungsunterlagen Marco Gut (Aufgabe 1) · ausgefüllter Beurteilungsbogen",
        },
        {
          ch: "Block 1 · Potenzial erkennen",
          title: "Anforderungsprofile",
          blocks: [
            { t: "list", h: "Das Wichtigste in Kürze", items: [
              "Pro Beruf gibt es ein Anforderungsprofil mit den wichtigsten Kompetenzen",
              "Schüler/innen der 8. und 9. Klasse absolvieren den obligatorischen Stellwerktest – er erzeugt ein persönliches Leistungsprofil",
            ] },
            { t: "list", h: "Wozu dient ein Anforderungsprofil?", items: [
              "Vorzeitige Lehrvertragsauflösungen vermeiden",
              "Minimale schulische Kompetenzanforderungen an Lernende zeigen",
              "Grundlage für die Lehrstellenbesetzung",
              "Mögliche Grundlage im Bewerbungsgespräch: schulische Anforderungen aufzeigen, besonders wichtige Kompetenzen nennen",
            ] },
            { t: "cols", h: "Aufbau – Beispiel Gärtner/in EFZ Zierpflanzen", cols: [
              { h: "📊 Vier Fachbereiche", items: ["Mathematik", "Schulsprache", "Naturwissenschaften", "Fremdsprachen"] },
              { h: "📈 Vier Stufen", items: ["Einfache Anforderungen", "Mittlere Anforderungen", "Hohe Anforderungen", "Sehr hohe Anforderungen"] },
              { h: "📝 Dazu", items: ["Eine typische Arbeitssituation", "Weitere Anforderungen", "Besonderheiten des Berufs"] },
            ] },
            { t: "note", text: "Ziel: den Lernenden eine realistische Erwartung über die Anforderungen der Ausbildung vermitteln. Alle Profile: anforderungsprofile.ch" },
          ],
          source: "PP Tag 3, Folien 15 & 17–20",
        },
        {
          ch: "Block 1 · Potenzial erkennen",
          title: "Stellwerk 8 und 9",
          blocks: [
            { t: "list", h: "Online-basierte Standortbestimmung", items: [
              "Im 8. und 9. Schuljahr – obligatorisch für alle Schülerinnen und Schüler",
              "Ergibt ein persönliches Leistungsprofil und ist in den Schulzeugnissen vermerkt",
              "Als Berufsbildner/in dürfen Sie potenzielle Lernende um die Testresultate bitten",
              "Abgleich: Leistungsprofil ↔ Berufsanforderungen (z. B. über jobskills.ch)",
            ] },
            { t: "cols", h: "Fünf Fachbereiche", cols: [
              { h: "Deutsch", items: ["Hören, Lesen, Schreiben, Sprachreflexion"] },
              { h: "Mathematik", items: ["Zahlen, Form und Raum, Variablen, Daten"] },
              { h: "Natur und Technik", items: ["Biologie, Physik, Chemie"] },
              { h: "Fremdsprachen", items: ["Französisch", "Englisch"] },
            ] },
            { t: "note", text: "Der Vergleich zeigt auf einen Blick, wo das Leistungsprofil die Anforderungen des Berufs erfüllt – und wo eine Lücke bleibt." },
          ],
          source: "PP Tag 3, Folien 16 & 21–24",
        },
        {
          ch: "Block 1 · Potenzial erkennen",
          title: "Eignungstests & DBW-Kurs",
          blocks: [
            { t: "table", h: "Eignungsanalysen (Stand 2025)", head: ["Test", "Was wird geprüft?", "Aufwand"], rows: [
              ["Basic Check", "Sprachkenntnisse, Mathematikfähigkeiten und basale kognitive Fähigkeiten", "CHF 100.– · ca. 2.5 bis 3.5 Stunden, je nach Modulwahl"],
              ["Multicheck", "Neun verschiedene Multichecks für unterschiedliche Berufsgruppen – wird oft verlangt", "CHF 60 bis 100"],
            ] },
            { t: "list", h: "DBW-Kurs «Die Selektion als Schlüssel zum Erfolg»", items: [
              "Vorgehensweise bei der Selektion",
              "Optimale Nutzung des Stellwerktests 8 für die eigene Selektion",
              "Tipps für einen erfolgreichen Lehrstart",
              "Auskunft: betrieblichebildung.dbw@lu.ch",
            ] },
          ],
          source: "PP Tag 3, Folien 25–27",
        },
        {
          ch: "Block 1 · Auswählen",
          title: "Das Bewerbungsgespräch",
          blocks: [
            { t: "steps", h: "Eine überlegte Struktur mit geeigneten Fragen", items: [
              "Begrüssung und Kennenlernen – locker starten, damit eine vertraute Stimmung entsteht",
              "Ablauf bekanntgeben: Ziel, Zeit, Aufbau",
              "Zuerst über Firma und Bereich informieren (Organigramm, Webseite, Broschüren) – so können die Jugendlichen ankommen",
              "Gezielte Fragen stellen, die man sich aufgrund der Bewerbung notiert hat",
              "Ergebnisse zusammenfassen und über den weiteren Ablauf informieren",
              "Gleich nach der Verabschiedung: persönlichen Eindruck und Beobachtungen schriftlich festhalten",
            ] },
            { t: "list", h: "Das will ich im Gespräch erfahren", items: [
              "Eignung für die Ausbildung",
              "Persönliche Motivation für Ausbildung und Arbeitsstelle",
              "Persönliche Entwicklung: Ziele, Stärken, Schwächen",
              "Persönliches Umfeld",
            ] },
            { t: "note", text: "Passt die Person ins Team, bringt sie die nötigen Sozialkompetenzen mit? Fachkompetenzen sind nicht die einzigen Kriterien." },
          ],
          source: "Grundlagen zum Bewerbungsgespräch (Aufgabe 2) · PP Tag 3, Folien 28–29",
        },
        {
          ch: "Block 1 · Auswählen",
          title: "Häufige Beurteilungsfehler",
          blocks: [
            { t: "table", h: "Wahrnehmungsfehler verzerren die Beurteilung", head: ["Fehler", "Was passiert?", "Beispiel"], rows: [
              ["Erster und letzter Eindruck", "Aussehen, Sprechweise, Kleidung, Körperhaltung – und die eigene Stimmung – prägen ein Bild, das lange bleibt", "Einmal zu spät wegen eines Busausfalls → «nimmt den Termin nicht ernst»"],
              ["Halo-Effekt («Heiligenschein»)", "Ein Merkmal überstrahlt alle anderen – positiv oder negativ", "Fleckiges Oberteil → «arbeitet bestimmt auch nicht sauber»"],
              ["Sympathie / Antipathie", "Beruht auf Äusserlichkeiten und färbt, wie Unstimmigkeiten bewertet werden", "Auf Anhieb sympathisch → «passt perfekt» – Fähigkeiten trotzdem prüfen"],
            ] },
            { t: "list", h: "Ganz vermeiden lassen sie sich nicht – aber verringern", items: [
              "Mögliche Beurteilungsfehler immer wieder bewusstmachen",
              "Die eigenen Beurteilungsschwächen herausfinden",
              "Beobachtungen aus dem Gespräch notieren",
              "Bei einer Beurteilung systematisch vorgehen",
              "Die Entscheidung mit anderen besprechen – nicht alleine beurteilen",
              "Die Beurteilungssituation bewusst gestalten",
            ] },
            { t: "note", text: "Transferfrage aus dem Kurs: Wieso könnte Marco Gut fehlerhaft beurteilt werden? Sein gepflegtes Auftreten und sein unsauberes Schnupperheft ziehen in verschiedene Richtungen – je nachdem, welches Merkmal überstrahlt." },
          ],
          source: "Grundlagen zu häufigen Beurteilungsfehlern (Aufgabe 3) · PP Tag 3, Folien 30–31",
        },
        {
          ch: "Block 2 · Lernumgebung vorbereiten",
          title: "Ziele erkennen: BiVo & BiPla",
          blocks: [
            { t: "table", head: ["Dokument", "Was steht drin?"], rows: [
              ["Bildungsverordnung (BiVo)", "Gesetzliche Grundstruktur der Grundbildung – einzeln für jeden Beruf, regelt die Ausbildung für alle drei Lernorte"],
              ["Bildungsplan (BiPla)", "Ziele und Anforderungen: Handlungskompetenzen und Leistungsziele pro Lernort"],
              ["Umsetzungsinstrumente der OdA", "Modell-Lehrgänge, Ausbildungsplan, Vorlagen für die Lerndokumentation"],
            ] },
            { t: "cols", h: "Drei Lernorte – drei Beiträge", cols: [
              { h: "🏫 Berufsfachschule", items: ["Theoretisches Fachwissen"] },
              { h: "🛠️ Überbetriebliche Kurse", items: ["Grundlegende berufliche Fähigkeiten"] },
              { h: "🏭 Betrieb", items: ["Praktische Erfahrung und Handlungswissen"] },
            ] },
            { t: "list", h: "Wie verwende ich BiVo und BiPla?", items: [
              "Zur Strukturierung der Ausbildung – als Berufsbildner/in bestimme ich die Reihenfolge, in der die Fähigkeiten erlernt werden",
              "Lernortkooperation beachten: nach jedem üK das Gelernte gleich anschliessend im Betrieb trainieren",
              "Bezug: SBFI-Berufsverzeichnis (bvz.admin.ch, Berufe von A–Z) und Trägervereine",
              "Ebenfalls wichtig: «Begleitende Massnahmen der Arbeitssicherheit und des Gesundheitsschutzes»",
            ] },
            { t: "note", text: "Beispiel Mediamatiker/in EFZ – Handlungskompetenz «Digitale Rohdaten erstellen», Leistungsziel: «… erstellen Rohdaten mit einer Kamera gemäss Konzept.»" },
          ],
          source: "PP Tag 3, Folien 34–40",
        },
        {
          ch: "Block 2 · Lernumgebung vorbereiten",
          title: "Ausbildungsplanung in 7 Schritten",
          blocks: [
            { t: "steps", items: [
              "Individuellen Ausbildungsplan erarbeiten",
              "Zuständigkeiten im Team absprechen",
              "Eigene Betreuungstätigkeit planen",
              "Einführungsphase vorbereiten",
              "Erste Lern- und Beurteilungsphasen planen",
              "Lernpartnerschaften organisieren",
              "Infrastruktur bereitstellen",
            ] },
            { t: "note", text: "Das Ausbildungskonzept erstellen Sie nur einmal. Bei neuen Lernenden überlegen Sie lediglich, wie Sie das Konzept bei ihnen konkret umsetzen." },
          ],
          source: "PP Tag 3, Folien 42–43",
        },
        {
          ch: "Block 2 · Lernumgebung vorbereiten",
          title: "Schritte 1–3: Plan, Team, Betreuung",
          blocks: [
            { t: "cols", cols: [
              { h: "1 · Individueller Ausbildungsplan", items: ["Wann arbeitet die lernende Person in welcher Abteilung?", "Wann genau enden Einführungsphase und Probezeit?", "Wann ist sie in der Berufsfachschule oder im üK?"] },
              { h: "2 · Zuständigkeiten im Team", items: ["Pro Abteilung fixe Ansprechpersonen für die Lernenden definieren", "Frühzeitig mit den Verantwortlichen sprechen und die Betreuung koordinieren", "Weitergeben: didaktische Richtlinien, Leistungsziele und Zeitrahmen, weitere Erwartungen"] },
              { h: "3 · Eigene Betreuung", items: ["Wann in der Woche betreue ich die Lernenden persönlich?", "An welchen Daten führe ich Standort- und Zwischengespräche?", "Wer vertritt mich, wenn ich abwesend bin?"] },
            ] },
          ],
          source: "PP Tag 3, Folien 44–46",
        },
        {
          ch: "Block 2 · Lernumgebung vorbereiten",
          title: "Schritte 4–7: Einführung bis Infrastruktur",
          blocks: [
            { t: "list", h: "4 · To-do-Liste für die Einführungsphase", items: [
              "Material zur Übergabe zusammenstellen: individueller Ausbildungsplan, Betriebshandbücher usw.",
              "Einweisung in die betriebsinterne Infrastruktur organisieren (IT, Maschinen)",
              "Zusammenkunft organisieren, um die Lernenden willkommen zu heissen",
              "Spezifische Einführungen (Projekte, Produkte, Abteilungen) durch Mitarbeitende arrangieren",
              "Konkrete Arbeiten der Lernenden zur Einführung festlegen",
              "Termineinladungen an alle Beteiligten versenden",
              "Leitfaden für das Eintrittsgespräch formulieren",
            ] },
            { t: "cols", cols: [
              { h: "5 · Lern- & Beurteilungsphasen", items: ["Tätigkeit für die erste Lernphase festlegen – ggf. mit Praxisbildner/in", "Termine für Zwischen- und Beurteilungsgespräche mitteilen", "Nach Lehrantritt: Inhalte der Gespräche definieren"] },
              { h: "6 · Lernpartnerschaften", items: ["Geeignete Lernende als Lernpartner/in suchen", "Rahmenbedingungen, Sinn und Zweck erläutern", "Termine festlegen", "Das Arbeitsteam informieren"] },
              { h: "7 · Infrastruktur", items: ["Arbeitsplatz und -geräte", "Informationsmaterialien", "Lern- und Leistungsdokumentation", "Zugänge und Zugriffsrechte (E-Mail)", "Intranet und Telefonanlage"] },
            ] },
          ],
          source: "PP Tag 3, Folien 47–52",
        },
        {
          ch: "Block 3 · Abschluss",
          title: "Reflexion & Ampelabfrage",
          blocks: [
            { t: "list", h: "Persönliche Reflexion – zwei Themen", items: ["«Der Rekrutierungsprozess»", "«Arbeits- und Lernumgebung»"] },
            { t: "cols", h: "Ampelabfrage: Wo stehe ich?", cols: [
              { h: "🟢 Grün", items: ["Thema verstanden – ich fühle mich wohl in der Fallbearbeitung"] },
              { h: "🟡 Gelb", items: ["Im Groben verstanden – noch einige Verständnisschwierigkeiten"] },
              { h: "🔴 Rot", items: ["Noch viele Fragen – die Bearbeitung ist mir schwergefallen"] },
            ] },
            { t: "steps", h: "Die drei Themen des Tages", items: [
              "Lernende rekrutieren: Stolpersteine, Gesprächsgestaltung, Potenzial erkennen",
              "Arbeitsumgebungen vorbereiten: Ziele erkennen, Ausbildungsplan erstellen, Lernbegleitung gestalten und sicherstellen",
              "Lehrstart vorbereiten: Lernumgebung gestalten, Lehrbeginn planen, erste Arbeitszeit inkl. erster Lernerfolge sicherstellen",
            ] },
          ],
          source: "PP Tag 3, Folien 32 & 54–57",
        },
      ],
    },
    { nr: 4, title: "Kurstag 4", placeholder: true, c1: "#d6812f", c2: "#3d200c", missions: [] },
    { nr: 5, title: "Kurstag 5 · Take-away", placeholder: true, c1: "#d63f5a", c2: "#3d0d18", missions: [] },
  ],

  /* =====================================================================
     BEISPIELBERUF – Informatiker/in EFZ (BiVo SR 412.101.220.10 · Bildungsplan 88611)
     Wird wie ein Level dargestellt; der Charakter "informatik" steht dabei auf der Bühne.
     ===================================================================== */
  beruf: {
    nr: "💻",
    char: "informatik",
    title: "Beispielberuf Informatiker/in EFZ",
    subtitle: "Alles Generische gilt für jeden Beruf – hier am Beispiel meines Berufs: BiVo, Bildungsplan, Kompetenzen und QV",
    missions: [
      {
        ch: "Überblick",
        title: "Der Beruf auf einen Blick",
        blocks: [
          { t: "stats", items: [{ v: "8", l: "Semester" }, { v: "2", l: "Fachrichtungen" }, { v: "8", l: "Handlungskompetenzbereiche" }, { v: "24", l: "Module Berufsfachschule" }, { v: "35", l: "üK-Tage in 7 Kursen" }] },
          { t: "cols", h: "Zwei Fachrichtungen", cols: [
            { h: "🖧 Plattformentwicklung", items: ["Netze, Dienste und Serversysteme aufbauen, betreiben und überwachen", "Zusätzlich HKB d, e, f"] },
            { h: "💻 Applikationsentwicklung", items: ["Applikationen und Schnittstellen realisieren, ausliefern und betreiben", "Zusätzlich HKB g, h"] },
          ] },
          { t: "note", text: "Nebst Fachkompetenzen vermittelt die Ausbildung Methoden-, Sozial- und Selbstkompetenzen (BiVo Art. 3)." },
        ],
        source: "BiVo Informatiker/in EFZ Art. 3 · Bildungsplan 88611",
      },
      {
        ch: "Kompetenzen",
        title: "Für alle: HKB a–c",
        blocks: [
          { t: "cols", cols: [
            { h: "a · ICT-Projekte begleiten", items: ["a1 Bedürfnisse von Stakeholdern abklären", "a2 Vorgehensmodell bestimmen", "a3 ICT-Lösungen recherchieren", "a4 Projekte planen", "a5 Varianten visualisieren & präsentieren", "a6 Fortschritt überprüfen", "a7 Lösungen übergeben & abschliessen"] },
            { h: "b · Unterstützen & Beraten", items: ["b1 Eigenen ICT-Arbeitsplatz einrichten", "b2 Komplexe Supportanfragen bearbeiten", "b3 Kunden zu Datenschutz & -sicherheit beraten", "b4 Geschäftsprozesse analysieren & dokumentieren"] },
            { h: "c · Digitale Daten", items: ["c1 Datenmodelle entwickeln", "c2 Datenmodelle umsetzen", "c3 Datensicherheit & Datenschutz umsetzen", "c4 Daten aufbereiten"] },
          ] },
        ],
        source: "Bildungsplan Informatiker/in EFZ, Übersicht der Handlungskompetenzen",
      },
      {
        ch: "Kompetenzen",
        title: "Plattformentwicklung: HKB d–f",
        blocks: [
          { t: "cols", cols: [
            { h: "d · ICT-Lösungen betreiben", items: ["d1 ICT-Prozesse automatisieren", "d2 Auslieferungsprozess definieren", "d3 Ausführungsplattform vorbereiten", "d4 ICT-Lösungen in Betrieb nehmen"] },
            { h: "e · Netze", items: ["e1 Netze planen & dokumentieren", "e2 Netzkomponenten in Betrieb nehmen", "e3 Netze warten", "e4 Sicherheit implementieren", "e5 Leistung optimieren", "e6 Netze überwachen"] },
            { h: "f · Server & Dienste", items: ["f1 Planen & dokumentieren", "f2/f3 Systeme & Dienste in Betrieb nehmen", "f4 Warten & verwalten", "f5 Überwachen", "f6 Sicherheit", "f7 Verfügbarkeit", "f8 Backup & Archivierung"] },
          ] },
        ],
        source: "Bildungsplan Informatiker/in EFZ, Übersicht der Handlungskompetenzen",
      },
      {
        ch: "Kompetenzen",
        title: "Applikationsentwicklung: HKB g–h",
        blocks: [
          { t: "cols", cols: [
            { h: "g · Applikationen entwickeln", items: ["g1 Anforderungen & Schnittstellen analysieren", "g2 Gestaltungsentwürfe für Benutzerschnittstellen prüfen", "g3 Sicherheit beurteilen", "g4 Lösung konzeptionell ausarbeiten", "g5 Implementieren", "g6 Qualität & Sicherheit überprüfen"] },
            { h: "h · Ausliefern & Betreiben", items: ["h1 Plattform bestimmen", "h2 Auslieferungsprozess definieren", "h3 Auslieferung durchführen", "h4 Applikationen überwachen & Probleme beheben"] },
          ] },
          { t: "list", h: "Kompetenzmodell", items: [
            "Handlungskompetenzbereich → Handlungskompetenz → Leistungsziele je Lernort",
            "Taxonomie K1 Wissen · K2 Verstehen · K3 Anwenden · K4 Analyse · K5 Synthese · K6 Beurteilen",
          ] },
        ],
        source: "Bildungsplan Informatiker/in EFZ",
      },
      {
        ch: "Rahmen (BiVo)",
        title: "Was die BiVo im Betrieb verlangt",
        blocks: [
          { t: "table", h: "Anforderungen an Berufsbildner/innen (Art. 10)", head: ["Qualifikation", "Praxis im Lehrgebiet"], rows: [
            ["Informatiker/in EFZ", "mind. 2 Jahre"],
            ["EFZ eines verwandten Berufs mit Informatikkenntnissen", "mind. 5 Jahre"],
            ["Einschlägiger Abschluss der höheren Berufsbildung", "–"],
            ["Einschlägiger Hochschulabschluss", "mind. 2 Jahre"],
          ] },
          { t: "list", h: "Höchstzahl Lernende (Art. 11)", items: [
            "1 Lernende/r: 1 Berufsbildner/in zu 100 % oder 2 zu je mind. 60 %",
            "Jede weitere: zusätzlich 1 Fachkraft zu 100 % oder 2 zu je mind. 60 %",
            "Zweite Person darf beginnen, wenn die erste ins letzte Lehrjahr eintritt",
          ] },
          { t: "note", text: "Arbeitssicherheit (Art. 5): zu Beginn und während der ganzen Ausbildung, an allen Lernorten. Keine gefährlichen Arbeiten – also keine Ausnahme vom Arbeitsgesetz nötig." },
        ],
        source: "BiVo Informatiker/in EFZ Art. 5, 10, 11 · Antworten Tag 2",
      },
      {
        ch: "Rahmen (BiVo)",
        title: "Lerndokumentation & Bildungsbericht",
        blocks: [
          { t: "cols", cols: [
            { h: "📒 Lerndokumentation (Art. 12)", items: ["Lernende führen sie laufend", "Alle wesentlichen Arbeiten festhalten", "BB kontrolliert & unterzeichnet mind. 1x pro Semester", "An der IPA als Hilfsmittel erlaubt"] },
            { h: "📝 Bildungsbericht (Art. 13)", items: ["Am Ende jedes Semesters", "Gestützt auf Betrieb, BFS und üK", "Massnahmen mit Fristen schriftlich vereinbaren", "Bei Gefährdung: Vertragsparteien & Kanton schriftlich informieren"] },
          ] },
        ],
        source: "BiVo Informatiker/in EFZ Art. 12, 13, 18",
      },
      {
        ch: "Qualifikationsverfahren",
        title: "Das QV Informatiker/in EFZ",
        blocks: [
          { t: "table", h: "Gesamtnote (Art. 19)", head: ["Bestandteil", "Gewicht"], rows: [
            ["Praktische Arbeit (IPA, 70–90 h)", "40 %"],
            ["Erfahrungsnote «Informatikkompetenzen» (80 % BFS-Module, 20 % üK)", "30 %"],
            ["Allgemeinbildung", "20 %"],
            ["Erfahrungsnote «erweiterte Grundkompetenzen» (Ø 8 Semesterzeugnisse)", "10 %"],
          ] },
          { t: "stats", h: "IPA-Bewertung (Art. 18)", items: [{ v: "50 %", l: "Ausführung & Resultat" }, { v: "20 %", l: "Dokumentation" }, { v: "30 %", l: "Präsentation & Fachgespräch (max. 1 h)" }] },
          { t: "note", text: "Bestanden, wenn alle drei erfüllt sind: IPA ≥ 4 · Erfahrungsnote «Informatikkompetenzen» ≥ 4 · Gesamtnote ≥ 4." },
        ],
        source: "BiVo Informatiker/in EFZ Art. 18, 19",
      },
      {
        ch: "Rekrutieren & Planen (Tag 3)",
        title: "Tag 3 angewendet auf meinen Beruf",
        blocks: [
          { t: "list", h: "🔎 Rekrutieren", items: [
            "Anforderungsprofil Informatiker/in EFZ auf anforderungsprofile.ch holen und mit den Stellwerk-Resultaten der Bewerbenden abgleichen",
            "Schnupperlehre mit dem Beurteilungsbogen des BIZ auswerten und mit der/dem Jugendlichen besprechen",
            "Bewerbungsgespräch strukturiert führen – nicht nur auf Fachkompetenz achten, sondern auch: Passt die Person ins Team?",
            "Beurteilungsfehler bewusst machen: Ein Gamer-Hoodie oder ein perfekter Lebenslauf darf nicht alles überstrahlen (Halo-Effekt)",
          ] },
          { t: "list", h: "📋 Individueller Ausbildungsplan", items: [
            "Fachrichtung festlegen: Plattform- oder Applikationsentwicklung – davon hängen die HKB d–f bzw. g–h ab",
            "Schultage (24 Module) und die 7 üK-Kurse à 5 Tage fix einplanen – im letzten Semester keine üK",
            "Nach jedem üK das Gelernte gleich im Betrieb trainieren lassen (Lernortkooperation)",
            "Infrastruktur bereitstellen: Arbeitsplatz, Notebook, Konten und Zugriffsrechte, Intranet",
            "Lernpartnerschaft: aktuelle Informatik-Lernende als Lernpartner/in gewinnen und ihr Team informieren",
          ] },
          { t: "note", text: "Die Werkzeuge aus Tag 3 sind für alle Berufe gleich – Anforderungsprofil, Schnupperlehre, Bewerbungsgespräch und die 7 Planungsschritte. Konkret wird es erst über BiVo und Bildungsplan des eigenen Berufs." },
        ],
        source: "PP Tag 3 · Grundlagen Schnupperlehre, Bewerbungsgespräch und Beurteilungsfehler · BiVo Informatiker/in EFZ Art. 8",
      },
    ],
  },

  /* =====================================================================
     CHARAKTERE = AKTEURE  (look = Bauplan für die 3D-Figur, env = Umgebung)
     ===================================================================== */
  characters: [
    {
      id: "lernende", name: "Lernende/r", short: "Die Hauptfigur",
      color: "#5fd4ff", env: "lernorte",
      look: { skin: "#f1c27d", shirt: "#2f8fd8", pants: "#2b3550", hair: "#4a2e1a", hairStyle: "cap", cap: "#c2410c", extra: ["backpack"], scale: 0.92 },
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
        { to: "informatik", text: "Ein konkretes Beispiel: so sieht eine Lehre als Informatiker/in EFZ aus." },
      ],
      informatik: [
        "Ein Beispiel ist die Lehre als Informatiker/in EFZ – siehe Rolle «Informatik-Lernende/r»",
        "Lerndokumentation laufend führen und alle wesentlichen Arbeiten festhalten (BiVo Art. 12)",
        "Arbeitssicherheit, Gesundheits- und Umweltschutz von Beginn an – an allen drei Lernorten (Art. 5)",
      ],
      sources: "PP Tag 1 & 2 · Ablaufplan · Planung",
    },
    {
      id: "informatik", name: "Informatik-Lernende/r", short: "Beispielberuf · Informatiker/in EFZ",
      color: "#3fe0c5", env: "serverraum",
      look: { skin: "#e8b98a", shirt: "#334a7a", pants: "#23293a", hair: "#2a1d14", hairStyle: "curly", extra: ["hoodie", "headset", "laptop"], pose: "laptop", scale: 0.94 },
      tagline: "Lernt in 8 Semestern, ICT-Lösungen zu planen, zu bauen und zu betreiben – im Betrieb, in der Schule und im üK.",
      role: "Absolviert die berufliche Grundbildung Informatiker/in EFZ nach der BiVo des SBFI (SR 412.101.220.10) – in der Fachrichtung Plattformentwicklung oder Applikationsentwicklung.",
      aufgaben: [
        "Wählt eine Fachrichtung: Plattformentwicklung (Netze, Server, Dienste) oder Applikationsentwicklung (Software)",
        "Erwirbt Kompetenzen in 8 Handlungskompetenzbereichen (a–h) – a bis c für alle",
        "Begleitet ICT-Projekte, unterstützt und berät im ICT-Umfeld, pflegt digitale Daten",
        "Entwickelt neben Fachkompetenzen auch Methoden-, Sozial- und Selbstkompetenzen (Art. 3)",
        "Besucht 24 Module an der Berufsfachschule und 7 üK-Kurse",
        "Lernt Mathematik (120 Lektionen) und Englisch (200 Lektionen) als erweiterte Grundkompetenzen",
      ],
      rechte: [
        "Wird von qualifizierten Berufsbildner/innen ausgebildet (z. B. Informatiker/in EFZ + mind. 2 Jahre Praxis, Art. 10)",
        "Arbeitssicherheit wird zu Beginn und während der ganzen Ausbildung erklärt – an allen Lernorten (Art. 5)",
        "Keine gefährlichen Arbeiten – darum braucht der Beruf keine Ausnahme vom Arbeitsgesetz",
        "35 üK-Tage (7 Kurse à 5 Tage) zählen als Arbeitszeit – im letzten Semester gibt es keine üK",
        "Bildungsbericht jedes Semester, besprochen mit der lernenden Person (Art. 13)",
        "Wird schriftlich informiert, wenn der Ausbildungserfolg gefährdet ist – samt Massnahmen und Fristen",
        "Darf die Lerndokumentation an der IPA als Hilfsmittel verwenden (Art. 18)",
      ],
      pflichten: [
        "Führt die Lerndokumentation laufend und hält alle wesentlichen Arbeiten fest (Art. 12)",
        "Erarbeitet die IPA: 70–90 Stunden, bewertet nach Ausführung 50 %, Doku 20 %, Präsentation & Fachgespräch 30 %",
        "Besteht das QV mit IPA ≥ 4, Erfahrungsnote «Informatikkompetenzen» ≥ 4 und Gesamtnote ≥ 4 (Art. 19)",
      ],
      informatik: [
        "Fachrichtung Plattformentwicklung: Netze, Dienste und Serversysteme aufbauen, betreiben und überwachen (HKB d, e, f)",
        "Fachrichtung Applikationsentwicklung: Applikationen entwickeln, ausliefern und betreiben (HKB g, h)",
        "Projektmodule 431 und 306: Aufträge bzw. Kleinprojekt im eigenen Berufsumfeld",
        "Gesamtnote: IPA 40 % · Informatikkompetenzen 30 % · Allgemeinbildung 20 % · erweiterte Grundkompetenzen 10 %",
      ],
      beziehungen: [
        { to: "lernende", text: "Ist eine lernende Person – alle allgemeinen Rechte und Pflichten gelten auch hier." },
        { to: "bb", text: "Kontrolliert die Lerndokumentation mind. 1x pro Semester und erstellt den Bildungsbericht." },
        { to: "bfs", text: "24 Module und erweiterte Grundkompetenzen – 80 % der Erfahrungsnote Informatik." },
        { to: "uek", text: "7 Kurse à 5 Tage – 20 % der Erfahrungsnote Informatik." },
        { to: "oda", text: "ICT-Berufsbildung Schweiz organisiert die Module (ICT-Modulbaukasten)." },
        { to: "sbfi", text: "Die BiVo vom 19. November 2020 gibt den Rahmen vor." },
      ],
      sources: "BiVo Informatiker/in EFZ (SR 412.101.220.10) · Bildungsplan Nr. 88611 · Antworten BiVo Tag 2",
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
        "Lehrstellenmarketing betreiben: Schulklassen einladen, ZEBI, Zukunftstag, Social Media und Videobotschaften statt Inserate",
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
      informatik: [
        "1 Lernende/r braucht 1 Berufsbildner/in zu 100 % oder 2 zu je mind. 60 % (Art. 11)",
        "Jede weitere lernende Person: zusätzlich 1 Fachkraft zu 100 % oder 2 zu je mind. 60 %",
        "Wer nur 1 Lernende/n ausbilden darf, kann die zweite Person starten lassen, sobald die erste im letzten Lehrjahr ist",
        "Keine Ausnahme vom Verbot gefährlicher Arbeiten nötig – Informatiker/innen führen keine aus",
      ],
      sources: "Ablaufplan · PP Tag 1, 2 & 3 · BiVo Informatiker/in",
    },
    {
      id: "bb", name: "Berufsbildner/in", short: "Coach & Fachperson",
      color: "#ffcc4d", env: "werkstatt",
      look: { skin: "#f1c27d", shirt: "#f2a516", pants: "#3a3f55", hair: "#8a5a2b", hairStyle: "bun", extra: ["glasses", "clipboard"] },
      tagline: "Befähigt statt nur zu machen – Coach, Fachperson und Vorbild in einem.",
      role: "Bildet im Lehrbetrieb aus (früher «Lehrmeister/in»). Coach, Fachperson, Berater/in, Begleiter/in und fachliches wie persönliches Vorbild.",
      aufgaben: [
        "Betrieblichen und individuellen Bildungsplan erstellen",
        "Treffsicher rekrutieren: Schnupperlehre mit Beurteilungsbogen, strukturiertes Bewerbungsgespräch, Anforderungsprofil mit Stellwerk-Resultaten abgleichen",
        "Ausbildung in 7 Schritten planen – vom individuellen Ausbildungsplan bis zur Infrastruktur",
        "Eigene Beurteilungsfehler kennen: erster Eindruck, Halo-Effekt, Sympathie und Antipathie",
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
        "Anforderungen der BiVo erfüllen: passender Abschluss + berufliche Praxis im Lehrgebiet",
      ],
      beziehungen: [
        { to: "lernende", text: "Begleitet, fördert und beurteilt – denkt aus Sicht der Lernenden." },
        { to: "betrieb", text: "Handelt im Auftrag des Lehrbetriebs." },
        { to: "eltern", text: "Bezieht sie bei mittleren Verstössen ein (empfohlen), bei schweren zwingend." },
        { to: "dbw", text: "Holt früh Hilfe – vor allem vor einer Lehrvertragsauflösung." },
        { to: "bfs", text: "Lernortkooperation – das Zeugnis fliesst in den Bildungsbericht ein." },
        { to: "uek", text: "Lernortkooperation – üK-Leistungen zählen ebenfalls." },
        { to: "informatik", text: "Beispiel aus meinem Beruf: Ausbildung von Informatiker/innen EFZ." },
      ],
      informatik: [
        "Voraussetzung (Art. 10): Informatiker/in EFZ + mind. 2 Jahre Praxis · verwandtes EFZ mit Informatikkenntnissen + mind. 5 Jahre · einschlägige höhere Berufsbildung · einschlägiger Hochschulabschluss + mind. 2 Jahre",
        "Lerndokumentation mind. 1x pro Semester kontrollieren, unterzeichnen und besprechen (Art. 12)",
        "Bildungsbericht am Ende jedes Semesters – gestützt auf Betrieb, Berufsfachschule und üK (Art. 13)",
        "Massnahmen mit Fristen schriftlich vereinbaren und im nächsten Bericht überprüfen",
        "Arbeitssicherheit erklären: zu Beginn und während der ganzen Ausbildung, inkl. Gefahrensymbole und Piktogramme (Art. 5)",
        "Die IPA (70–90 h) im letzten Semester begleiten",
        "Rekrutieren: Anforderungsprofil Informatiker/in EFZ mit den Stellwerk-Resultaten der Bewerbenden abgleichen",
        "Im individuellen Ausbildungsplan die Fachrichtung, die 24 Schulmodule und die 7 üK-Kurse einplanen",
      ],
      sources: "PP Tag 1, 2 & 3 · Planung · BiVo Informatiker/in",
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
      informatik: [
        "Werden als Vertragspartei schriftlich informiert, wenn der Ausbildungserfolg gefährdet ist (BiVo Art. 13)",
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
        "Unterstützt die Rekrutierung: Kurs «Die Selektion als Schlüssel zum Erfolg» und Beurteilungsbogen für die Schnupperlehre (BIZ)",
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
      informatik: [
        "Kann Betrieben mit mehrjährigem, überdurchschnittlichem Ausbildungserfolg mehr Lernende bewilligen (Art. 11)",
        "Wird schriftlich informiert, wenn der Ausbildungserfolg gefährdet ist (Art. 13)",
      ],
      sources: "PP Tag 2 & 3 · Ablaufplan · BiVo Informatiker/in",
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
        "Zeugnisse bzw. Modulnoten – sie fliessen in Erfahrungsnoten und Bildungsbericht ein",
      ],
      informatik: [
        "24 Module nach dem ICT-Modulbaukasten von ICT-Berufsbildung Schweiz",
        "Erweiterte Grundkompetenzen: Mathematik 120 + Englisch 200 = 320 Lektionen",
        "Modulnoten = 80 % der Erfahrungsnote «Informatikkompetenzen»",
        "Erfahrungsnote «erweiterte Grundkompetenzen» = Durchschnitt der 8 Semesterzeugnisnoten",
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
      ],
      pflichten: [
        "Kurse nach dem Ausbildungsprogramm für die üK durchführen",
        "Leistungen bewerten – je nach Beruf zählen sie für die Erfahrungsnote",
      ],
      informatik: [
        "35 Tage zu je 8 Stunden – aufgeteilt auf 7 Kurse à 5 Tage (Art. 8)",
        "Jeder Kurs entspricht einem Modul · 4 Pflicht- und 3 Wahlkurse",
        "Im letzten Semester finden keine üK statt",
        "üK-Noten = 20 % der Erfahrungsnote «Informatikkompetenzen»",
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
        "Liefern Umsetzungsinstrumente: Modell-Lehrgänge, Ausbildungsplan und Vorlagen für die Lerndokumentation",
      ],
      beziehungen: [
        { to: "sbfi", text: "Der Bund erlässt die BiVo und genehmigt den Bildungsplan." },
        { to: "uek", text: "Verantwortlich für die Durchführung." },
        { to: "betrieb", text: "Liefert Ausbildungsprogramm und Unterlagen." },
        { to: "bfs", text: "Erarbeitet den Lehrplan gemeinsam." },
      ],
      informatik: [
        "Für die Informatik: ICT-Berufsbildung Schweiz",
        "Organisiert den Unterricht in Berufsfachschule und üK über den ICT-Modulbaukasten",
        "Hat den Bildungsplan Informatiker/in EFZ (Nr. 88611) erarbeitet",
      ],
      sources: "PP Tag 1, 2 & 3 · Planung · Ablaufplan",
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
      informatik: [
        "Verordnung des SBFI vom 19. November 2020 über die berufliche Grundbildung Informatiker/in EFZ",
        "SR 412.101.220.10 – Stand 1. Januar 2026",
        "Bildungsplan Informatiker/in EFZ, Nr. 88611 (SBFI 2020)",
      ],
      sources: "PP Tag 1 & 2 · Planung",
    },
    {
      /* Running Gag aus dem Kurs – bewusst kurz gehalten. Das Hauptbeispiel bleibt Informatiker/in EFZ. */
      id: "pferd", name: "Pferdefachmann/-frau", short: "Bonus-Rolle · Running Gag aus dem Kurs",
      color: "#d9a05b", env: "reitstall",
      look: { skin: "#f1c27d", shirt: "#2f6b3a", pants: "#e6dcc4", hair: "#5a3a1e", hairStyle: "helmet", helmet: "#1d1d24", extra: ["horse"], scale: 0.96 },
      tagline: "Der Running Gag unseres Kurses – und der Beweis, dass das Berufsbildungssystem auch im Stall gilt.",
      role: "Pferdefachmann/-frau EFZ: dreijährige berufliche Grundbildung rund ums Pferd. Andere Branche, gleiche Spielregeln – BiVo, Bildungsplan, drei Lernorte, Lehrvertrag.",
      aufgaben: [
        "Pflegt, füttert und bewegt Pferde – je nach Ausrichtung von der Pferdepflege über das Reiten bis zum Gespannfahren",
        "Lernt wie alle Lernenden an drei Lernorten: im Stall, 1 Tag pro Woche in der Berufsfachschule und 15 Tage im üK",
        "Führt eine Lerndokumentation und bespricht jedes Semester den Bildungsbericht – auch mit Stroh an den Stiefeln",
        "Sorgt in jeder Berufsvorstellung zuverlässig für die meisten Rückfragen",
      ],
      beziehungen: [
        { to: "lernende", text: "Ist eine lernende Person wie alle anderen – nur mit mehr PS." },
        { to: "informatik", text: "Die einen pflegen Server, die anderen Pferde – eine Lerndokumentation führen beide." },
        { to: "bb", text: "Wird genauso begleitet, gefördert und beurteilt." },
        { to: "oda", text: "Auch die Pferdebranche hat eine OdA, die Bildungsplan und üK verantwortet." },
      ],
      sources: "Berufsvorstellung am Präsenztag 3 · Eckdaten: berufsberatung.ch",
    },
  ],

  /* =====================================================================
     LEHRZEIT-REISE – Ablaufplan der Lehrzeit für Berufsbildner/innen (Januar 2026)
     Perspektive: Lehrbetrieb / Berufsbildner/in. Roter Faden pro Etappe:
     Ziel → Schritte (chronologisch) → Ergebnis, das in die nächste Etappe überleitet.
     Schritt: t = was der Betrieb tut · d = Erklärung · when = Zeitpunkt
              tool = Checkliste/Formular (berufsbildung.ch/downloadcenter) · who = die lernende Person handelt selbst
     ===================================================================== */
  journeyIntro: {
    perspective: "Sicht Lehrbetrieb · Berufsbildner/in",
    text: "Sieben Etappen – vom Entscheid, Lernende auszubilden, bis zum Lehrabschluss. Jede Etappe baut auf der vorherigen auf.",
  },
  journey: [
    {
      icon: "🎓", title: "Voraussetzungen", short: "Voraus­setzungen", when: "bevor der Betrieb ausbildet",
      goal: "Der Betrieb darf und kann ausbilden.",
      items: [
        { t: "Kurs für Berufsbildner/innen (40 h) besuchen", d: "Der Kursausweis ist lebenslang gültig und wird in allen Kantonen anerkannt." },
        { t: "Bildungsbewilligung beantragen", d: "Beim Berufsbildungsamt des Lehrortskantons – im Kanton Luzern bei der DBW." },
        { t: "Rolle der Beteiligten klar definieren", d: "Berufsbildung ist eine Aufgabe mit Verantwortung: Ressourcen einplanen und die Aufgabe als Berufsbildner/in ins Stellenprofil aufnehmen." },
        { t: "Anforderungsprofil erstellen", d: "Wen suchen wir? Das Profil ist die Grundlage für die Rekrutierung.", tool: "Checkliste Anforderungsprofil" },
      ],
      result: "Bewilligung und Anforderungsprofil liegen vor – die Lehrstelle kann ausgeschrieben werden.",
    },
    {
      icon: "🔎", title: "Rekrutierung", when: "ca. 12–6 Monate vor Lehrstart",
      goal: "Die passende lernende Person finden – fair und transparent.",
      items: [
        { t: "Lehrstelle ausschreiben", when: "ca. 6–12 Monate vor Lehrstart", d: "Beim Berufsbildungsamt des Lehrortskantons. Verbundpartner-Commitment: Lehrstellen frühestens im August vor Lehrstart ausschreiben, vor September werden keine Lehrverträge genehmigt – für Chancengleichheit." },
        { t: "Bewerbungen prüfen, vorselektionieren und Gespräche führen", tool: "Checklisten Vorselektion · Vorstellungsgespräch" },
        { t: "Schnupperlehre planen und durchführen", when: "ca. 6–12 Monate vor Lehrstart", d: "Einblick in den Beruf und gegenseitiges Kennenlernen – vor dem Vertragsabschluss.", tool: "Checkliste Schnupperlehre · Formulare Programm, Bericht, Tagebuch" },
        { t: "Lernende Person auswählen", when: "ca. 6–12 Monate vor Lehrstart", tool: "Checkliste Selektionsverfahren · Formular Selektionsmappe" },
        { t: "Nachteilsausgleich und BM 1 klären", d: "Infos zum Nachteilsausgleich gibt das Berufsbildungsamt. Ist der Betrieb mit der BM 1 einverstanden, meldet sich die lernende Person selbst an.", who: "meldet sich selbst für die BM 1 an" },
        { t: "Lehrvertrag ausfüllen, unterschreiben und einreichen", when: "frühestens 12 Monate vor Lehrstart", d: "Auf Papier oder im digitalen Portal beim Berufsbildungsamt des Lehrortskantons.", tool: "Formular Lehrvertrag" },
      ],
      result: "Der Lehrvertrag ist eingereicht – jetzt wird die Lehre konkret geplant.",
    },
    {
      icon: "📋", title: "Lehre planen", when: "ca. 12 Monate bis 2 Wochen vor Lehrstart",
      goal: "Am ersten Tag ist alles bereit – im Betrieb und bei der lernenden Person.",
      items: [
        { t: "Betriebliche und individuelle Planung erstellen", when: "ca. 6–12 Monate vor Lehrstart", d: "Der Bildungsplan (SBFI) ist die verbindliche Grundlage.", tool: "Checklisten Ausbildungsprogramm · Planen der betrieblichen Grundbildung · Vorlage Individueller Bildungsplan" },
        { t: "Informationen zur Vorbereitung kommunizieren", when: "ca. 3 Monate vor Lehrstart", d: "z. B. Arbeitskleidung, Lehrmittel, üK-Termine, gebuchte Ferien, Lohnkonto, Versicherung." },
        { t: "Informationen zum Lehrstart kommunizieren", when: "ca. 2–4 Wochen vor Lehrstart", d: "Willkommensmail an die lernende Person." },
        { t: "Lehrstart planen und Arbeitsplatz vorbereiten", when: "ca. 2–4 Wochen vor Lehrstart", d: "Arbeiten für die erste Woche definieren.", tool: "Checklisten Vorbereitung erster Arbeitstag · erste Arbeitswoche" },
      ],
      result: "Arbeitsplatz, Programm und Informationen stehen – der Lehrstart kann kommen.",
    },
    {
      icon: "🚀", title: "Lehrstart im August", short: "Lehrstart", when: "erster Arbeitstag bis Ende Probezeit",
      goal: "Gut ankommen: Die lernende Person findet sich im Betrieb zurecht.",
      items: [
        { t: "Ersten Arbeitstag begleiten", d: "Vorstellungsrunde, Einführung, erste Aufgaben." },
        { t: "Erste Arbeitswoche begleiten", d: "z. B. Lerndokumentation erklären, Regelungen des Betriebs aufzeigen, wichtige Termine besprechen." },
        { t: "Bedarf an Stütz- und Freikursen abklären", when: "im ersten Semester oder bei Bedarf", d: "Die Möglichkeiten der Berufsfachschule prüfen." },
        { t: "Probezeitgespräch durchführen", when: "ca. 2 Wochen vor Ende der Probezeit", tool: "Vorlage Bericht Probezeitgespräch" },
      ],
      result: "Die Probezeit ist ausgewertet – jetzt beginnt der Ausbildungsalltag.",
    },
    {
      icon: "📈", title: "Ausbilden und Qualität sicherstellen", short: "Ausbilden & Qualität", when: "jedes Semester – die ganze Lehrzeit",
      goal: "Kompetenzen Schritt für Schritt aufbauen und den Stand regelmässig überprüfen.",
      items: [
        { t: "Semesterplanung besprechen", when: "zu Beginn jedes Semesters", d: "Erwartungen klären, Ziele für Betrieb, üK und Berufsfachschule definieren." },
        { t: "Lernende Person führen und aktiv kommunizieren", d: "In neue Aufgaben einführen, Wissen vermitteln, Rückmeldung auf erledigte Aufgaben geben, in Entscheidungen einbeziehen, Verantwortung übertragen." },
        { t: "Lerndokumentation / Portfolio prüfen und Feedback geben", when: "ca. 1× pro Monat", tool: "Checkliste Einführung Lerndokumentation · Vorlage Lernbericht" },
        { t: "Bildungsbericht ausfüllen und besprechen", when: "am Ende jedes Semesters", tool: "Formular Bildungsbericht" },
        { t: "Qualität überprüfen", when: "1× pro Jahr", tool: "Formular QualiCarte" },
        { t: "Fragebogen der lernenden Person auswerten", when: "am Ende des 1. Lehrjahres", tool: "QualiCarte-Fragebogen", who: "füllt den Fragebogen aus" },
        { t: "Aufnahme an die BM 2 klären", d: "Angebote des Lehrortskantons klären.", who: "meldet sich selbst für die BM 2 an" },
      ],
      always: {
        title: "Daueraufgaben während der ganzen Lehrzeit",
        list: [
          ["⚖️", "Rechtliche Grundlagen beachten", "BBG, BBV, ArG, OR, BiVo & Bildungsplan (inkl. Arbeitssicherheit), DSG, ArGV 5, BehiG, GAV – alle unter fedlex.admin.ch"],
          ["🤝", "Lernende Person unterstützen", "Nachteilsausgleich, Case Management Berufsbildung, FiB für EBA, Stützkurse"],
          ["📅", "Abwesenheiten handhaben", "üK-Tage, Ferien, Kompensation, Militär/Zivildienst, Krankheit/Unfall, Jugendurlaub …"],
          ["💬", "Führen und motivieren", "Gesprächsführung, Feedback, Zielvereinbarungen, Praxisaufträge, Coaching, Gleichstellung, Talentförderung"],
          ["🛟", "Mit Herausforderungen umgehen", "Mobbing, Rassismus, Sucht, Depression, sexuelle Belästigung, Gewalt, Prüfungsangst, ungenügende Leistungen, fehlende Motivation"],
        ],
        note: "Berufsbildungsamt, OdA und Fachstellen unterstützen bei Fragen. Vor einer Lehrvertragsauflösung das Berufsbildungsamt früh einbeziehen.",
      },
      result: "Bildungsberichte und Lerndokumentation zeigen den Stand – im letzten Lehrjahr rückt das QV in den Fokus.",
    },
    {
      icon: "🏁", title: "Qualifikationsverfahren", short: "Qualifikations­verfahren", when: "letztes Lehrjahr",
      goal: "Die lernende Person geht gut vorbereitet ins QV.",
      items: [
        { t: "Bedarf Nachteilsausgleich für das QV abklären", when: "spätestens im September vor dem QV", d: "Gesuch beim Berufsbildungsamt des Lehrortskantons einreichen. Die Frist kann kantonal variieren." },
        { t: "Lernende Person zum QV anmelden", when: "ca. 10 Monate vor dem QV", d: "Nicht in jedem Kanton erforderlich, die Frist kann kantonal variieren." },
        { t: "Bei der QV-Vorbereitung unterstützen", when: "ca. 10 Monate vor dem QV", d: "Beim Lernen unterstützen, Zeit und Material bereitstellen. Bei vielen Berufen ist die Lerndokumentation im QV zugelassen." },
        { t: "IPA / VPA begleiten", when: "im letzten Semester" },
      ],
      alt: "QV nicht bestanden? Das Berufsbildungsamt für die Anmeldung kontaktieren und die ungenügenden Positionen wiederholen – mit oder ohne Lehrzeitverlängerung.",
      result: "Das QV ist abgelegt – jetzt geht es um den Übergang ins Berufsleben.",
    },
    {
      icon: "🎉", title: "Austritt / Anstellung", when: "ca. 6 Monate bis Lehrabschluss",
      goal: "Ein sauberer Abschluss und ein guter Übergang.",
      items: [
        { t: "Austritt oder Anstellung planen", when: "ca. 6 Monate vor Lehrabschluss", tool: "Checkliste Austritt" },
        { t: "Lehrzeugnis erstellen und Abschlussgespräch führen", when: "ca. 1 Monat vor Lehrabschluss", tool: "Checkliste Lehrzeugnis" },
        { t: "Den erfolgreichen Abschluss feiern" },
      ],
      result: "Geschafft – aus der lernenden Person ist eine Fachperson geworden. Und mit der nächsten Lehrstelle beginnt die Reise von vorn.",
    },
  ].map((j) => ({ ...j, source: "Ablaufplan der Lehrzeit für Berufsbildner/innen (Januar 2026) · Checklisten & Formulare: berufsbildung.ch/downloadcenter" })),

  /* =====================================================================
     LEXIKON
     ===================================================================== */
  lexikon: [
    ["ABU", "Allgemeinbildender Unterricht an der Berufsfachschule – Grundlage ist der Rahmenlehrplan."],
    ["Anforderungsprofil", "Zeigt die schulischen Anforderungen eines Berufs – Grundlage für die Lehrstellenbesetzung."],
    ["ArG", "Arbeitsgesetz – regelt u. a. Arbeits- und Ruhezeiten sowie den Gesundheitsschutz."],
    ["ArGV 5", "Jugendarbeitsschutzverordnung – Art. 4 regelt gefährliche Arbeiten für Jugendliche."],
    ["Ausbildungskonzept", "Legt fest, wie der Betrieb ausbildet – wird nur einmal erstellt und pro lernende Person konkret umgesetzt."],
    ["Basic Check", "Kostenpflichtige Eignungsanalyse: Sprache, Mathematik und basale kognitive Fähigkeiten."],
    ["BB", "Berufsbildner/in – bildet die Lernenden im Lehrbetrieb aus."],
    ["BBG", "Berufsbildungsgesetz – gestützt auf Bundesverfassung Art. 63."],
    ["BBV", "Berufsbildungsverordnung – konkretisiert das BBG."],
    ["BehiG", "Behindertengleichstellungsgesetz."],
    ["Beurteilungsfehler", "Wahrnehmungsfehler, die eine Beurteilung verzerren – z. B. erster Eindruck, Halo-Effekt, Sympathie."],
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
    ["Gleichstellungsgesetz", "Gleichstellung von Frau und Mann im Erwerbsleben – Massstab auch für Lehrstellenausschreibungen."],
    ["Halo-Effekt", "«Heiligenschein»: Ein einzelnes Merkmal überstrahlt alle anderen – positiv oder negativ."],
    ["Handlungskompetenz", "Fach-, Methoden-, Sozial- und Selbstkompetenz zum Bewältigen beruflicher Handlungssituationen."],
    ["HF", "Höhere Fachschule – Diplom HF."],
    ["HFP", "Eidg. höhere Fachprüfung – eidg. Diplom."],
    ["IB", "Individuelle Begleitung – erweiterte Unterstützung für EBA-Lernende."],
    ["IPA", "Individuelle praktische Arbeit – Teil des Qualifikationsverfahrens."],
    ["Lehraufsicht", "Gesetzlicher Auftrag des Kantons – von der Lehrvertragsunterzeichnung bis zum QV."],
    ["Lerndokumentation", "Von den Lernenden geführt – Lernberichte mind. 1x pro Monat."],
    ["Lernpartnerschaft", "Erfahrene Lernende begleiten neue Lernende – mit klaren Rahmenbedingungen und Terminen."],
    ["LOK", "Lernortkooperation – Zusammenarbeit von Betrieb, Berufsfachschule und üK."],
    ["Lostly", "Unterstützungsangebot der DBW für Lernende im Kanton Luzern."],
    ["Multicheck", "Kostenpflichtige Eignungsanalyse – neun Varianten für unterschiedliche Berufsgruppen."],
    ["Nachteilsausgleich", "Ausgleich für Lernende mit Beeinträchtigung – auch im QV, rechtzeitig beantragen."],
    ["OdA", "Organisation der Arbeitswelt – Berufsverbände, verantwortlich für Inhalte und üK."],
    ["OR", "Obligationenrecht – regelt den Lehrvertrag als Einzelarbeitsvertrag."],
    ["PEX", "Prüfungsexpert/in im Qualifikationsverfahren."],
    ["Praxisbildner/in", "Fachperson, die Lernende im Arbeitsalltag anleitet – in Absprache mit der Berufsbildnerin oder dem Berufsbildner."],
    ["QualiCarte", "Instrument zur Qualitätsprüfung im Lehrbetrieb – 1x pro Jahr."],
    ["QV", "Qualifikationsverfahren – Abschluss der beruflichen Grundbildung."],
    ["SB / SB Plus", "Schulische Begleitung für EBA-Lernende – im bzw. ausserhalb des Unterrichts."],
    ["SBFI", "Staatssekretariat für Bildung, Forschung und Innovation – Vorgaben des Bundes."],
    ["Schnupperlehre", "Einblick in Beruf und Betrieb vor dem Lehrvertrag – in der Theorie 3 bis 5 Tage, immer betreut."],
    ["SDBB", "Schweizerisches Dienstleistungszentrum Berufsbildung – Formulare wie Bildungsbericht."],
    ["Stellwerk", "Obligatorischer Online-Test im 8. und 9. Schuljahr – ergibt ein persönliches Leistungsprofil."],
    ["üK", "Überbetriebliche Kurse – 3. Lernort, grundlegende Fertigkeiten."],
    ["UVG", "Unfallversicherungsgesetz."],
    ["VPA", "Vorgegebene praktische Arbeit – Teil des Qualifikationsverfahrens."],
    ["ZEBI", "Zentralschweizer Bildungsmesse – Bühne fürs Lehrstellenmarketing."],
  ],

  /* Ausführliche Erklärungen fürs Lexikon (Klick auf einen Begriff).
     Dazu zeigt die App automatisch: Stellen im Kurs, betroffene Rollen, verwandte Begriffe. */
  lexikonMehr: {
    "ABU": "Der allgemeinbildende Unterricht gehört zu jeder beruflichen Grundbildung und findet an der Berufsfachschule statt. Er stärkt Sprache, Kommunikation und Gesellschaft. Im QV ist die Allgemeinbildung ein eigener Qualifikationsbereich – bei Informatiker/innen EFZ zählt sie 20 %.",
    "ArG": "Das Arbeitsgesetz schützt Arbeitnehmende – Jugendliche ganz besonders. Für Lernende wichtig sind Arbeits- und Ruhezeiten und der Gesundheitsschutz. Die BiVo hält fest, ob ein Beruf eine Ausnahme braucht (bei Informatiker/innen: keine).",
    "ArGV 5": "Die Jugendarbeitsschutzverordnung verbietet Jugendlichen gefährliche Arbeiten. Art. 4 erlaubt Ausnahmen ab 15 Jahren – aber nur, wenn die BiVo des Berufs das vorsieht und die begleitenden Massnahmen (Ausbildung, Anleitung, Überwachung) eingehalten werden.",
    "BB": "Berufsbildner/innen bilden im Lehrbetrieb aus: Bildungsverlauf planen, Ziele festlegen, instruieren, begleiten und beurteilen. Sie sind Coach, Fachperson und Vorbild. Voraussetzung: der Kurs für Berufsbildner/innen (40 h) und die fachlichen Anforderungen der BiVo.",
    "BBG": "Das Berufsbildungsgesetz ist das Dach der ganzen Berufsbildung – gestützt auf Art. 63 der Bundesverfassung. Es regelt die Grundbildung, die höhere Berufsbildung und die Aufgaben von Bund, Kantonen und OdA. Art. 20: Lehrbetriebe setzen sich für den Lernerfolg ein und überprüfen ihn.",
    "BBV": "Die Berufsbildungsverordnung führt das BBG im Detail aus und steht in der Gesetzespyramide direkt darunter – über den Bildungsverordnungen der einzelnen Berufe.",
    "BehiG": "Das Behindertengleichstellungsgesetz soll Benachteiligungen verhindern. In der Berufsbildung zeigt es sich vor allem im Nachteilsausgleich – auch im Qualifikationsverfahren.",
    "BFS": "Die Berufsfachschule ist der 2. Lernort: Berufskenntnisse, Allgemeinbildung (ABU) und Sport, meist ein Tag pro Woche. Sie bietet Stütz- und Freikurse und den Help Point. Ihr Zeugnis fliesst in den Bildungsbericht ein.",
    "Bildungsbericht": "Am Ende jedes Semesters halten Berufsbildner/in und Lernende fest, wo die Ausbildung steht. Er stützt sich auf die Leistungen in Betrieb, Berufsfachschule und üK. Massnahmen werden mit Fristen vereinbart und im nächsten Bericht überprüft. Alle unterschreiben.",
    "Bildungsbewilligung": "Ohne Bildungsbewilligung darf ein Betrieb keine Lernenden ausbilden. Sie wird beim Berufsbildungsamt des Lehrortskantons beantragt – in Luzern bei der DBW, die sie auch wieder entziehen kann.",
    "BiPla / Bipla": "Der Bildungsplan konkretisiert die BiVo: Handlungskompetenzbereiche → Handlungskompetenzen → Leistungsziele je Lernort, mit Taxonomiestufen K1 bis K6. Die OdA erarbeitet ihn, das SBFI genehmigt ihn. Er ist die verbindliche Grundlage für die Planung im Betrieb.",
    "BiVo": "Die Bildungsverordnung ist das «Gesetz» eines einzelnen Berufs: Dauer, Lernorte, Arbeitssicherheit, Anforderungen an Berufsbildner/innen, Höchstzahl Lernende, Lerndokumentation, Bildungsbericht und QV. Das SBFI erlässt sie; alle 5 Jahre wird sie überprüft.",
    "BIZ": "Das Berufsinformationszentrum berät zu Berufswahl und Laufbahn – laut Kurs u. a. mit Kurzberatungen zu Grundkompetenzen.",
    "BM 1 / BM 2": "Die Berufsmaturität ergänzt das EFZ mit erweiterter Allgemeinbildung und öffnet den Weg an die Fachhochschule. Die BM 1 läuft während der Lehre – die Lernenden melden sich selbst an, mit Einverständnis des Betriebs. Die BM 2 folgt nach dem Abschluss.",
    "BP": "Die eidgenössische Berufsprüfung gehört zur höheren Berufsbildung. Wer besteht, erhält einen eidgenössischen Fachausweis.",
    "BV": "Die Bundesverfassung steht zuoberst in der Gesetzespyramide. Art. 63 erlaubt dem Bund, Vorschriften über die Berufsbildung zu erlassen – darauf stützt sich das BBG.",
    "DBW": "Die Dienststelle Berufs- und Weiterbildung setzt die Grundbildung im Kanton Luzern um: Lehraufsicht, Lehrverträge genehmigen, Bildungsbewilligungen, rechtliche Beratung, Gespräche mit allen Vertragsparteien, Lostly und Help Point. Früh beiziehen – «Sie stehen nicht alleine da!»",
    "DSG": "Das Datenschutzgesetz regelt den Umgang mit Personendaten – auch mit Bewerbungsunterlagen und Bildungsberichten von Lernenden.",
    "EBA": "Die zweijährige Grundbildung schliesst mit dem eidgenössischen Berufsattest ab. EBA-Lernende können fachkundige individuelle Begleitung (FiB) sowie schulische und individuelle Begleitung (SB, IB) erhalten.",
    "EFZ": "Die drei- bis vierjährige Grundbildung schliesst mit dem eidgenössischen Fähigkeitszeugnis ab. Zusammen mit der Berufsmaturität öffnet sie den Weg an die Fachhochschule. Beispiel: Informatiker/in EFZ – 8 Semester.",
    "FH": "Fachhochschulen gehören zur Tertiärstufe und bieten praxisnahe Studiengänge. Aus der Berufsbildung führt der Weg typischerweise über EFZ und Berufsmaturität.",
    "FiB": "Die fachkundige individuelle Begleitung unterstützt EBA-Lernende, die den Ausbildungserfolg sonst gefährden würden – nicht nur schulisch, sondern im ganzen Lehrverhältnis.",
    "GAV": "Ein Gesamtarbeitsvertrag zwischen Arbeitgeber- und Arbeitnehmerverbänden regelt z. B. Lohn, Ferien und Arbeitszeit einer Branche. Lehrbetriebe müssen ihn beachten.",
    "Handlungskompetenz": "Handlungskompetent ist, wer berufliche Situationen selbstständig bewältigt. Der Bildungsplan beschreibt dafür vier Dimensionen: Fach-, Methoden-, Sozial- und Selbstkompetenz.",
    "HF": "Höhere Fachschulen gehören zur höheren Berufsbildung und vertiefen Fach- und Führungswissen. Abschluss: Diplom HF.",
    "HFP": "Die eidgenössische höhere Fachprüfung ist die anspruchsvollste Prüfung der höheren Berufsbildung. Abschluss: eidgenössisches Diplom.",
    "IB": "Die individuelle Begleitung unterstützt EBA-Lernende mit erhöhtem Bedarf – über die schulische Begleitung hinaus.",
    "IPA": "Bei der individuellen praktischen Arbeit erledigt die lernende Person einen echten Auftrag im eigenen Betrieb; Prüfungsexpert/innen bewerten sie. Bei Informatiker/innen EFZ: 70–90 Stunden, 40 % der Gesamtnote – Ausführung 50 %, Dokumentation 20 %, Präsentation & Fachgespräch 30 %.",
    "Lehraufsicht": "Der Kanton beaufsichtigt jedes Lehrverhältnis – von der Unterzeichnung des Lehrvertrags bis zum QV. In Luzern ist das die DBW: Sie berät, vermittelt bei Problemen und greift ein, wenn der Ausbildungserfolg gefährdet ist.",
    "Lerndokumentation": "Die Lernenden halten darin laufend fest, was sie gelernt und gearbeitet haben – Lernberichte mind. 1x pro Monat. Berufsbildner/innen prüfen sie regelmässig und geben Feedback. Bei Informatiker/innen darf sie an der IPA als Hilfsmittel verwendet werden.",
    "LOK": "Lernortkooperation heisst: Betrieb, Berufsfachschule und üK arbeiten zusammen, damit Theorie und Praxis zueinander passen. Zeugnisse und üK-Leistungen fliessen in den Bildungsbericht ein.",
    "Lostly": "Ein Unterstützungsangebot der DBW, an das sich Lernende im Kanton Luzern wenden können – eine Anlaufstelle, wenn es in der Lehre schwierig wird.",
    "Nachteilsausgleich": "Lernende mit einer Beeinträchtigung (z. B. Legasthenie) erhalten angepasste Bedingungen, damit sie zeigen können, was sie wirklich können. Für das QV muss er rechtzeitig beantragt werden – spätestens im September vor dem QV.",
    "OdA": "Organisationen der Arbeitswelt sind die Berufs- und Branchenverbände. Sie erarbeiten BiVo, Bildungsplan und Ausbildungsprogramm, führen die überbetrieblichen Kurse durch und unterstützen die Betriebe. In der Informatik: ICT-Berufsbildung Schweiz.",
    "OR": "Das Obligationenrecht regelt den Lehrvertrag als besonderen Einzelarbeitsvertrag: befristet, zwingend schriftlich und von der kantonalen Behörde genehmigt.",
    "PEX": "Prüfungsexpert/innen nehmen im Qualifikationsverfahren die Prüfungen ab und bewerten sie – z. B. die IPA mit Präsentation und Fachgespräch.",
    "QualiCarte": "Mit der QualiCarte prüft der Lehrbetrieb einmal pro Jahr selbst die Qualität seiner Ausbildung. Die lernende Person füllt am Ende des 1. Lehrjahres einen eigenen Fragebogen aus.",
    "QV": "Das Qualifikationsverfahren schliesst die Grundbildung ab – mit einer praktischen Arbeit (IPA oder VPA), Erfahrungsnoten und Allgemeinbildung. Nicht bestanden? Berufsbildungsamt kontaktieren und die ungenügenden Positionen wiederholen.",
    "SB / SB Plus": "Die schulische Begleitung unterstützt EBA-Lernende an der Berufsfachschule – SB im Unterricht, SB Plus zusätzlich ausserhalb.",
    "SBFI": "Das Staatssekretariat für Bildung, Forschung und Innovation macht die Vorgaben des Bundes: Es erlässt die BiVo, genehmigt die Bildungspläne und steuert die Berufsbildung strategisch – gemeinsam mit Kantonen und OdA.",
    "SDBB": "Das Schweizerische Dienstleistungszentrum Berufsbildung stellt Formulare und Hilfsmittel bereit, z. B. den Bildungsbericht.",
    "üK": "Die überbetrieblichen Kurse sind der 3. Lernort: grundlegende Fertigkeiten und Transfer zwischen Theorie und Praxis. Die OdA führt sie durch, üK-Tage sind Arbeitszeit. Informatik: 35 Tage in 7 Kursen.",
    "UVG": "Das Unfallversicherungsgesetz – Lernende sind über den Lehrbetrieb gegen Unfälle versichert. Die Versicherungen gehören in den Lehrvertrag.",
    "VPA": "Bei der vorgegebenen praktischen Arbeit lösen alle Kandidierenden dieselben Aufgaben. Je nach Beruf ist sie die Alternative zur IPA.",
    /* --- Begriffe aus Kurstag 3 --- */
    "Anforderungsprofil": "Für jeden Beruf gibt es ein Anforderungsprofil mit den wichtigsten Kompetenzen in Mathematik, Schulsprache, Naturwissenschaften und Fremdsprachen – eingestuft von einfachen bis sehr hohen Anforderungen. Es hilft, vorzeitige Lehrvertragsauflösungen zu vermeiden, und dient als Grundlage im Bewerbungsgespräch. Alle Profile: anforderungsprofile.ch.",
    "Ausbildungskonzept": "Das Ausbildungskonzept beschreibt, wie der Betrieb seine Lernenden ausbildet. Es wird nur einmal erstellt. Bei jeder neuen lernenden Person überlegt man lediglich, wie man es konkret umsetzt – in sieben Schritten vom individuellen Ausbildungsplan bis zur Infrastruktur.",
    "Basic Check": "Der Basic Check ist eine Eignungsanalyse für die Lehrstellensuche. Er erhebt Sprachkenntnisse, Mathematikfähigkeiten und basale kognitive Fähigkeiten, dauert je nach Modulwahl rund 2.5 bis 3.5 Stunden und kostet CHF 100.– (Stand 2025).",
    "Beurteilungsfehler": "Beurteilen ist schwierig: Wahrnehmungsfehler verzerren das Bild. Häufig sind der erste und letzte Eindruck, der Halo-Effekt sowie Sympathie und Antipathie. Ganz vermeiden lassen sie sich nicht – aber verringern: bewusstmachen, Beobachtungen notieren, systematisch vorgehen und die Entscheidung mit anderen besprechen.",
    "Gleichstellungsgesetz": "Das Gleichstellungsgesetz soll die tatsächliche Gleichstellung von Frau und Mann im Erwerbsleben fördern. Im Kurs haben wir damit unsere Lehrstellenausschreibungen geprüft: Sprechen sie alle an – oder zementieren sie Rollenbilder wie bei der «Arztsekretärin»?",
    "Halo-Effekt": "«Halo» heisst Heiligenschein; auf Deutsch spricht man auch vom Überstrahlungseffekt. Ein einzelnes positives oder negatives Merkmal bestimmt das ganze Urteil über eine Person. Beispiel: ein fleckiges Oberteil im Bewerbungsgespräch – und schon nimmt man an, die Person arbeite auch nicht sauber.",
    "Lernpartnerschaft": "In einer Lernpartnerschaft begleiten erfahrene Lernende die Neuen. Dafür geeignete Lernende suchen, ihnen Rahmenbedingungen, Sinn und Zweck erklären, Termine festlegen und auch ihr Arbeitsteam über die neue Aufgabe informieren.",
    "Multicheck": "Der Multicheck ist eine Eignungsanalyse, die von Lehrbetrieben oft verlangt wird. Es gibt neun verschiedene Multichecks für unterschiedliche Berufsgruppen; er kostet zwischen CHF 60 und 100 (Stand 2025).",
    "Praxisbildner/in": "Praxisbildner/innen sind Fachpersonen, die Lernende in ihrer Abteilung im Alltag anleiten. Die Berufsbildnerin oder der Berufsbildner legt mit ihnen die Tätigkeiten der Lernphasen fest und teilt ihnen die Termine für Zwischen- und Beurteilungsgespräche mit.",
    "Schnupperlehre": "Die Schnupperlehre hilft beiden Seiten bei der Entscheidung: Jugendliche erleben den Beruf und die Atmosphäre im Betrieb, der Betrieb sieht rasch, ob grundlegende Fähigkeiten vorhanden sind. In der Theorie dauert sie 3 bis 5 Tage, in der Praxis oft nur einen. Am Schluss stehen ein Gespräch und ein Beurteilungsbogen, den die Jugendlichen mitnehmen.",
    "Stellwerk": "Stellwerk 8 und 9 ist eine online-basierte Standortbestimmung in Deutsch, Mathematik, Natur und Technik, Französisch und Englisch – obligatorisch für alle im 8. und 9. Schuljahr und im Schulzeugnis vermerkt. Berufsbildner/innen dürfen um die Resultate bitten und sie mit dem Anforderungsprofil des Berufs abgleichen.",
    "ZEBI": "Die Zentralschweizer Bildungsmesse ist ein Treffpunkt für Jugendliche in der Berufswahl. Für Lehrbetriebe ist die Teilnahme ein Weg, aktiv auf Schülerinnen und Schüler zuzugehen – neben Schulbesuchen, Zukunftstag und Schnupperlehren.",
  },

  /* =====================================================================
     ARENA – BOSSKAMPF
     ===================================================================== */
  boss: { name: "Der PrintNightmare-Drucker" },
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
    { q: "Wie lange dauert eine Schnupperlehre in der Theorie?", a: ["Einen halben Tag", "3 bis 5 Tage", "2 Wochen", "Einen Monat"], correct: 1, why: "In der Praxis ist es aus Zeitmangel oft nur ein Tag – betreut werden die Jugendlichen immer." },
    { q: "Was beschreibt der Halo-Effekt?", a: ["Der letzte Eindruck zählt am meisten", "Ein Merkmal überstrahlt alle anderen", "Sympathische Personen werden strenger beurteilt", "Man beurteilt alle gleich"], correct: 1, why: "«Heiligenschein»: Ein einzelnes positives oder negatives Merkmal färbt das ganze Urteil." },
    { q: "Welcher Test ist im 8. und 9. Schuljahr für alle obligatorisch?", a: ["Multicheck", "Basic Check", "Stellwerk", "IPA"], correct: 2, why: "Stellwerk 8 und 9 ergibt ein persönliches Leistungsprofil – im Schulzeugnis vermerkt." },
    { q: "Wozu dient ein Anforderungsprofil?", a: ["Es ersetzt den Lehrvertrag", "Es zeigt die schulischen Anforderungen eines Berufs", "Es legt den Lohn fest", "Es benotet die Schnupperlehre"], correct: 1, why: "Grundlage für die Lehrstellenbesetzung – und hilft, Lehrvertragsauflösungen zu vermeiden." },
    { q: "Was tust du gleich nach der Verabschiedung im Bewerbungsgespräch?", a: ["Den Lehrvertrag ausfüllen", "Eindruck und Beobachtungen schriftlich festhalten", "Die Eltern anrufen", "Nichts – das Bauchgefühl reicht"], correct: 1, why: "So erinnerst du dich auch später noch – und verringerst Beurteilungsfehler." },
    { q: "Wie oft erstellst du das Ausbildungskonzept?", a: ["Für jede lernende Person neu", "Jedes Semester", "Nur einmal", "Gar nie – das macht die OdA"], correct: 2, why: "Einmal erstellen – bei neuen Lernenden nur noch überlegen, wie man es konkret umsetzt." },
    { q: "Welcher Content bringt im Social-Media-Marketing die besten Resultate?", a: ["Blog Posts", "Infografiken", "Texte und Zitate", "Video"], correct: 3, why: "Video liegt mit 63 % vorne – darum: Videobotschaften statt Inserate." },
    { q: "Wer bestimmt die Reihenfolge, in der die Fähigkeiten im Betrieb erlernt werden?", a: ["Das SBFI", "Die Berufsbildnerin / der Berufsbildner", "Die Berufsfachschule", "Die Lernenden"], correct: 1, why: "BiVo und BiPla geben die Ziele vor – die Reihenfolge im Betrieb planst du, abgestimmt auf Schule und üK." },
    { q: "🐴 Wie lange dauert die Lehre als Pferdefachmann/-frau EFZ?", a: ["2 Jahre", "3 Jahre", "4 Jahre", "Bis das Pferd nickt"], correct: 1, why: "3 Jahre – und auch im Stall gelten BiVo, Bildungsplan und drei Lernorte." },
    { q: "💻 Wie viele üK-Tage haben Informatik-Lernende?", a: ["10 Tage", "20 Tage", "35 Tage in 7 Kursen", "50 Tage"], correct: 2, why: "BiVo Art. 8 – 7 Kurse à 5 Tage, im letzten Semester keine üK." },
    { q: "💻 Wie oft kontrolliert die Berufsbildnerin die Lerndokumentation einer Informatik-Lernenden mindestens?", a: ["Jede Woche", "1x pro Semester", "1x pro Lehrjahr", "Nur vor der IPA"], correct: 1, why: "BiVo Art. 12 – kontrollieren, unterzeichnen und besprechen." },
    { q: "💻 Warum enthält die BiVo Informatiker/in keine Abweichung vom Arbeitsgesetz?", a: ["Weil sie vergessen wurde", "Weil Informatiker/innen keine gefährlichen Arbeiten ausführen", "Weil Lernende über 18 sind", "Weil der Kanton das regelt"], correct: 1, why: "Es braucht keine Ausnahme vom Verbot gefährlicher Arbeiten." },
    { q: "💻 Wie lange dauert die IPA bei Informatiker/innen EFZ?", a: ["8–16 Stunden", "24–40 Stunden", "70–90 Stunden", "200 Stunden"], correct: 2, why: "BiVo Art. 18 – Ausführung 50 %, Doku 20 %, Präsentation & Fachgespräch 30 %." },
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
    { s: "💻 Ein Informatik-Lernender führt seine Lerndokumentation trotz Feedbackgespräch seit Monaten nicht nach.", level: 1, why: "Wiederholt trotz Gespräch → mittlerer Verstoss: formelles Gespräch und schriftliche Massnahmen mit Fristen." },
  ],
  duellLevels: [
    { icon: "🟢", lbl: "Leichter Verstoss" },
    { icon: "🟠", lbl: "Mittlerer Verstoss" },
    { icon: "🔴", lbl: "Schwerer Verstoss" },
    { icon: "🤝", lbl: "Weiterverweisen" },
  ],

  /* =====================================================================
     DEMO-MODUS – automatische Tour für die Präsentation (Taste D oder index.html#demo)
     sec   = Dauer der Station in Sekunden (Summe ≈ 7 Minuten; live mit + / − schneller oder langsamer)
     show  = was gezeigt wird: "title" · "menu" · "menu-arena" · "levels" · "level-2:Teil des Missionstitels"
             "beruf:Teil des Titels" · "chars:rollen-id" · "sheet:rollen-id" · "journey-2" · "lexikon:Begriff" · "boss"
     title / text = was ich dazu sage – hier die eigenen Erkenntnisse eintragen.
     ===================================================================== */
  demo: [
    { sec: 14, show: "title", kicker: "Einstieg", title: "Mein Take-away als Spiel", text: "Fünf Kurstage, zusammengefasst in einem Spiel: Jeder Kurstag ist ein Level, jede beteiligte Stelle eine Rolle. In ein paar Minuten zeige ich, was ich aus dem Kurs mitnehme." },
    { sec: 16, show: "menu", kicker: "Einstieg", title: "Zwei Welten: Wissen und Arena", text: "Links wird gelernt und nachgeschlagen, rechts gespielt und geprüft. Und ja – die Giraffe hat es auch ins Spiel geschafft." },
    { sec: 12, show: "levels", kicker: "Kurstage", title: "Jeder Kurstag ist ein Level", text: "Drei Tage sind gespielt, zwei folgen noch. Das Spiel wächst mit jedem Kurstag weiter." },
    { sec: 24, show: "level-1:Die Rollen des Berufsbildners", kicker: "Tag 1 · Grundlagen", title: "Meine Rolle: Coach und Fachperson", text: "Als Berufsbildner bin ich nicht nur Fachperson. Ich begleite den Lernprozess und bin Vorbild – und die erste Woche ist massgebend für alles, was folgt." },
    { sec: 20, show: "level-1:vs. Fachperson", kicker: "Tag 1 · Grundlagen", title: "Befähigen statt machen", text: "Mein wichtigster Merksatz aus Tag 1: Die Fachperson erledigt Aufgaben – der Berufsbildner entwickelt Kompetenzen und nutzt Fehler als Lernchance." },
    { sec: 22, show: "level-1:Die drei Lernorte", kicker: "Tag 1 · Grundlagen", title: "Drei Lernorte, ein Ziel", text: "Betrieb, Berufsfachschule und überbetriebliche Kurse bilden gemeinsam aus. Meine Aufgabe ist es, die drei Lernorte im Alltag zu verbinden." },
    { sec: 22, show: "level-1:Generationen im Vergleich", kicker: "Tag 1 · Lebenswelt", title: "Die Jugendlichen verstehen", text: "Lernende stecken mitten in grossen Entwicklungsaufgaben. Die Generation Z will befähigt werden, nicht kontrolliert." },
    { sec: 16, show: "chars:bb", kicker: "Rollen", title: "Wer macht was?", text: "Alle Beteiligten auf einem Mühlerad – vom Bund bis zu den Eltern. Jede Rolle hat eigene Aufgaben, Rechte und Pflichten." },
    { sec: 24, show: "sheet:bb", kicker: "Rollen", title: "Der Charakterbogen", text: "Pro Rolle sehe ich auf einen Blick: Aufgaben, Rechte, Pflichten – und mit wem sie zusammenarbeitet." },
    { sec: 22, show: "level-2:Der Lehrvertrag", kicker: "Tag 2 · Rechtstag", title: "Der Lehrvertrag", text: "Befristet, zwingend schriftlich und von der DBW genehmigt. Der Rechtstag hat mir gezeigt: Ich muss nicht alles auswendig wissen – aber wissen, wo es steht." },
    { sec: 24, show: "level-2:Das Interventionsschema", kicker: "Tag 2 · Rechtstag", title: "Das Interventionsschema", text: "Leicht, mittel oder schwer: Probleme früh erkennen, richtig einordnen und verhältnismässig handeln – statt wegzuschauen." },
    { sec: 18, show: "sheet:dbw", kicker: "Tag 2 · Rechtstag", title: "Ich stehe nicht alleine da", text: "Die DBW und die Fachstellen wollen früh einbezogen werden. Private Probleme von Lernenden muss ich nicht selbst lösen." },
    { sec: 22, show: "level-3:Die Schnupperlehre", kicker: "Tag 3 · Rekrutieren", title: "Die Schnupperlehre", text: "Sie hilft beiden Seiten bei der Entscheidung. Meine Beobachtungen halte ich auf dem Beurteilungsbogen fest und bespreche sie mit den Jugendlichen." },
    { sec: 24, show: "level-3:Häufige Beurteilungsfehler", kicker: "Tag 3 · Rekrutieren", title: "Beurteilungsfehler kennen", text: "Erster Eindruck, Halo-Effekt, Sympathie: Ganz vermeiden kann ich sie nicht – aber ich kann systematisch vorgehen und nicht alleine entscheiden." },
    { sec: 22, show: "level-3:Ausbildungsplanung in 7 Schritten", kicker: "Tag 3 · Planen", title: "Die Ausbildung planen, bevor sie beginnt", text: "Das Ausbildungskonzept erstelle ich nur einmal. Für jede neue lernende Person plane ich danach die konkrete Umsetzung in sieben Schritten." },
    { sec: 24, show: "beruf:Tag 3 angewendet", kicker: "Mein Beruf", title: "Angewendet: Informatiker/in EFZ", text: "Alles Allgemeine gilt für jeden Beruf. Konkret wird es erst mit der BiVo und dem Bildungsplan meines eigenen Berufs." },
    { sec: 10, show: "sheet:pferd", kicker: "Running Gag", title: "Und der Pferdefachmann?", text: "Auch im Stall gelten BiVo, Bildungsplan und drei Lernorte. Das System ist für alle Berufe dasselbe." },
    { sec: 24, show: "journey-2", kicker: "Lehrzeit-Reise", title: "Der rote Faden durch die Lehre", text: "Sieben Etappen von der Bildungsbewilligung bis zum Lehrabschluss – mit Zeitpunkt und Hilfsmittel zu jedem Schritt." },
    { sec: 18, show: "lexikon:Halo-Effekt", kicker: "Lexikon", title: "Nachschlagen statt auswendig lernen", text: "Zu jedem Begriff sehe ich, wo er im Kurs vorkam und welche Rollen er betrifft." },
    { sec: 22, show: "boss", kicker: "Arena", title: "Wissen prüfen im Bosskampf", text: "Gelerntes will geübt sein: Jede richtige Antwort patcht den PrintNightmare-Drucker ein Stück weiter." },
    { sec: 30, show: "menu", kicker: "Fazit", title: "Was ich mitnehme", text: "Befähigen statt machen. Früh hinschauen und Hilfe holen. Fair und systematisch auswählen. Und die Ausbildung planen, bevor sie beginnt." },
  ],

  /* Credits & Quellen – Titel, Herausgeber und Stand stammen aus den Kursunterlagen selbst
     (ausgelesen über den graphify-Wissensgraphen in graphify-out/). */
  credits: {
    version: "Version 1.1 · Stand November 2026 · Kurstage 1–3",
    author: "", // ← hier den eigenen Namen eintragen, dann erscheint er auf dem Credits-Screen
    about: [
      "Take-away aus dem Berufsbildnerkurs am Weiterbildungszentrum (WBZ) Kanton Luzern – eine spielerische Zusammenfassung der Kursinhalte für die Präsentation am letzten Kurstag.",
      "Beispielberuf: Informatiker/in EFZ. Die allgemeinen Inhalte gelten für alle Berufe.",
      "Kulisse: Luzern am Vierwaldstättersee mit Kapellbrücke, Wasserturm, Museggmauer, Hofkirche und Pilatus – frei nachempfunden.",
    ],
    sources: [
      {
        group: "Kursunterlagen Präsenztag 1",
        items: [
          ["Präsenztag 1: Grundlagen Berufsbildung, Bildungslandschaft & Lebenswelt der Jugendlichen (Präsentation)", "WBZ Kanton Luzern"],
          ["Planung und Umsetzung der betrieblichen Bildung", "WBZ Kanton Luzern"],
          ["Ablaufplan der Lehrzeit für Berufsbildner/innen (Stand Januar 2026)", "berufsbildung.ch · Downloadcenter"],
          ["Bildungssystem Schweiz – Schaubild (2026)", "SBFI"],
          ["Glossar zum Bildungssystem der Schweiz", "WBZ Kanton Luzern"],
          ["Tabelle «Meine Rolle als Berufsbildner/in» und Vorlage Reflexionen", "WBZ Kanton Luzern"],
        ],
      },
      {
        group: "Kursunterlagen Präsenztag 2 – Rechtstag",
        items: [
          ["Präsenztag 2 – Rechtstag: Rahmenbedingungen der Berufsbildung (Präsentation)", "WBZ Kanton Luzern"],
          ["Bildungsverordnung Informatikerin/Informatiker EFZ (SR 412.101.220.10), in Kraft seit 1. Januar 2021", "SBFI"],
          ["Bildungsplan Informatikerin/Informatiker EFZ (88611)", "ICT-Berufsbildung Schweiz"],
          ["Auftrag «Fragen zur Bildungsverordnung» mit Antworten", "WBZ Kanton Luzern"],
          ["Mini-Fallbeispiele zu Interventionen", "WBZ Kanton Luzern"],
        ],
      },
      {
        group: "Kursunterlagen Präsenztag 3 – Rekrutieren & Planen",
        items: [
          ["Präsenztag 3: Lernende treffsicher rekrutieren, Lernumgebungen vorbereiten & Ausbildungspläne erstellen (Präsentation)", "WBZ Kanton Luzern"],
          ["Grundlagen zur Schnupperlehre · Fallbeschreibung und Bewerbungsunterlagen Marco Gut (Aufgabe 1)", "WBZ Kanton Luzern"],
          ["Schnupperlehre: Beurteilung durch den Lehrbetrieb (Beurteilungsbogen, Stand 08/25)", "BIZ · Dienststelle Berufs- und Weiterbildung"],
          ["Grundlagen zum Bewerbungsgespräch (Aufgabe 2)", "WBZ Kanton Luzern"],
          ["Grundlagen zu häufigen Beurteilungsfehlern (Aufgabe 3)", "WBZ Kanton Luzern"],
        ],
      },
      {
        group: "In den Unterlagen zitiert",
        items: [
          ["Handbuch betriebliche Grundbildung (Knutti, Dirren & Lehmann, 2019)", "SDBB"],
          ["Hurrelmann & Quenzel (2016)", "zitiert in Präsenztag 1"],
          ["Merck Jugendbarometer 2025", "zitiert in Präsenztag 1"],
          ["Berufsbildung Luzern in Zahlen 2025", "zitiert in Präsenztag 2"],
          ["Yousty – Umfrage «Welcher Content?» · anforderungsprofile.ch · jobskills.ch", "zitiert in Präsenztag 3"],
          ["Eckdaten Pferdefachmann/-frau EFZ (Bonus-Rolle)", "berufsberatung.ch"],
        ],
      },
    ],
    tech: [
      ["3D-Grafik", "Three.js r149 (WebGL) · © 2010–2023 three.js authors · MIT-Lizenz"],
      ["3D-Welt & Figuren", "komplett im Code modelliert – keine fremden Modelle oder Texturen (auch Giraffe und Pony)"],
      ["Sound", "live erzeugt mit der Web Audio API – keine Audiodateien"],
      ["Schriften & Icons", "Systemschriften (Segoe UI, Bahnschrift) und System-Emoji – nicht mitgeliefert"],
      ["Technik", "HTML, CSS und JavaScript ohne Framework · läuft offline im Browser"],
      ["Werkzeuge", "programmiert mit Unterstützung von Claude Code (Anthropic) · Kursunterlagen als Wissensgraph mit graphify erschlossen"],
    ],
    keys: [
      [["←", "→", "↑", "↓"], "Auswahl bewegen"],
      [["D"], "Demo-Modus: automatische Tour (Leertaste = Pause, ← → = Station, + − = Tempo)"],
      [["Enter"], "Öffnen / bestätigen"],
      [["Esc"], "Zurück"],
      [["1–8"], "Direktwahl im Menü"],
      [["M"], "Ton an / aus"],
      [["C"], "Credits (im Hauptmenü)"],
    ],
    thanks: "Danke an die Kursleitung des WBZ Kanton Luzern und an alle Mitlernenden für den Austausch während des Kurses.",
    disclaimer: "Private Lernhilfe ohne Gewähr – kein offizielles Angebot des Kantons Luzern oder des WBZ. Wappen und Logo dienen nur der Illustration. Massgebend sind die geltenden Erlasse (BBG, BBV, BiVo, Bildungsplan) und die Vorgaben der Dienststelle Berufs- und Weiterbildung (DBW) Luzern.",
  },
};
