# App-Projekt: Urlaubsplaner

## Produktidee
Die App ist ein einfacher, persönlicher Urlaubsplaner als Ersatz für lose Notizen. Ein Benutzer legt einen Urlaub an, wählt Jahr, Reiseziel, Anzahl der Personen sowie Start- und Enddatum. Aus dem Datumsbereich werden automatisch Urlaubstage erzeugt. Jeder Tag kann geplant werden, entweder strukturiert über Bereiche wie morgens, mittags und abends oder knapp über einen Freitext.

Die App soll bewusst klein und praktisch bleiben:
- schnell planbar
- mobil gut nutzbar
- auf dem Handy installierbar
- Daten geräteübergreifend verfügbar

## Zielgruppe
- Einzelpersonen, Paare oder Familien
- Nutzer, die ihren Urlaub nicht in allgemeinen Notizen-Apps verwalten wollen
- Nutzer, die pro Jahr mehrere Urlaube verwalten möchten

## Kernnutzen
- Ein Urlaub ist in klaren Tagen organisiert
- Pro Tag sieht man sofort, ob schon etwas geplant ist
- Wiederholungen wie "Meer" oder "Altstadt" werden als Hinweis erkannt
- Bestehende Planungen können übernommen werden:
  - von Tag zu Tag
  - von Urlaub zu Urlaub
  - von Jahr zu Jahr

## MVP-Umfang
Der erste funktionierende Stand der App soll Folgendes können:

1. Mehrere Urlaube verwalten
2. Urlaub anlegen mit:
   - Titel / Reiseziel
   - Jahr
   - Anzahl Personen
   - Startdatum
   - Enddatum
3. Tage automatisch aus dem Zeitraum erzeugen
4. Übersicht aller Tage eines Urlaubs
5. Pro Tag Planung bearbeiten:
   - Modus "einfach" mit Freitext
   - Modus "strukturiert" mit morgens / mittags / abends
   - optionale Kategorien wie essen, rausgehen, einkaufen, entspannen, sonstiges
6. Sichtbarer Status:
   - ungeplant
   - teilweise geplant
   - geplant
7. Daten in Firebase Firestore speichern
8. Responsive UI
9. PWA / installierbar auf dem Handy

## Optionale Erweiterungen nach MVP
- Hinweis bei Wiederholungen in nahen Tagen
- Tagesplanung aus anderem Tag übernehmen
- ganzen Urlaub als Vorlage übernehmen
- Vorschläge für Aktivitäten oder Orte
- externe Suche für Vorschläge, nur wenn kostenlos und technisch sinnvoll

## UX-Idee
- Startseite zeigt Liste aller Urlaube, gruppiert oder filterbar nach Jahr
- Klick auf einen Urlaub öffnet die Tagesübersicht
- Tage werden als Liste oder Accordion dargestellt
- Ein Tag zeigt im geschlossenen Zustand:
  - Datum
  - Kurzstatus
  - kurze Vorschau oder Badge
- Im geöffneten Zustand kann der Tag bearbeitet werden
- Für einfache Tage wie "Villa" oder "Meer" reicht ein kurzer Eintrag ohne Zwang zu vielen Details

## Datenmodell

### Trip
- id
- title
- destination
- year
- peopleCount
- startDate
- endDate
- notes
- createdAt
- updatedAt

### DayPlan
- id
- tripId
- date
- title
- mode (`simple` oder `structured`)
- summaryText
- morningText
- middayText
- eveningText
- tags / categories
- locationHint
- status (`empty`, `partial`, `planned`)
- copiedFromDayId
- createdAt
- updatedAt

## Technische Entscheidungen
- Frontend: Angular
- Styling: Bootstrap + Angular Material, aber schlicht einsetzen
- Backend / Sync: Firebase Firestore
- PWA: Angular PWA
- Architektur: kleine, verständliche Services und Standalone Components

## Nicht-Ziele
- keine Hotel- oder Flugbuchung
- keine große Karten-App
- keine komplexe KI-Planung im ersten Schritt
- keine Pflicht, jeden Tag vollständig auszufüllen

## Aktueller Projektstand
- Angular-22-Projekt mit Standalone-Setup ist vorhanden
- Bootstrap, Bootstrap Icons, Angular Material und Firebase sind als Pakete installiert
- `angular.json` bindet Bootstrap, Bootstrap Icons und ein Material-Theme bereits ein
- Eine erste Firebase-Basis ist vorhanden:
  - `src/app/firebase.config.ts`
  - `src/environments/environment.ts`
  - die Konfiguration enthält noch Platzhalterwerte und ist noch nicht final vereinheitlicht
