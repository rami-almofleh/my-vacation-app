import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DayCategory, DayPlan } from '../models/trip.model';
import { DayPlanService } from '../services/day-plan.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-day-plan-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="day-plan-list">
      <details
        *ngFor="let dayPlan of dayPlans()"
        class="day-plan-item"
        [attr.id]="getDayPlanElementId(dayPlan.date)"
      >
        <summary class="day-plan-summary-row">
          <div class="day-plan-summary-main">
            <strong>{{ dayPlan.date }}</strong>
            <div class="day-plan-summary-meta">
              <span *ngFor="let category of dayPlan.categories" class="category-chip category-chip-compact">
                {{ getCategoryLabel(category) }}
              </span>
              <span class="day-plan-status">{{ dayPlan.status }}</span>
            </div>
          </div>
          <span class="day-plan-preview" *ngIf="getPreviewText(dayPlan)">
            {{ getPreviewText(dayPlan) }}
          </span>
        </summary>

        <div class="day-plan-body">
          <h3 *ngIf="dayPlan.title" class="day-plan-title">{{ dayPlan.title }}</h3>
          <p *ngIf="dayPlan.summaryText" class="day-plan-text">{{ dayPlan.summaryText }}</p>
          <div *ngIf="shouldShowSimpleSection(dayPlan)" class="simple-editor">
            <div class="simple-editor-header">
              <div class="editor-header-actions">
                <button
                  *ngIf="!isEditingDay(dayPlan)"
                  type="button"
                  class="simple-editor-button"
                  (click)="openSimpleEditor(dayPlan)"
                >
                  {{ copy().tripDetailPage.actions.editSimple }}
                </button>
                <button
                  type="button"
                  class="simple-editor-button"
                  (click)="openStructuredEditor(dayPlan)"
                >
                  {{ copy().tripDetailPage.actions.switchToStructured }}
                </button>
              </div>
            </div>

            <form
              *ngIf="isEditingDay(dayPlan) && editMode() === 'simple'"
              class="simple-editor-form"
              [formGroup]="simpleEditorForm"
              (ngSubmit)="saveSimplePlan(dayPlan)"
            >
              <textarea
                rows="4"
                formControlName="summaryText"
                [attr.placeholder]="copy().tripDetailPage.simpleEditorPlaceholder"
              ></textarea>

              <div class="category-editor">
                <span class="slot-label">{{ copy().tripDetailPage.categoriesTitle }}</span>
                <div class="category-option-list">
                  <label *ngFor="let category of categoryOptions" class="category-option">
                    <input
                      type="checkbox"
                      [checked]="hasSelectedCategory(category)"
                      (change)="toggleCategory(category)"
                    />
                    <span>{{ getCategoryLabel(category) }}</span>
                  </label>
                </div>
              </div>

              <div *ngIf="simpleEditorError()" class="simple-editor-error">
                {{ simpleEditorError() }}
              </div>

              <div class="simple-editor-actions">
                <button type="button" class="simple-editor-secondary" (click)="closeSimpleEditor()">
                  {{ copy().tripDetailPage.actions.cancel }}
                </button>
                <button
                  type="submit"
                  class="simple-editor-primary"
                  [disabled]="simpleEditorForm.invalid || savingDayKey() === getDayKey(dayPlan)"
                >
                  {{
                    savingDayKey() === getDayKey(dayPlan)
                      ? copy().tripDetailPage.actions.savingSimple
                      : copy().tripDetailPage.actions.saveSimple
                  }}
                </button>
              </div>
            </form>
          </div>

          <div *ngIf="shouldShowStructuredSection(dayPlan)" class="structured-editor">
            <div class="simple-editor-header structured-editor-header">
              <div class="editor-header-actions">
                <button
                  *ngIf="!isEditingDay(dayPlan)"
                  type="button"
                  class="simple-editor-button"
                  (click)="openStructuredEditor(dayPlan)"
                >
                  {{ copy().tripDetailPage.actions.editStructured }}
                </button>
                <button
                  type="button"
                  class="simple-editor-button"
                  (click)="openSimpleEditor(dayPlan)"
                >
                  {{ copy().tripDetailPage.actions.switchToSimple }}
                </button>
              </div>
            </div>

            <div class="day-plan-grid">
              <div *ngIf="dayPlan.morningText">
                <span class="slot-label">{{ copy().tripDetailPage.slots.morning }}</span>
                <p class="day-plan-text">{{ dayPlan.morningText }}</p>
              </div>
              <div *ngIf="dayPlan.middayText">
                <span class="slot-label">{{ copy().tripDetailPage.slots.midday }}</span>
                <p class="day-plan-text">{{ dayPlan.middayText }}</p>
              </div>
              <div *ngIf="dayPlan.eveningText">
                <span class="slot-label">{{ copy().tripDetailPage.slots.evening }}</span>
                <p class="day-plan-text">{{ dayPlan.eveningText }}</p>
              </div>
            </div>
          </div>

          <form
            *ngIf="editingDayKey() === getDayKey(dayPlan) && editMode() === 'structured'"
            class="simple-editor-form"
            [formGroup]="structuredEditorForm"
            (ngSubmit)="saveStructuredPlan(dayPlan)"
          >
            <label class="field-group">
              <span class="slot-label">{{ copy().tripDetailPage.slots.morning }}</span>
              <textarea rows="3" formControlName="morningText"></textarea>
            </label>

            <label class="field-group">
              <span class="slot-label">{{ copy().tripDetailPage.slots.midday }}</span>
              <textarea rows="3" formControlName="middayText"></textarea>
            </label>

            <label class="field-group">
              <span class="slot-label">{{ copy().tripDetailPage.slots.evening }}</span>
              <textarea rows="3" formControlName="eveningText"></textarea>
            </label>

            <div class="category-editor">
              <span class="slot-label">{{ copy().tripDetailPage.categoriesTitle }}</span>
              <div class="category-option-list">
                <label *ngFor="let category of categoryOptions" class="category-option">
                  <input
                    type="checkbox"
                    [checked]="hasSelectedCategory(category)"
                    (change)="toggleCategory(category)"
                  />
                  <span>{{ getCategoryLabel(category) }}</span>
                </label>
              </div>
            </div>

            <div *ngIf="structuredEditorError()" class="simple-editor-error">
              {{ structuredEditorError() }}
            </div>

            <div class="simple-editor-actions">
              <button type="button" class="simple-editor-secondary" (click)="closeStructuredEditor()">
                {{ copy().tripDetailPage.actions.cancel }}
              </button>
              <button
                type="submit"
                class="simple-editor-primary"
                [disabled]="savingDayKey() === getDayKey(dayPlan)"
              >
                {{
                  savingDayKey() === getDayKey(dayPlan)
                    ? copy().tripDetailPage.actions.savingStructured
                    : copy().tripDetailPage.actions.saveStructured
                }}
              </button>
            </div>
          </form>
        </div>
      </details>
    </div>
  `,
  styles: [`
    .day-plan-list {
      display: grid;
      gap: 12px;
    }

    .day-plan-item {
      border: 1px solid #d9dee7;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
    }

    .day-plan-summary-row {
      display: grid;
      gap: 8px;
      padding: 16px 18px;
      cursor: pointer;
      list-style: none;
    }

    .day-plan-summary-row::-webkit-details-marker {
      display: none;
    }

    .day-plan-summary-main {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .day-plan-summary-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }

    .day-plan-status,
    .day-plan-preview {
      color: #5b6472;
      font-size: 0.95rem;
    }

    .day-plan-status {
      text-transform: capitalize;
    }

    .day-plan-body {
      padding: 0 18px 18px;
      border-top: 1px solid #eef2f7;
    }

    .day-plan-title {
      margin: 16px 0 8px;
      font-size: 1.05rem;
    }

    .day-plan-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .slot-label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #5b6472;
    }

    .day-plan-text {
      margin: 0;
      color: #374151;
    }

    .category-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .category-chip {
      border-radius: 999px;
      background: #eef2f7;
      color: #4b5563;
      padding: 5px 10px;
      font-size: 0.82rem;
      font-weight: 600;
    }

    .category-chip-compact {
      margin: 0;
    }

    .simple-editor {
      margin-top: 12px;
    }

    .simple-editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .structured-editor-header {
      margin-bottom: 12px;
    }

    .structured-editor {
      margin-top: 12px;
    }

    .editor-header-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-left: auto;
    }

    .simple-editor-button,
    .simple-editor-secondary,
    .simple-editor-primary {
      border-radius: 8px;
      padding: 10px 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .simple-editor-button,
    .simple-editor-secondary {
      border: 1px solid #c8d1dc;
      background: #fff;
      color: #374151;
    }

    .simple-editor-primary {
      border: 1px solid #111827;
      background: #111827;
      color: #fff;
    }

    .simple-editor-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .simple-editor-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }

    .simple-editor-form textarea {
      width: 100%;
      border: 1px solid #c8d1dc;
      border-radius: 8px;
      background: #fff;
      color: #111827;
      padding: 12px 14px;
      font: inherit;
      resize: vertical;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .category-editor {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-option-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .category-option {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #d9dee7;
      border-radius: 999px;
      background: #fff;
      color: #374151;
      padding: 8px 12px;
      font-size: 0.9rem;
    }

    .simple-editor-error {
      border: 1px solid #f0b6b6;
      border-radius: 8px;
      background: #fff5f5;
      color: #8a2424;
      padding: 12px 14px;
    }

    .simple-editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    @media (max-width: 720px) {
      .day-plan-grid {
        grid-template-columns: 1fr;
      }

      .day-plan-summary-main {
        align-items: flex-start;
        flex-direction: column;
      }

      .day-plan-summary-meta {
        justify-content: flex-start;
      }

      .simple-editor-header,
      .structured-editor-header,
      .simple-editor-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .editor-header-actions {
        justify-content: stretch;
      }
    }
  `]
})
export class DayPlanListComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly languageService = inject(LanguageService);
  private readonly dayPlanService = inject(DayPlanService);
  readonly copy = this.languageService.dictionary;
  readonly dayPlans = input.required<DayPlan[]>();
  readonly categoryOptions: DayCategory[] = ['food', 'outing', 'shopping', 'relax', 'transport', 'other'];
  readonly editingDayKey = signal<string | null>(null);
  readonly savingDayKey = signal<string | null>(null);
  readonly editMode = signal<'simple' | 'structured'>('simple');
  readonly simpleEditorError = signal<string | null>(null);
  readonly structuredEditorError = signal<string | null>(null);
  readonly selectedCategories = signal<DayCategory[]>([]);
  readonly simpleEditorForm = this.formBuilder.nonNullable.group({
    summaryText: ['', [Validators.maxLength(500)]]
  });
  readonly structuredEditorForm = this.formBuilder.nonNullable.group({
    morningText: ['', [Validators.maxLength(500)]],
    middayText: ['', [Validators.maxLength(500)]],
    eveningText: ['', [Validators.maxLength(500)]]
  });

  getPreviewText(dayPlan: DayPlan): string {
    return (
      dayPlan.summaryText
      ?? dayPlan.title
      ?? dayPlan.morningText
      ?? dayPlan.middayText
      ?? dayPlan.eveningText
      ?? ''
    );
  }

  getDayKey(dayPlan: DayPlan): string {
    return dayPlan.id ?? dayPlan.date;
  }

  getDayPlanElementId(date: string): string {
    return `day-plan-${date}`;
  }

  isEditingDay(dayPlan: DayPlan): boolean {
    return this.editingDayKey() === this.getDayKey(dayPlan);
  }

  shouldShowSimpleSection(dayPlan: DayPlan): boolean {
    if (this.isEditingDay(dayPlan)) {
      return this.editMode() === 'simple';
    }

    return dayPlan.mode === 'simple';
  }

  shouldShowStructuredSection(dayPlan: DayPlan): boolean {
    if (this.isEditingDay(dayPlan)) {
      return this.editMode() === 'structured';
    }

    return dayPlan.mode === 'structured';
  }

  getCategoryLabel(category: DayCategory): string {
    return this.copy().tripDetailPage.categories[category];
  }

  hasSelectedCategory(category: DayCategory): boolean {
    return this.selectedCategories().includes(category);
  }

  toggleCategory(category: DayCategory): void {
    this.selectedCategories.update((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((entry) => entry !== category)
        : [...currentCategories, category]
    );
  }

  openSimpleEditor(dayPlan: DayPlan): void {
    this.simpleEditorError.set(null);
    this.structuredEditorError.set(null);
    this.editMode.set('simple');
    this.editingDayKey.set(this.getDayKey(dayPlan));
    this.selectedCategories.set(dayPlan.categories ?? []);
    this.simpleEditorForm.reset({
      summaryText: dayPlan.summaryText ?? ''
    });
  }

  closeSimpleEditor(): void {
    this.editingDayKey.set(null);
    this.savingDayKey.set(null);
    this.editMode.set('simple');
    this.simpleEditorError.set(null);
    this.structuredEditorError.set(null);
    this.selectedCategories.set([]);
    this.simpleEditorForm.reset({
      summaryText: ''
    });
    this.structuredEditorForm.reset({
      morningText: '',
      middayText: '',
      eveningText: ''
    });
  }

  openStructuredEditor(dayPlan: DayPlan): void {
    this.simpleEditorError.set(null);
    this.structuredEditorError.set(null);
    this.editMode.set('structured');
    this.editingDayKey.set(this.getDayKey(dayPlan));
    this.selectedCategories.set(dayPlan.categories ?? []);
    this.structuredEditorForm.reset({
      morningText: dayPlan.morningText ?? '',
      middayText: dayPlan.middayText ?? '',
      eveningText: dayPlan.eveningText ?? ''
    });
  }

  closeStructuredEditor(): void {
    this.closeSimpleEditor();
  }

  async saveSimplePlan(dayPlan: DayPlan): Promise<void> {
    if (this.simpleEditorForm.invalid || !dayPlan.tripId) {
      this.simpleEditorForm.markAllAsTouched();
      return;
    }

    const dayKey = this.getDayKey(dayPlan);
    this.simpleEditorError.set(null);
    this.savingDayKey.set(dayKey);

    try {
      const summaryText = this.simpleEditorForm.getRawValue().summaryText.trim();

      if (dayPlan.id) {
        await this.dayPlanService.updateDayPlan(dayPlan.id, {
          mode: 'simple',
          summaryText,
          morningText: '',
          middayText: '',
          eveningText: '',
          categories: this.selectedCategories()
        });
      } else {
        await this.dayPlanService.createDayPlan({
          tripId: dayPlan.tripId,
          date: dayPlan.date,
          title: dayPlan.title,
          mode: 'simple',
          summaryText,
          morningText: '',
          middayText: '',
          eveningText: '',
          categories: this.selectedCategories(),
          locationHint: dayPlan.locationHint,
          status: dayPlan.status,
          copiedFromDayId: dayPlan.copiedFromDayId
        });
      }

      this.closeSimpleEditor();
    } catch (error) {
      this.simpleEditorError.set(
        error instanceof Error ? error.message : this.copy().tripDetailPage.errors.saveSimpleFailed
      );
      this.savingDayKey.set(null);
    }
  }

  async saveStructuredPlan(dayPlan: DayPlan): Promise<void> {
    if (this.structuredEditorForm.invalid || !dayPlan.tripId) {
      this.structuredEditorForm.markAllAsTouched();
      return;
    }

    const dayKey = this.getDayKey(dayPlan);
    this.structuredEditorError.set(null);
    this.savingDayKey.set(dayKey);

    try {
      const { morningText, middayText, eveningText } = this.structuredEditorForm.getRawValue();
      const trimmedMorningText = morningText.trim();
      const trimmedMiddayText = middayText.trim();
      const trimmedEveningText = eveningText.trim();

      if (dayPlan.id) {
        await this.dayPlanService.updateDayPlan(dayPlan.id, {
          mode: 'structured',
          summaryText: '',
          morningText: trimmedMorningText,
          middayText: trimmedMiddayText,
          eveningText: trimmedEveningText,
          categories: this.selectedCategories()
        });
      } else {
        await this.dayPlanService.createDayPlan({
          tripId: dayPlan.tripId,
          date: dayPlan.date,
          title: dayPlan.title,
          mode: 'structured',
          summaryText: '',
          morningText: trimmedMorningText,
          middayText: trimmedMiddayText,
          eveningText: trimmedEveningText,
          categories: this.selectedCategories(),
          locationHint: dayPlan.locationHint,
          status: dayPlan.status,
          copiedFromDayId: dayPlan.copiedFromDayId
        });
      }

      this.closeStructuredEditor();
    } catch (error) {
      this.structuredEditorError.set(
        error instanceof Error ? error.message : this.copy().tripDetailPage.errors.saveStructuredFailed
      );
      this.savingDayKey.set(null);
    }
  }
}
