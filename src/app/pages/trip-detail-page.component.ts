import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { DayPlan, Trip } from '../models/trip.model';
import { AuthStateService } from '../services/auth-state.service';
import { DayPlanService } from '../services/day-plan.service';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-trip-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="trip-detail-page">
      <a class="back-link" routerLink="/trips">Back to trips</a>

      <section *ngIf="accountState() === 'loading' || isLoadingTrip()" class="detail-state">
        <p>Loading trip...</p>
      </section>

      <section *ngIf="accountState() === 'signed-out'" class="detail-state">
        <p>Sign in to open this trip.</p>
      </section>

      <section *ngIf="tripLoadError()" class="detail-state detail-state-error">
        <p>{{ tripLoadError() }}</p>
      </section>

      <section *ngIf="accountState() === 'ready' && trip() as currentTrip" class="trip-detail-layout">
        <header class="trip-detail-header">
          <div>
            <p class="trip-detail-year">{{ currentTrip.year }}</p>
            <h1 class="trip-detail-title">{{ currentTrip.title }}</h1>
            <p class="trip-detail-destination" *ngIf="currentTrip.destination">{{ currentTrip.destination }}</p>
          </div>

          <div class="trip-detail-meta">
            <div>
              <span class="meta-label">Dates</span>
              <strong>{{ currentTrip.startDate }} - {{ currentTrip.endDate }}</strong>
            </div>
            <div>
              <span class="meta-label">Travelers</span>
              <strong>{{ currentTrip.peopleCount }}</strong>
            </div>
          </div>
        </header>

        <section class="trip-notes" *ngIf="currentTrip.notes">
          <h2>Notes</h2>
          <p>{{ currentTrip.notes }}</p>
        </section>

        <section class="day-plan-section">
          <div class="section-heading">
            <h2>Day plans</h2>
            <p>Each day of the trip will be listed here.</p>
          </div>

          <div *ngIf="isLoadingDayPlans()" class="detail-state">
            <p>Loading day plans...</p>
          </div>

          <div *ngIf="dayPlanLoadError()" class="detail-state detail-state-error">
            <p>{{ dayPlanLoadError() }}</p>
          </div>

          <div *ngIf="!isLoadingDayPlans() && !dayPlanLoadError() && hasDayPlans()" class="day-plan-list">
            <article *ngFor="let dayPlan of dayPlans()" class="day-plan-card">
              <div class="day-plan-top">
                <strong>{{ dayPlan.date }}</strong>
                <span class="day-plan-status">{{ dayPlan.status }}</span>
              </div>

              <h3 *ngIf="dayPlan.title" class="day-plan-title">{{ dayPlan.title }}</h3>
              <p *ngIf="dayPlan.summaryText" class="day-plan-summary">{{ dayPlan.summaryText }}</p>

              <div class="day-plan-grid" *ngIf="dayPlan.mode === 'structured'">
                <div *ngIf="dayPlan.morningText">
                  <span class="slot-label">Morning</span>
                  <p>{{ dayPlan.morningText }}</p>
                </div>
                <div *ngIf="dayPlan.middayText">
                  <span class="slot-label">Midday</span>
                  <p>{{ dayPlan.middayText }}</p>
                </div>
                <div *ngIf="dayPlan.eveningText">
                  <span class="slot-label">Evening</span>
                  <p>{{ dayPlan.eveningText }}</p>
                </div>
              </div>
            </article>
          </div>

          <div *ngIf="!isLoadingDayPlans() && !dayPlanLoadError() && !hasDayPlans()" class="detail-empty">
            <h3>No day plans yet</h3>
            <p>This trip exists, but no daily plans have been added yet.</p>
          </div>
        </section>
      </section>
    </main>
  `,
  styles: [`
    .trip-detail-page {
      min-height: 100vh;
      padding: 32px 20px 48px;
      max-width: 1040px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      color: #1d4ed8;
      text-decoration: none;
      font-weight: 600;
    }

    .trip-detail-layout {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .trip-detail-header,
    .trip-notes,
    .detail-state,
    .detail-empty,
    .day-plan-card {
      border: 1px solid #d9dee7;
      border-radius: 8px;
      background: #fff;
    }

    .trip-detail-header,
    .trip-notes,
    .detail-state,
    .detail-empty {
      padding: 20px;
    }

    .trip-detail-header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }

    .trip-detail-year {
      margin: 0 0 8px;
      color: #4b5563;
      font-weight: 600;
    }

    .trip-detail-title {
      margin: 0;
      font-size: 2rem;
      line-height: 1.1;
    }

    .trip-detail-destination {
      margin: 10px 0 0;
      color: #5b6472;
    }

    .trip-detail-meta {
      display: grid;
      gap: 12px;
      min-width: 200px;
    }

    .meta-label {
      display: block;
      margin-bottom: 4px;
      font-size: 0.85rem;
      color: #5b6472;
    }

    .trip-notes h2,
    .section-heading h2,
    .detail-empty h3 {
      margin: 0 0 8px;
    }

    .trip-notes p,
    .section-heading p,
    .detail-empty p,
    .detail-state p {
      margin: 0;
    }

    .detail-state-error {
      border-color: #f0b6b6;
      color: #8a2424;
    }

    .day-plan-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .day-plan-list {
      display: grid;
      gap: 12px;
    }

    .day-plan-card {
      padding: 18px;
    }

    .day-plan-top {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 10px;
    }

    .day-plan-status {
      color: #5b6472;
      text-transform: capitalize;
    }

    .day-plan-title {
      margin: 0 0 8px;
      font-size: 1.1rem;
    }

    .day-plan-summary {
      margin: 0 0 12px;
      color: #374151;
    }

    .day-plan-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .slot-label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #5b6472;
    }

    .day-plan-grid p {
      margin: 0;
      color: #374151;
    }

    @media (max-width: 720px) {
      .trip-detail-page {
        padding: 20px 16px 32px;
      }

      .trip-detail-header {
        flex-direction: column;
      }

      .trip-detail-title {
        font-size: 1.7rem;
      }

      .day-plan-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TripDetailPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authStateService = inject(AuthStateService);
  private readonly tripService = inject(TripService);
  private readonly dayPlanService = inject(DayPlanService);

  private dayPlanSubscription?: Subscription;

  readonly tripId = signal<string | null>(this.route.snapshot.paramMap.get('tripId'));
  readonly trip = signal<Trip | null>(null);
  readonly dayPlans = signal<DayPlan[]>([]);
  readonly isLoadingTrip = signal(true);
  readonly isLoadingDayPlans = signal(true);
  readonly tripLoadError = signal<string | null>(null);
  readonly dayPlanLoadError = signal<string | null>(null);
  readonly accountState = computed<'loading' | 'signed-out' | 'ready'>(() => {
    if (!this.authStateService.isReady()) {
      return 'loading';
    }

    return this.authStateService.currentUser() ? 'ready' : 'signed-out';
  });
  readonly hasDayPlans = computed(() => this.dayPlans().length > 0);
  
  private readonly routeSubscription: Subscription = this.route.paramMap.subscribe((params) => {
    this.tripId.set(params.get('tripId'));
  });

  private readonly loadTripEffect = effect(() => {
    const tripId = this.tripId();
    const accountState = this.accountState();

    this.dayPlanSubscription?.unsubscribe();
    this.trip.set(null);
    this.dayPlans.set([]);
    this.tripLoadError.set(null);
    this.dayPlanLoadError.set(null);

    if (accountState === 'loading') {
      this.isLoadingTrip.set(true);
      this.isLoadingDayPlans.set(true);
      return;
    }

    if (accountState === 'signed-out') {
      this.isLoadingTrip.set(false);
      this.isLoadingDayPlans.set(false);
      return;
    }

    this.isLoadingTrip.set(true);
    this.isLoadingDayPlans.set(true);

    if (!tripId) {
      this.tripLoadError.set('Trip id is missing.');
      this.isLoadingTrip.set(false);
      this.isLoadingDayPlans.set(false);
      return;
    }

    void this.loadTrip(tripId);
  });

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.dayPlanSubscription?.unsubscribe();
  }

  private async loadTrip(tripId: string): Promise<void> {
    try {
      const trip = await this.tripService.getTrip(tripId);

      if (!trip) {
        this.tripLoadError.set('Trip not found.');
        this.isLoadingTrip.set(false);
        this.isLoadingDayPlans.set(false);
        return;
      }

      this.trip.set(trip);
      this.isLoadingTrip.set(false);

      this.dayPlanSubscription = this.dayPlanService.watchDayPlans(tripId).subscribe({
        next: (dayPlans) => {
          this.dayPlans.set(dayPlans);
          this.isLoadingDayPlans.set(false);
        },
        error: (error) => {
          this.dayPlanLoadError.set(error instanceof Error ? error.message : 'Failed to load day plans.');
          this.isLoadingDayPlans.set(false);
        }
      });
    } catch (error) {
      this.tripLoadError.set(error instanceof Error ? error.message : 'Failed to load trip.');
      this.isLoadingTrip.set(false);
      this.isLoadingDayPlans.set(false);
    }
  }
}
