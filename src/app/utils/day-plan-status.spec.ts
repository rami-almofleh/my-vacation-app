import { describe, expect, it } from 'vitest';

import { DayPlan } from '../models/trip.model';
import { calculateDayPlanStatus, withCalculatedDayPlanStatus } from './day-plan-status';

function createBaseDayPlan(overrides: Partial<DayPlan>): DayPlan {
  return {
    ownerId: 'user-1',
    date: '2026-07-01',
    mode: 'simple',
    status: 'empty',
    ...overrides
  };
}

describe('day-plan-status utilities', () => {
  it('marks an untouched simple day plan as empty', () => {
    expect(calculateDayPlanStatus(createBaseDayPlan({ mode: 'simple', summaryText: '' }))).toBe('empty');
  });

  it('marks a simple day plan with only a title as partial', () => {
    expect(calculateDayPlanStatus(createBaseDayPlan({ mode: 'simple', title: 'Beach' }))).toBe('partial');
  });

  it('marks a simple day plan with summary text as planned', () => {
    expect(
      calculateDayPlanStatus(createBaseDayPlan({ mode: 'simple', summaryText: 'Stay at the villa all day.' }))
    ).toBe('planned');
  });

  it('marks a structured day plan with one filled slot as partial', () => {
    expect(
      calculateDayPlanStatus(createBaseDayPlan({ mode: 'structured', morningText: 'Breakfast at home' }))
    ).toBe('partial');
  });

  it('marks a structured day plan with multiple filled slots as planned', () => {
    expect(
      calculateDayPlanStatus(
        createBaseDayPlan({
          mode: 'structured',
          morningText: 'Breakfast at home',
          eveningText: 'Walk through the old town'
        })
      )
    ).toBe('planned');
  });

  it('replaces a stale status with the calculated one', () => {
    expect(
      withCalculatedDayPlanStatus(
        createBaseDayPlan({
          mode: 'structured',
          morningText: 'Breakfast at home',
          status: 'empty'
        })
      ).status
    ).toBe('partial');
  });
});
