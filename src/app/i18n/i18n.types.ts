export type SupportedLanguage = 'en' | 'de';

export interface TranslationDictionary {
  common: {
    loading: string;
    back: string;
    signIn: string;
    create: string;
    languageSwitcherLabel: string;
    currentPassword: string;
    newPassword: string;
    email: string;
    showPassword: string;
    hidePassword: string;
    profile: {
      openMenu: string;
      title: string;
      signedInAs: string;
      changePassword: string;
      deleteAccount: string;
      signOut: string;
      cancel: string;
      confirmDelete: string;
      updatePassword: string;
      updatingPassword: string;
      deletingAccount: string;
      passwordChanged: string;
      accountDeleted: string;
      currentPasswordHelp: string;
      deleteAccountHelp: string;
      accountActionFailed: string;
    };
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
    editTripTitle: string;
    editTripSubtitle: string;
    editTripSubmit: string;
    editTripSubmitting: string;
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
      deleteFailed: string;
    };
    actions: {
      openCreate: string;
      edit: string;
      delete: string;
      deleting: string;
      cancel: string;
      deleteConfirm: string;
    };
    card: {
      travelers: string;
      currentBadge: string;
      nextBadge: string;
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
    dayPlansCount: string;
    loadingDayPlans: string;
    dayPlansLoadFailed: string;
    emptyTitle: string;
    emptyBody: string;
    categoriesTitle: string;
    simpleEditorTitle: string;
    simpleEditorPlaceholder: string;
    structuredEditorTitle: string;
    actions: {
      editSimple: string;
      switchToSimple: string;
      editStructured: string;
      switchToStructured: string;
      saveSimple: string;
      savingSimple: string;
      saveStructured: string;
      savingStructured: string;
      cancel: string;
    };
    errors: {
      saveSimpleFailed: string;
      saveStructuredFailed: string;
    };
    slots: {
      morning: string;
      midday: string;
      evening: string;
    };
    categories: {
      food: string;
      outing: string;
      shopping: string;
      relax: string;
      transport: string;
      other: string;
    };
  };
}
