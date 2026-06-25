export interface Activity {
  timeOfDay: 'morgens' | 'mittags' | 'abends';
  description: string;
  category?: 'essen' | 'rausgehen' | 'einkaufen' | 'sonstiges';
}

export interface DayPlan {
  date: string; // ISO Format 'YYYY-MM-DD'
  activities: Activity[];
  notes?: string;
  isPlanned: boolean; // Um zu sehen, ob schon was eingetragen wurde
}

export interface Trip {
  id?: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  days: DayPlan[];
}
