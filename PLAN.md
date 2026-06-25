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
- ownerId
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
- ownerId
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
- Authentication: Firebase Authentication
- PWA: Angular PWA
- Architektur: kleine, verständliche Services und Standalone Components
- Code-Sprache: Englisch für Code, Dateinamen, Interfaces, Variablen und technische Texte
- UI-Sprache: Übersetzbar in mindestens `en` und `de`

## Sprachregeln
- Der gesamte App-Code bleibt auf Englisch
- Dazu gehören:
  - Interfaces und Types
  - Variablen und Funktionen
  - Component-Namen
  - Dateinamen
  - technische Kommentare
- Sichtbarer UI-Text wird nicht hart gemischt in Deutsch und Englisch geschrieben
- Sichtbarer UI-Text soll über eine Übersetzungsstruktur laufen
- Die ersten unterstützten Sprachen sind:
  - `en`
  - `de`
- Neue fachliche Begriffe im Modell werden auf Englisch benannt, auch wenn die Produktidee auf Deutsch beschrieben wurde

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
  - die Konfiguration läuft jetzt konsistent über `environment`
  - Development-Environment ist in `angular.json` angebunden
  - die echten Firebase-Projektwerte sind noch als Platzhalter einzutragen
- Das Datenmodell ist nur teilweise passend:
  - `Trip` und `DayPlan` existieren bereits
  - das Modell bildet die neue Produktidee noch nicht vollständig ab
  - mehrere Urlaube pro Jahr, Personenanzahl, einfacher vs. strukturierter Tagesmodus und Statusfelder fehlen noch
- Die UI ist noch ein technischer Platzhalter:
  - `app.html` zeigt aktuell nur eine sehr einfache Demo-Oberfläche
  - es gibt noch keine Urlaubsübersicht, kein Formular und keine Tagesliste
- Firestore-Services für echte Datenhaltung sind noch nicht vorhanden
- Eine lokale Firestore-Rules-Datei ist vorhanden:
  - `firestore.rules`
  - sie muss noch in Firebase veröffentlicht werden
- Routing ist noch nicht fachlich ausgebaut
- PWA ist noch nicht eingerichtet
- Der Git-Status ist bereits verändert; es gibt bestehende, nicht abgeschlossene Änderungen im Projekt
- Lokaler technischer Hinweis:
  - Angular 22 verlangt mindestens Node `22.22.3` oder `24.15.0`
  - die zuletzt verwendete Node-Version `24.13.0` reicht für `ng build` noch nicht

## Führende Aufgabenliste
Diese Datei ist ab jetzt die verbindliche, führende Aufgabenliste für dieses Projekt.

Regeln:
- Neue Entwicklungsarbeit orientiert sich an der Roadmap in dieser Datei
- Offene Punkte werden grundsätzlich in der hier vorgegebenen Reihenfolge abgearbeitet
- Pro Bearbeitungsrunde wird genau ein offener Punkt umgesetzt
- Nach jedem umgesetzten Punkt wird der Status in dieser Datei aktualisiert
- Wenn sich Produktidee oder Prioritäten ändern, wird zuerst diese Datei angepasst und erst danach der Code
- Wenn der tatsächliche Projektstand von dieser Datei abweicht, wird die Datei oder der Plan zuerst korrigiert

## Datenmodell-Abgleich zur Produktidee
Der aktuelle Stand in `src/app/models/trip.model.ts` ist eine brauchbare Skizze, deckt die Produktidee aber noch nicht sauber ab.

### Was bereits passt
- Ein `Trip` als Haupteintrag ist fachlich richtig
- Ein `DayPlan` pro Kalendertag ist fachlich richtig
- Zeitbezug über morgens / mittags / abends ist in der bestehenden `Activity`-Idee schon angelegt

### Was aktuell fachlich fehlt oder unklar ist
- `Trip.name` ist zu ungenau; fachlich werden eher `title` und optional `destination` gebraucht
- `Trip` hat noch keine `peopleCount`
- `Trip` hat noch keine freien Zusatznotizen
- `Trip` hat noch keine technischen Felder wie `createdAt` und `updatedAt`
- `Trip.days` ist als eingebettetes Array denkbar, für Firestore und spätere Kopierlogik aber noch nicht entschieden
- `DayPlan` kennt aktuell keinen Modus für `simple` oder `structured`
- `DayPlan` hat noch keinen einfachen Freitext für Tage wie "Villa" oder "Meer"
- `DayPlan` hat noch keine getrennten Felder für `morningText`, `middayText`, `eveningText`
- `DayPlan` hat noch keinen sichtbaren Status `empty`, `partial`, `planned`
- `DayPlan` hat noch keine Felder für Kopierlogik oder Wiederverwendungs-Herkunft
- `Activity.category` ist zu eng und sollte zur Produktidee erweitert werden
- Die Wiederholungs-Hinweise sind Produktlogik und werden nicht direkt im Grundmodell gespeichert

