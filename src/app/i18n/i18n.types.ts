export type SupportedLanguage = 'en' | 'de';

export interface TranslationDictionary {
  common: {
    loading: string;
    back: string;
    signIn: string;
    create: string;
    languageSwitcherLabel: string;
  };
  tripsPage: {
    title: string;
    subtitle: string;
    loadingAccount: string;
    signedOut: string;
    loadingTrips: string;
    emptyTitle: string;
    emptyBody: string;
    createTripTitle: string;
    createTripSubtitle: string;
    createTripSubmit: string;
    createTripSubmitting: string;
    fields: {
      title: string;
      destination: string;
      people: string;
      startDate: string;
      endDate: string;
      notes: string;
    };
    validation: {
      invalidDateRange: string;
      createFailed: string;
    };
    errors: {
      loadFailed: string;
    };
    card: {
      travelers: string;
    };
  };
  tripDetailPage: {
    backToTrips: string;
    loadingTrip: string;
    signedOut: string;
    missingTripId: string;
    tripNotFound: string;
    tripLoadFailed: string;
    dates: string;
    travelers: string;
    notes: string;
    dayPlansTitle: string;
    dayPlansSubtitle: string;
    loadingDayPlans: string;
    dayPlansLoadFailed: string;
    emptyTitle: string;
    emptyBody: string;
    slots: {
      morning: string;
      midday: string;
      evening: string;
    };
  };
}
