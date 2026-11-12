<!-- converted from WBZLU_BEKU_zielgerichtete_Instruktion_ausgefuellt.docx -->

Zielgerichtete Instruktion
Beschreiben Sie Ihre ausgesuchte Handlung zusammenfassend, sodass die Lernenden einen Gesamtüberblick erhalten:

Handlung: Ein neues Notebook für eine neue Mitarbeiterin / einen neuen Mitarbeiter bereitstellen (vom Auspacken bis zur Übergabe).
Warum ist das wichtig? Neue Mitarbeitende sollen am ersten Arbeitstag ein funktionierendes, sicheres Gerät erhalten. Der erste Eindruck von der IT entsteht genau hier. Ein sauber bereitgestelltes Gerät verhindert ausserdem Support-Fälle und Sicherheitslücken (z. B. fehlende Verschlüsselung oder Updates).
Wann setzen wir das ein? Bei jedem Eintritt, bei Geräteersatz (Defekt, Lifecycle-Wechsel) und bei Rollenwechseln. Es ist eine der häufigsten Aufgaben in unserem Team.
Aus meiner Erfahrung: Ich habe erlebt, wie ein neuer Mitarbeiter am ersten Tag vier Stunden warten musste, weil sein Gerät nicht bestellt war. Wir hatten zwar eine Checkliste, doch diese wurde nicht konsequent eingehalten. Seit wir konsequenter mit Checkliste und den Zuweisungen arbeiten, passiert das nicht mehr.
Ablauf: 1) Auftrag und Hardware prüfen – 2) Gerät bestellen und benennen – 3) Firmen-Image installieren – 4) Gerät in die Domäne aufnehmen und Gruppe/OU zuweisen – 5) Rollenspezifische Software und Peripherie einrichten – 6) Funktionstest, Dokumentation und Übergabe.
Vorgehen bei der Instruktion: Ich zeige jeden Schritt vor und sage laut, was ich mir dabei überlege. Manchmal lasse ich ihm auch ein paar Schritte selbstständig durchführen. Danach richtet er selbst ein Gerät ein (Arbeitsauftrag).

Notieren Sie sich hier Ihre Überlegungen zu den Teilschritten Ihrer Handlung:

| Schritt | Was mache ich? | Warum mache ich das? Warum mache ich es so und nicht anders? Worauf achte ich speziell? |
| --- | --- | --- |
| 1 | Auftrag und Hardware prüfen Ticket lesen: Name, Abteilung, Rolle, Eintrittsdatum, benötigte Software und Zubehör. Gerät auspacken, Lieferumfang und Zustand kontrollieren. | Warum: Nur wenn klar ist, für wen und wofür das Gerät ist, kann ich es richtig einrichten. Warum so: Fehlende Infos kläre ich jetzt beim Auftraggeber – nicht erst am Ende. Achtung: Transportschäden und fehlendes Zubehör (Netzteil, Dockingstation) sofort melden. |
| 2 | Gerät inventarisieren und benennen Seriennummer im Verkauf melden, Hostname Kleber anbringen, Gerätenamen nach Namenskonvention festlegen. | Warum: Wir müssen jederzeit wissen, wem welches Gerät gehört (Garantie, Lizenzen, Verlust). Warum so: Die Namenskonvention macht Geräte in AD/Intune eindeutig auffindbar. Achtung: Seriennummer zweimal kontrollieren – Tippfehler sind später schwer zu finden. |

| 3 | Firmen-Image installieren Gerät ans Netzwerk anschliessen und das Standard-Image über das Deployment-Tool installieren (z. B. Autopilot/Intune oder MDT/WDS). | Warum: Alle Geräte sollen gleich aufgebaut sein – das erleichtert Support und Sicherheit. Warum so: Das Image statt manueller Installation spart Zeit und verhindert vergessene Einstellungen. Achtung: Kabelgebundenes Netzwerk verwenden und das richtige Image (Standard vs. Spezial) wählen. |
| --- | --- | --- |
| 4 | In die Domäne aufnehmen und Gruppe/OU zuweisen Gerät in die Domäne bzw. Entra ID aufnehmen und in die OU/Gerätegruppe der Abteilung verschieben. | Warum: Über OU und Gruppe erhält das Gerät die richtigen Richtlinien und die Software. Warum so: Zuerst die Gruppe korrekt setzen, dann warten – sonst wird falsche oder keine Software verteilt. Achtung: Richtige OU wählen; Neustart und Richtlinien-Update (gpupdate) abwarten. |
| 5 | Rollenspezifische Software und Peripherie einrichten Zusätzliche Software gemäss Ticket installieren bzw. zuweisen, Drucker, Dockingstation und Bildschirme testen. | Warum: Die Person soll ab dem ersten Tag mit ihren Programmen arbeiten können. Warum so: Software möglichst über das Softwareportal/die Gruppe verteilen statt manuell – so bleibt sie verwaltet und aktualisierbar. Achtung: Lizenzen vorhanden? Keine privaten oder nicht freigegebenen Programme installieren. |
| 6 | Funktionstest, Dokumentation und Übergabe Mit einem Testkonto anmelden und alles testen (Netzwerk, VPN, Mail, Teams, Drucker). Ticket dokumentieren, Gerät übergeben und Kurz-Einführung geben. | Warum: Der Test zeigt Fehler, bevor die neue Person sie am ersten Tag entdeckt. Warum so: Ich teste mit Checkliste, damit ich nichts vergesse und das Vorgehen nachvollziehbar ist. Achtung: Testkonto danach abmelden, Übergabe unterschreiben lassen, Ticket erst dann schliessen. |
