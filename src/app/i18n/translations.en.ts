import { TranslationDictionary } from './i18n.types';

export const translationsEn: TranslationDictionary = {
  common: {
    loading: 'Loading...',
    back: 'Back',
    signIn: 'Sign in',
    create: 'Create',
    languageSwitcherLabel: 'Language switcher'
  },
  tripsPage: {
    title: 'Your trips',
    subtitle: 'See all saved vacations and open one to continue planning.',
    loadingAccount: 'Loading account...',
    signedOut: 'Sign in to see your trips.',
    authSuccess: 'Account created successfully. You are now signed in.',
    auth: {
      title: 'Sign in or create an account',
      subtitle: 'Your trips are tied to your account, so sign in before you start planning.',
      email: 'Email',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signInTab: 'Sign in',
      signUpTab: 'Register',
      signInSubmit: 'Sign in',
      signInSubmitting: 'Signing in...',
      signUpSubmit: 'Create account',
      signUpSubmitting: 'Creating account...',
      signOut: 'Sign out'
    },
    loadingTrips: 'Loading trips...',
    emptyTitle: 'No trips yet',
    emptyBody: 'Create your first trip next.',
    createTripTitle: 'Create a trip',
    createTripSubtitle: 'Add the basics first. You can plan each day after that.',
    createTripSubmit: 'Create trip',
    createTripSubmitting: 'Creating...',
    fields: {
      title: 'Title',
      destination: 'Destination',
      people: 'People',
      startDate: 'Start date',
      endDate: 'End date',
      notes: 'Notes'
    },
    validation: {
      invalidDateRange: 'End date must be on or after the start date.',
      createFailed: 'Failed to create trip.',
      authFailed: 'Authentication request failed.'
    },
    errors: {
      loadFailed: 'Failed to load trips.',
      deleteFailed: 'Failed to delete trip.'
    },
    actions: {
      delete: 'Delete',
      deleting: 'Deleting...',
      deleteConfirm: 'Delete this trip and all of its day plans?'
    },
    card: {
      travelers: 'travelers'
    }
  },
  tripDetailPage: {
    backToTrips: 'Back to trips',
    loadingTrip: 'Loading trip...',
    signedOut: 'Sign in to open this trip.',
    missingTripId: 'Trip id is missing.',
    tripNotFound: 'Trip not found.',
    tripLoadFailed: 'Failed to load trip.',
    dates: 'Dates',
    travelers: 'Travelers',
    notes: 'Notes',
    dayPlansTitle: 'Day plans',
    dayPlansSubtitle: 'Each day of the trip will be listed here.',
    loadingDayPlans: 'Loading day plans...',
    dayPlansLoadFailed: 'Failed to load day plans.',
    emptyTitle: 'No day plans yet',
    emptyBody: 'This trip exists, but no daily plans have been added yet.',
    slots: {
      morning: 'Morning',
      midday: 'Midday',
      evening: 'Evening'
    }
  }
};
