import { TranslationDictionary } from './i18n.types';

export const translationsDe: TranslationDictionary = {
  common: {
    loading: 'Wird geladen...',
    back: 'Zurueck',
    signIn: 'Anmelden',
    create: 'Erstellen',
    languageSwitcherLabel: 'Sprachauswahl'
  },
  tripsPage: {
    title: 'Deine Urlaube',
    subtitle: 'Sieh dir gespeicherte Urlaube an und oeffne einen zum Weiterplanen.',
    loadingAccount: 'Konto wird geladen...',
    signedOut: 'Melde dich an, um deine Urlaube zu sehen.',
    loadingTrips: 'Urlaube werden geladen...',
    emptyTitle: 'Noch keine Urlaube',
    emptyBody: 'Lege als Naechstes deinen ersten Urlaub an.',
    createTripTitle: 'Urlaub anlegen',
    createTripSubtitle: 'Lege zuerst die Basisdaten an. Die Tagesplanung folgt danach.',
    createTripSubmit: 'Urlaub anlegen',
    createTripSubmitting: 'Wird erstellt...',
    fields: {
      title: 'Titel',
      destination: 'Reiseziel',
      people: 'Personen',
      startDate: 'Startdatum',
      endDate: 'Enddatum',
      notes: 'Notizen'
    },
    validation: {
      invalidDateRange: 'Das Enddatum muss am oder nach dem Startdatum liegen.',
      createFailed: 'Der Urlaub konnte nicht erstellt werden.'
    },
    errors: {
      loadFailed: 'Urlaube konnten nicht geladen werden.'
    },
    card: {
      travelers: 'Reisende'
    }
  },
  tripDetailPage: {
    backToTrips: 'Zurueck zu den Urlauben',
    loadingTrip: 'Urlaub wird geladen...',
    signedOut: 'Melde dich an, um diesen Urlaub zu oeffnen.',
    missingTripId: 'Die Urlaubs-ID fehlt.',
    tripNotFound: 'Urlaub nicht gefunden.',
    tripLoadFailed: 'Urlaub konnte nicht geladen werden.',
    dates: 'Daten',
    travelers: 'Reisende',
    notes: 'Notizen',
    dayPlansTitle: 'Tagesplaene',
    dayPlansSubtitle: 'Hier werden alle Tage dieses Urlaubs angezeigt.',
    loadingDayPlans: 'Tagesplaene werden geladen...',
    dayPlansLoadFailed: 'Tagesplaene konnten nicht geladen werden.',
    emptyTitle: 'Noch keine Tagesplaene',
    emptyBody: 'Dieser Urlaub existiert bereits, aber es wurden noch keine Tage geplant.',
    slots: {
      morning: 'Morgen',
      midday: 'Mittag',
      evening: 'Abend'
    }
  }
};
