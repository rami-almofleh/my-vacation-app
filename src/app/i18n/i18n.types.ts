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
    authSuccess: string;
    auth: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      showPassword: string;
      hidePassword: string;
      signInTab: string;
      signUpTab: string;
      signInSubmit: string;
      signInSubmitting: string;
      signUpSubmit: string;
      signUpSubmitting: string;
      signOut: string;
    };
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
      authFailed: string;
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
