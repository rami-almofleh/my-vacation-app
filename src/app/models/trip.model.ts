export type DayPlanMode = 'simple' | 'structured';

export type DayPlanStatus = 'empty' | 'partial' | 'planned';

export type DayCategory =
  | 'food'
  | 'outing'
  | 'shopping'
  | 'relax'
  | 'transport'
  | 'other';

export interface DayPlan {
  id?: string;
  tripId?: string;
  ownerId: string;
  date: string;
  title?: string;
  mode: DayPlanMode;
  summaryText?: string;
  morningText?: string;
  middayText?: string;
  eveningText?: string;
  categories?: DayCategory[];
  locationHint?: string;
  status: DayPlanStatus;
  copiedFromDayId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trip {
  id?: string;
  ownerId: string;
  title: string;
  destination?: string;
  year: number;
  peopleCount: number;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  days: DayPlan[];
}
