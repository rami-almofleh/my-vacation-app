import { TranslationDictionary } from './i18n.types';

export const translationsDe: TranslationDictionary = {
  common: {
    loading: 'Wird geladen...',
    back: 'Zurueck',
    signIn: 'Anmelden',
    create: 'Erstellen',
    languageSwitcherLabel: 'Sprachauswahl',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
    email: 'E-Mail',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort ausblenden',
    profile: {
      openMenu: 'Profilmenue oeffnen',
      title: 'Profil',
      signedInAs: 'Angemeldet als',
      changePassword: 'Passwort aendern',
      deleteAccount: 'Konto loeschen',
      signOut: 'Abmelden',
      cancel: 'Abbrechen',
      confirmDelete: 'Konto loeschen',
      updatePassword: 'Passwort speichern',
      updatingPassword: 'Wird gespeichert...',
      deletingAccount: 'Konto wird geloescht...',
      passwordChanged: 'Passwort erfolgreich geaendert.',
      accountDeleted: 'Konto erfolgreich geloescht.',
      currentPasswordHelp: 'Gib dein aktuelles Passwort zur Bestaetigung ein.',
      deleteAccountHelp: 'Dadurch werden dein Konto und alle gespeicherten Urlaube geloescht.',
      accountActionFailed: 'Konto-Aktion konnte nicht ausgefuehrt werden.'
    }
  },
  tripsPage: {
    title: 'Deine Urlaube',
    subtitle: 'Sieh dir gespeicherte Urlaube an und oeffne einen zum Weiterplanen.',
    loadingAccount: 'Konto wird geladen...',
    signedOut: 'Melde dich an, um deine Urlaube zu sehen.',
    authSuccess: 'Konto erfolgreich erstellt. Du bist jetzt angemeldet.',
    auth: {
      title: 'Anmelden oder Konto erstellen',
      subtitle: 'Deine Urlaube sind an dein Konto gebunden. Melde dich zuerst an.',
      email: 'E-Mail',
      password: 'Passwort',
      showPassword: 'Passwort anzeigen',
      hidePassword: 'Passwort ausblenden',
      signInTab: 'Anmelden',
      signUpTab: 'Registrieren',
      signInSubmit: 'Anmelden',
      signInSubmitting: 'Anmeldung laeuft...',
      signUpSubmit: 'Konto erstellen',
      signUpSubmitting: 'Konto wird erstellt...',
      signOut: 'Abmelden'
    },
    loadingTrips: 'Urlaube werden geladen...',
    emptyTitle: 'Noch keine Urlaube',
    emptyBody: 'Lege als Naechstes deinen ersten Urlaub an.',
    createTripTitle: 'Urlaub anlegen',
    createTripSubtitle: 'Lege zuerst die Basisdaten an. Die Tagesplanung folgt danach.',
    createTripSubmit: 'Urlaub anlegen',
    createTripSubmitting: 'Wird erstellt...',
    editTripTitle: 'Urlaub bearbeiten',
    editTripSubtitle: 'Passe hier die Basisdaten des Urlaubs an.',
    editTripSubmit: 'Aenderungen speichern',
    editTripSubmitting: 'Wird gespeichert...',
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
      createFailed: 'Der Urlaub konnte nicht erstellt werden.',
      authFailed: 'Die Anmeldung konnte nicht verarbeitet werden.'
    },
    errors: {
      loadFailed: 'Urlaube konnten nicht geladen werden.',
      deleteFailed: 'Der Urlaub konnte nicht geloescht werden.'
    },
    actions: {
      openCreate: 'Urlaub anlegen',
      edit: 'Bearbeiten',
      delete: 'Loeschen',
      deleting: 'Wird geloescht...',
      cancel: 'Abbrechen',
      deleteConfirm: 'Diesen Urlaub und alle Tagesplaene dazu loeschen?'
    },
    card: {
      travelers: 'Reisende',
      currentBadge: 'Aktuell',
      nextBadge: 'Als Nächstes'
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
    dayPlansCount: 'Tage',
    loadingDayPlans: 'Tagesplaene werden geladen...',
    dayPlansLoadFailed: 'Tagesplaene konnten nicht geladen werden.',
    emptyTitle: 'Noch keine Tagesplaene',
    emptyBody: 'Dieser Urlaub existiert bereits, aber es wurden noch keine Tage geplant.',
    categoriesTitle: 'Kategorien',
    simpleEditorTitle: 'Einfache Planung',
    simpleEditorPlaceholder: 'Trage hier kurz ein, was an diesem Tag geplant ist...',
    structuredEditorTitle: 'Strukturierte Planung',
    actions: {
      editSimple: 'Plan bearbeiten',
      switchToSimple: 'Einfache Planung nutzen',
      editStructured: 'Zeitfenster bearbeiten',
      switchToStructured: 'Strukturierte Planung nutzen',
      saveSimple: 'Speichern',
      savingSimple: 'Wird gespeichert...',
      saveStructured: 'Zeitfenster speichern',
      savingStructured: 'Wird gespeichert...',
      cancel: 'Abbrechen'
    },
    errors: {
      saveSimpleFailed: 'Der Tagesplan konnte nicht gespeichert werden.',
      saveStructuredFailed: 'Die strukturierte Planung konnte nicht gespeichert werden.'
    },
    slots: {
      morning: 'Morgen',
      midday: 'Mittag',
      evening: 'Abend'
    },
    categories: {
      food: 'Essen',
      outing: 'Rausgehen',
      shopping: 'Einkaufen',
      relax: 'Entspannen',
      transport: 'Transport',
      other: 'Sonstiges'
    }
  }
};