### Fachliche Entscheidung für die nächsten Schritte
- `Trip` bleibt ein eigener Datensatz auf Urlaubsebene
- `DayPlan` wird als eigener Datensatz mit Referenz auf `tripId` geplant
- Der MVP unterstützt zwei Tagesmodi:
  - `simple` fuer kurze Freitexteinträge
  - `structured` fuer morgens / mittags / abends
- Der Planungsstatus wird aus Inhalten ableitbar und zusätzlich als einfaches Feld speicherbar vorbereitet
- Kopier- und Vorlagenfunktionen werden durch IDs und Referenzen vorbereitet, aber erst später umgesetzt

### Konsequenz für die Umsetzung
- Zuerst wird das `Trip`-Modell erweitert
- Danach wird das `DayPlan`-Modell sauber neu definiert
- Erst danach lohnt sich die Firestore-Struktur und die Services

## Firestore-Datenstruktur
Für den MVP wird eine einfache Top-Level-Collection-Struktur verwendet.

### Ownership und Zugriff
- Jeder Benutzer wird über Firebase Authentication identifiziert
- Jeder Benutzer bekommt eine eindeutige `uid`
- Jeder Urlaub wird einem Benutzer über `ownerId` zugeordnet
- Tagespläne tragen ebenfalls `ownerId`, damit Queries und Firestore Rules einfach bleiben
- URL-Parameter oder manuell gemerkte IDs sind nicht die Grundlage für Besitz oder Zugriff

### Collections
- `trips`
- `dayPlans`

### `trips` Dokument
Document ID:
- automatisch von Firestore oder explizit beim Anlegen erzeugt

Felder:
- `ownerId`
- `title`
- `destination`
- `year`
- `peopleCount`
- `startDate`
- `endDate`
- `notes`
- `createdAt`
- `updatedAt`

Wichtige Entscheidung:
- `days` wird nicht als eingebettetes Array im `trip` gespeichert
- Die Tagesdaten liegen separat in `dayPlans`
- Das `Trip`-Interface darf das Feld kurzfristig noch enthalten, fachlich ist Firestore aber auf getrennte Dokumente festgelegt

### `dayPlans` Dokument
Document ID:
- automatisch von Firestore oder deterministisch aus `tripId + date`

Felder:
- `ownerId`
- `tripId`
- `date`
- `title`
- `mode`
- `summaryText`
- `morningText`
- `middayText`
- `eveningText`
- `categories`
- `locationHint`
- `status`
- `copiedFromDayId`
- `createdAt`
- `updatedAt`

### Abfrage-Strategie
- Urlaubsübersicht:
  - lese `trips` gefiltert nach `ownerId`
  - sortiere nach `year` absteigend, danach `startDate`
- Tagesübersicht eines Urlaubs:
  - lese `dayPlans` gefiltert nach `ownerId` und `tripId`
  - sortiere nach `date`

### Warum keine Subcollection im MVP
- Top-Level-Collections sind einfacher zu debuggen
- Queries und spätere Kopierlogik bleiben unkompliziert
- Wiederverwendung zwischen Urlauben und Jahren ist einfacher
- Die Datenmenge des MVP ist klein genug, dass diese Struktur genügt

### Konsequenz für die nächsten Code-Schritte
- Auth-Zustand muss vor Firestore-Zugriff verfügbar sein
- `TripService` arbeitet benutzerbezogen auf `trips`
- `DayPlanService` arbeitet benutzerbezogen auf `dayPlans`
- Firestore Rules müssen `ownerId == auth.uid` absichern
- Das `Trip`-Modell wird später noch von eingebetteten `days` entkoppelt

## Firestore Rules
Die App verwendet benutzerbezogene Firestore-Regeln auf Basis von `ownerId`.

### Regelidee
- Nur angemeldete Benutzer duerfen Daten lesen oder schreiben
- Ein Benutzer darf nur Dokumente lesen, deren `ownerId` seiner `auth.uid` entspricht
- Beim Erstellen muss `ownerId` auf die eigene `auth.uid` gesetzt werden
- Beim Aktualisieren darf `ownerId` nicht auf einen anderen Benutzer umgebogen werden
- Bei `dayPlans` darf `tripId` nach dem Erstellen nicht geaendert werden

### Lokale Datei
- `firestore.rules`

### Geltungsbereich
- `trips`
- `dayPlans`

### Wichtiger naechster manueller Schritt
- Die Datei `firestore.rules` muss in der Firebase Console oder per Firebase CLI veroeffentlicht werden

## MVP-Auth-Strategie
Für den MVP wird Firebase Authentication mit `email/password` verwendet.

### Entscheidung
- Benutzer registrieren sich mit E-Mail-Adresse und Passwort
- Benutzer melden sich mit E-Mail-Adresse und Passwort an
- Jeder Datensatz in Firestore wird über `ownerId = auth.uid` einem Benutzer zugeordnet
- Ohne angemeldeten Benutzer gibt es keinen Zugriff auf persönliche Urlaubsdaten