- Das Datenmodell ist nur teilweise passend:
  - `Trip` und `DayPlan` existieren bereits
  - das Modell bildet die neue Produktidee noch nicht vollständig ab
  - mehrere Urlaube pro Jahr, Personenanzahl, einfacher vs. strukturierter Tagesmodus und Statusfelder fehlen noch
- Die UI ist noch ein technischer Platzhalter:
  - `app.html` zeigt aktuell nur eine sehr einfache Demo-Oberfläche
  - es gibt noch keine Urlaubsübersicht, kein Formular und keine Tagesliste
- Firestore-Services für echte Datenhaltung sind noch nicht vorhanden
- Routing ist noch nicht fachlich ausgebaut
- PWA ist noch nicht eingerichtet
- Der Git-Status ist bereits verändert; es gibt bestehende, nicht abgeschlossene Änderungen im Projekt
- Lokaler technischer Hinweis:
  - Angular 22 verlangt mindestens Node `22.22.3` oder `24.15.0`
  - die zuletzt verwendete Node-Version `24.13.0` reicht für `ng build` noch nicht

## Roadmap

### Phase 0: Projektbasis prüfen und aufräumen
- [x] Bestehenden Projektstand prüfen und dokumentieren
- [ ] `PLAN.md` als führende Aufgabenliste festlegen
- [ ] Datenmodell mit echter Produktidee abgleichen
- [ ] Firebase-Konfiguration finalisieren

### Phase 1: Datenmodell und Grundlage
- [ ] `Trip`-Modell auf mehrere Urlaube pro Jahr ausrichten
- [ ] `DayPlan`-Modell für einfachen und strukturierten Modus definieren
- [ ] Hilfslogik zum Erzeugen aller Urlaubstage aus Start- und Enddatum bauen
- [ ] Firestore-Datenstruktur für Trips und DayPlans festlegen
- [ ] `TripService` für CRUD auf Urlaube implementieren
- [ ] `DayPlanService` für CRUD auf Tagespläne implementieren

### Phase 2: Hauptnavigation und Basis-Views
- [ ] App-Routing für Urlaubsübersicht und Detailansicht anlegen
- [ ] Startseite mit Liste aller Urlaube erstellen
- [ ] Formular zum Anlegen eines neuen Urlaubs erstellen
- [ ] Urlaub-Detailseite mit Tagesliste anlegen
- [ ] Leere Zustände und Ladezustände ergänzen

### Phase 3: Tagesplanung
- [ ] Accordion- oder Listenkomponente für Tage erstellen
- [ ] Tagesstatus `empty`, `partial`, `planned` berechnen
- [ ] Editor für einfachen Tagesmodus mit Freitext bauen
- [ ] Editor für strukturierten Tagesmodus mit morgens / mittags / abends bauen
- [ ] Kategorien / Tags pro Tag integrieren
- [ ] Tagesdaten mit Firestore verbinden

### Phase 4: Produktlogik
- [ ] Übersicht für ungeplante und teilweise geplante Tage ergänzen
- [ ] Kurzvorschau geplanter Inhalte in der Tagesliste anzeigen
- [ ] Wiederholungs-Hinweise für ähnliche Aktivitäten in nahen Tagen einbauen
- [ ] Hinweis-Logik als optionale Info umsetzen, nicht als Fehler
- [ ] Tagesplanung von anderem Tag übernehmen ermöglichen
- [ ] Urlaub aus bestehendem Urlaub oder Vorjahr kopieren ermöglichen

### Phase 5: Mobile und Feinschliff
- [ ] Responsive Layout für Mobile zuerst sauber machen
- [ ] Formulare und Tagesansicht für kleine Displays optimieren
- [ ] PWA-Support einrichten
- [ ] Installierbarkeit und Offline-Grundverhalten prüfen
- [ ] visuelle Konsistenz und einfache UX verbessern

### Phase 6: Optionale Erweiterungen
- [ ] Einfache Vorschlagslogik ohne externe Suche prüfen
- [ ] Kostenlose externe Suchintegration nur bei echtem Mehrwert prüfen
- [ ] Filter nach Jahr oder Reiseziel ergänzen

## Arbeitsmodus für den AI-Agent
1. Lies diese `PLAN.md` vor jeder Bearbeitung.
2. Arbeite immer genau **einen** offenen Punkt ab.
3. Markiere nach Abschluss genau diesen Punkt von `[ ]` auf `[x]`.
4. Stoppe danach und warte auf die nächste Anweisung des Benutzers.
5. Wenn ein Schritt zu groß ist, zerlege zuerst nur diesen Schritt in kleinere Teilaufgaben innerhalb der Datei und stoppe dann.
6. Ändere nichts außerhalb des aktuellen Schritts, wenn es nicht technisch nötig ist.

## Nächster auszuführender Schritt
- [ ] `PLAN.md` als führende Aufgabenliste festlegen
