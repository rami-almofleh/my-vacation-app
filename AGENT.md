# Projekt-Instruktionen für KI-Agent (Angular)

## Tech-Stack & Frameworks
- **Framework:** Angular.
- **UI-Layout/Design:** Primär Bootstrap für Layout/Grid und Angular Material für Komponenten.
- **Icons:** Ausschließlich Bootstrap Icons.
- **Formulare:** Angular Reactive Forms.

## Design-Regeln (Strikte Einhaltung)
- **Kein Custom CSS:** Nutze Bootstrap Utility-Klassen oder Material-Theming. Eigenes CSS nur als letzte Instanz, falls Drittanbieter-Komponenten keine Lösung bieten.
- **Design-Philosophie:** Flaches Design.
    - Weniger Cards verwenden (Struktur bevorzugt durch Layout-Container/Grid).
    - Minimale Abrundung (Border-Radius).
    - Minimale Schatten (Box-Shadow).
    - Keine Farbverläufe (Gradients).
- **Konsistenz:** Schatten, Ränder und Abstände müssen projektweit identisch sein.

## UX, Accessibility & Mobile
- **Responsivität:** Jedes Feature muss für Mobile-First ausgelegt sein.
- **Accessibility:** Achte auf korrekte ARIA-Labels und Tastaturnavigation.
- **Mehrsprachigkeit:** Achte bei allen statischen Texten strikt auf `i18n` (ngx-translate oder Angular i18n).

## Arbeitsweise & Code-Qualität
- **Bugfixing:** Fixe niemals nur ein Symptom. Prüfe bei jedem Bug, ob das Problem an anderen Stellen der App ebenfalls existiert (Full-Scan-Mindset).
- **Effizienz:** Vermeide ressourcenintensive Ansätze, die unnötig Credits verbrauchen. Schreibe prägnanten, sauberen TypeScript-Code.
- **Code-Konsistenz:** Achte strikt auf einheitliche Benennung und Patterns innerhalb der gesamten Codebase.

## Kommunikation & Workflow
- **Ende der Antwort:** Beende jede Antwort mit einer klaren Zusammenfassung deiner Arbeitsschritte.
- **Call-to-Action:** Nenne mir explizit, welche Informationen, Dateien oder Berechtigungen du von mir benötigst, um den nächsten Schritt optimal auszuführen.
