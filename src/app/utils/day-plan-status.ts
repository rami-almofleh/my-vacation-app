import { DayPlan, DayPlanStatus } from '../models/trip.model';

function hasTextContent(value?: string): boolean {
  return Boolean(value?.trim());
}

export function calculateDayPlanStatus(
  dayPlan: Pick<
    DayPlan,
    | 'mode'
    | 'summaryText'
    | 'morningText'
    | 'middayText'
    | 'eveningText'
    | 'title'
    | 'locationHint'
    | 'categories'
  >
): DayPlanStatus {
  const hasTitle = hasTextContent(dayPlan.title);
  const hasSummary = hasTextContent(dayPlan.summaryText);
  const hasLocationHint = hasTextContent(dayPlan.locationHint);
  const hasCategories = Boolean(dayPlan.categories?.length);

  if (dayPlan.mode === 'simple') {
    const simpleSignals = [hasSummary, hasTitle, hasLocationHint, hasCategories].filter(Boolean).length;

    if (simpleSignals === 0) {
      return 'empty';
    }

    return simpleSignals >= 2 || hasSummary ? 'planned' : 'partial';
  }

  const structuredSlots = [
    hasTextContent(dayPlan.morningText),
    hasTextContent(dayPlan.middayText),
    hasTextContent(dayPlan.eveningText)
  ];
  const filledSlotCount = structuredSlots.filter(Boolean).length;
  const extraSignals = [hasTitle, hasSummary, hasLocationHint, hasCategories].filter(Boolean).length;

  if (filledSlotCount === 0 && extraSignals === 0) {
    return 'empty';
  }

  if (filledSlotCount === 3) {
    return 'planned';
  }

  if (filledSlotCount >= 2 || (filledSlotCount >= 1 && extraSignals >= 1)) {
    return 'planned';
  }

  return 'partial';
}

export function withCalculatedDayPlanStatus<T extends DayPlan>(dayPlan: T): T {
  return {
    ...dayPlan,
    status: calculateDayPlanStatus(dayPlan)
  };
}
