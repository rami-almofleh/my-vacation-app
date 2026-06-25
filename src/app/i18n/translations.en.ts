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
      createFailed: 'Failed to create trip.'
    },
    errors: {
      loadFailed: 'Failed to load trips.'
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
