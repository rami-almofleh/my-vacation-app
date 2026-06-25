import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { DayPlan } from '../models/trip.model';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-day-plan-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="day-plan-list">
      <details *ngFor="let dayPlan of dayPlans()" class="day-plan-item">
        <summary class="day-plan-summary-row">
          <div class="day-plan-summary-main">
            <strong>{{ dayPlan.date }}</strong>
            <span class="day-plan-status">{{ dayPlan.status }}</span>
          </div>
          <span class="day-plan-preview" *ngIf="getPreviewText(dayPlan)">
            {{ getPreviewText(dayPlan) }}
          </span>
        </summary>

        <div class="day-plan-body">
          <h3 *ngIf="dayPlan.title" class="day-plan-title">{{ dayPlan.title }}</h3>
          <p *ngIf="dayPlan.summaryText" class="day-plan-text">{{ dayPlan.summaryText }}</p>

          <div class="day-plan-grid" *ngIf="dayPlan.mode === 'structured'">
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

    @media (max-width: 720px) {
      .day-plan-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DayPlanListComponent {
  readonly languageService = inject(LanguageService);
  readonly copy = this.languageService.dictionary;
  readonly dayPlans = input.required<DayPlan[]>();

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
}