### Warum diese Strategie
- Der Benutzer muss sich keine URL oder manuelle ID merken
- Die Daten sind an ein echtes Benutzerkonto gebunden
- Mehrgeräte-Nutzung funktioniert sauber über denselben Login
- Firestore Rules lassen sich klar auf `auth.uid` aufbauen

### Konsequenz für die Umsetzung
- Die App braucht mindestens Login, Registrierung und Logout
- Vor `TripService` und `DayPlanService` muss der Auth-Zustand verfügbar sein
- `ownerId` wird beim Erstellen von `trips` und `dayPlans` automatisch gesetzt
- Die bisherige Aufgabenzeile zur anonymen Anmeldung ist durch E-Mail/Passwort ersetzt

## i18n-Strategie
Für dieses Projekt wird eine runtime-basierte Übersetzungsstrategie verwendet.

### Entscheidung
- Die App verwendet einen einfachen, schluesselbasierten i18n-Ansatz zur Laufzeit
- UI-Texte werden ueber Keys statt ueber hart codierte Endtexte gerendert
- Die ersten unterstuetzten Sprachen sind:
  - `en`
  - `de`
- Englisch ist die technische Basissprache fuer Keys und Default-Texte

### Warum diese Strategie
- Die Sprache kann spaeter ohne separaten Build gewechselt werden
- Der Ansatz ist fuer eine kleine Angular-App einfacher als ein compile-time-only i18n-Setup
- Neue Views und Komponenten koennen schrittweise auf Uebersetzungskeys umgestellt werden
- Die Produktanforderung "Code auf Englisch, UI in en/de" passt direkt dazu

### Konsequenz fuer die Umsetzung
- Es wird eine zentrale Uebersetzungsquelle fuer `en` und `de` angelegt
- Die App bekommt einen kleinen Sprachstatus bzw. Language-Service
- Bestehende sichtbare Texte in `trips-page` und `trip-detail-page` werden spaeter auf Keys umgestellt
- Neue Komponenten sollen ab jetzt keine neuen fest codierten UI-Texte mehr einfuehren, wenn der i18n-Unterbau vorhanden ist

## Roadmap

### Phase 0: Projektbasis prüfen und aufräumen
- [x] Bestehenden Projektstand prüfen und dokumentieren
- [x] `PLAN.md` als führende Aufgabenliste festlegen
- [x] Datenmodell mit echter Produktidee abgleichen
- [x] Firebase-Konfiguration finalisieren

### Phase 1: Datenmodell und Grundlage
- [x] `Trip`-Modell auf mehrere Urlaube pro Jahr ausrichten
- [x] `DayPlan`-Modell für einfachen und strukturierten Modus definieren
- [x] Hilfslogik zum Erzeugen aller Urlaubstage aus Start- und Enddatum bauen
- [x] Firestore-Datenstruktur für Trips und DayPlans festlegen

### Phase 1.5: Auth und Besitz
- [x] Auth-Strategie für MVP festlegen
- [x] Firebase Authentication in der App initialisieren
- [x] E-Mail/Passwort-Authentifizierung für den MVP einrichten
- [x] `ownerId` im Datenmodell und in Services konsequent verwenden
- [x] Firestore Rules für benutzerbezogenen Zugriff definieren

### Phase 1.6: Services
- [x] `TripService` für CRUD auf Urlaube implementieren
- [x] `DayPlanService` für CRUD auf Tagespläne implementieren

### Phase 2: Hauptnavigation und Basis-Views
- [x] App-Routing für Urlaubsübersicht und Detailansicht anlegen
- [x] Startseite mit Liste aller Urlaube erstellen
- [x] Formular zum Anlegen eines neuen Urlaubs erstellen
- [x] Urlaub-Detailseite mit Tagesliste anlegen
- [x] Leere Zustände und Ladezustände ergänzen

### Phase 2.5: Sprache und Übersetzungen
- [x] i18n-Strategie für Angular festlegen
- [x] Basis-Übersetzungsstruktur für `en` und `de` anlegen
- [x] Sprachumschaltung für die App vorbereiten
- [x] Bestehende und neue UI-Texte nur noch über Übersetzungskeys ausgeben

### Phase 3: Tagesplanung
- [x] Accordion- oder Listenkomponente für Tage erstellen
- [x] Tagesstatus `empty`, `partial`, `planned` berechnen
- [x] Editor für einfachen Tagesmodus mit Freitext bauen
- [x] Editor für strukturierten Tagesmodus mit morgens / mittags / abends bauen
- [x] Kategorien / Tags pro Tag integrieren
- [x] Tagesdaten mit Firestore verbinden

### Phase 4: Produktlogik
- [x] Übersicht für ungeplante und teilweise geplante Tage ergänzen
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
- [ ] Kurzvorschau geplanter Inhalte in der Tagesliste anzeigen
