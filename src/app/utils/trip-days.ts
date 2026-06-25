import { DayPlan, Trip } from '../models/trip.model';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseIsoDate(date: string): Date {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid ISO date: ${date}`);
  }

  return parsedDate;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function createEmptyDayPlan(ownerId: string, date: string, tripId?: string): DayPlan {
  return {
    ownerId,
    tripId,
    date,
    mode: 'simple',
    status: 'empty',
    summaryText: '',
    categories: []
  };
}

export function createDayPlansForDateRange(
  ownerId: string,
  startDate: string,
  endDate: string,
  tripId?: string
): DayPlan[] {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);

  if (start.getTime() > end.getTime()) {
    throw new Error('startDate must be before or equal to endDate');
  }

  const dayPlans: DayPlan[] = [];

  for (let current = start.getTime(); current <= end.getTime(); current += MS_PER_DAY) {
    dayPlans.push(createEmptyDayPlan(ownerId, formatIsoDate(new Date(current)), tripId));
  }

  return dayPlans;
}

export function createTripDays(trip: Pick<Trip, 'id' | 'ownerId' | 'startDate' | 'endDate'>): DayPlan[] {
  return createDayPlansForDateRange(trip.ownerId, trip.startDate, trip.endDate, trip.id);
}
