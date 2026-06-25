import { describe, expect, it } from 'vitest';

import {
  createDayPlansForDateRange,
  createEmptyDayPlan,
  createTripDays
} from './trip-days';

describe('trip-days utilities', () => {
  it('creates a default empty day plan', () => {
    expect(createEmptyDayPlan('user-1', '2026-07-01', 'trip-1')).toEqual({
      ownerId: 'user-1',
      tripId: 'trip-1',
      date: '2026-07-01',
      mode: 'simple',
      status: 'empty',
      summaryText: '',
      categories: []
    });
  });

  it('creates one day plan per day in an inclusive date range', () => {
    expect(createDayPlansForDateRange('user-1', '2026-07-01', '2026-07-03', 'trip-1')).toEqual([
      createEmptyDayPlan('user-1', '2026-07-01', 'trip-1'),
      createEmptyDayPlan('user-1', '2026-07-02', 'trip-1'),
      createEmptyDayPlan('user-1', '2026-07-03', 'trip-1')
    ]);
  });

  it('creates trip days from trip dates', () => {
    expect(
      createTripDays({
        id: 'trip-9',
        ownerId: 'user-9',
        startDate: '2026-08-10',
        endDate: '2026-08-11'
      })
    ).toEqual([
      createEmptyDayPlan('user-9', '2026-08-10', 'trip-9'),
      createEmptyDayPlan('user-9', '2026-08-11', 'trip-9')
    ]);
  });

  it('throws for an invalid date range', () => {
    expect(() => createDayPlansForDateRange('user-1', '2026-09-05', '2026-09-01')).toThrow(
      'startDate must be before or equal to endDate'
    );
  });
});
