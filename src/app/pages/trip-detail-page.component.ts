import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { DayPlanListComponent } from '../components/day-plan-list.component';
import { DayPlan, Trip } from '../models/trip.model';
import { AuthStateService } from '../services/auth-state.service';
import { DayPlanService } from '../services/day-plan.service';
import { LanguageService } from '../services/language.service';
import { TripService } from '../services/trip.service';
import { createTripDays } from '../utils/trip-days';

@Component({
  selector: 'app-trip-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DayPlanListComponent],
  template: `
    <main class="trip-detail-page">
      <a class="back-link" routerLink="/trips">{{ copy().tripDetailPage.backToTrips }}</a>

      <section *ngIf="accountState() === 'loading' || isLoadingTrip()" class="detail-state">
        <p>{{ copy().tripDetailPage.loadingTrip }}</p>
      </section>

      <section *ngIf="accountState() === 'signed-out'" class="detail-state">
        <p>{{ copy().tripDetailPage.signedOut }}</p>
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
              <span class="meta-label">{{ copy().tripDetailPage.dates }}</span>
              <strong>{{ currentTrip.startDate }} - {{ currentTrip.endDate }}</strong>
            </div>
            <div>
              <span class="meta-label">{{ copy().tripDetailPage.travelers }}</span>
              <strong>{{ currentTrip.peopleCount }}</strong>
            </div>
          </div>
        </header>

        <section class="trip-notes" *ngIf="currentTrip.notes">
          <h2>{{ copy().tripDetailPage.notes }}</h2>
          <p>{{ currentTrip.notes }}</p>
        </section>

        <section *ngIf="hasDayPlans()" class="overview-panel">
          <div class="section-heading">
            <h2>{{ copy().tripDetailPage.overviewTitle }}</h2>
            <p>{{ copy().tripDetailPage.overviewSubtitle }}</p>
          </div>

          <div class="overview-cards">
            <article class="overview-card">
              <span class="overview-card-label">{{ copy().tripDetailPage.overviewCards.empty }}</span>
              <strong class="overview-card-value">{{ emptyDayPlans().length }}</strong>
            </article>
            <article class="overview-card">
              <span class="overview-card-label">{{ copy().tripDetailPage.overviewCards.partial }}</span>
              <strong class="overview-card-value">{{ partialDayPlans().length }}</strong>
            </article>
            <article class="overview-card">
              <span class="overview-card-label">{{ copy().tripDetailPage.overviewCards.planned }}</span>
              <strong class="overview-card-value">{{ plannedDayPlans().length }}</strong>
            </article>
          </div>

          <div class="overview-lists">
            <div class="overview-list">
              <h3>{{ copy().tripDetailPage.overviewLists.empty }}</h3>
              <div *ngIf="emptyDayPlans().length; else noEmptyDays" class="overview-chip-list">
                <span *ngFor="let dayPlan of emptyDayPlans()" class="overview-chip">
                  {{ dayPlan.date }}
                </span>
              </div>
              <ng-template #noEmptyDays>
                <p class="overview-empty">{{ copy().tripDetailPage.overviewLists.none }}</p>
              </ng-template>
            </div>

            <div class="overview-list">
              <h3>{{ copy().tripDetailPage.overviewLists.partial }}</h3>
              <div *ngIf="partialDayPlans().length; else noPartialDays" class="overview-chip-list">
                <span *ngFor="let dayPlan of partialDayPlans()" class="overview-chip">
                  {{ dayPlan.date }}
                </span>
              </div>
              <ng-template #noPartialDays>
                <p class="overview-empty">{{ copy().tripDetailPage.overviewLists.none }}</p>
              </ng-template>
            </div>
          </div>
        </section>

        <section class="day-plan-section">
          <div class="section-heading">
            <div class="section-heading-top">
              <h2>{{ copy().tripDetailPage.dayPlansTitle }}</h2>
              <span class="day-count-badge">{{ dayPlans().length }} {{ copy().tripDetailPage.dayPlansCount }}</span>
            </div>
            <p>{{ copy().tripDetailPage.dayPlansSubtitle }}</p>
          </div>

          <div *ngIf="isLoadingDayPlans()" class="detail-state">
            <p>{{ copy().tripDetailPage.loadingDayPlans }}</p>
          </div>

          <div *ngIf="dayPlanLoadError()" class="detail-state detail-state-error">
            <p>{{ dayPlanLoadError() }}</p>
          </div>

          <app-day-plan-list
            *ngIf="!isLoadingDayPlans() && !dayPlanLoadError() && hasDayPlans()"
            [dayPlans]="dayPlans()"
          />

          <div *ngIf="!isLoadingDayPlans() && !dayPlanLoadError() && !hasDayPlans()" class="detail-empty">
            <h3>{{ copy().tripDetailPage.emptyTitle }}</h3>
            <p>{{ copy().tripDetailPage.emptyBody }}</p>
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
    .overview-panel,
    .detail-state,
    .detail-empty {
      border: 1px solid #d9dee7;
      border-radius: 8px;
      background: #fff;
    }

    .trip-detail-header,
    .trip-notes,
    .overview-panel,
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

    .section-heading-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .day-count-badge {
      border-radius: 999px;
      background: #eef2f7;
      color: #4b5563;
      padding: 6px 10px;
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .trip-notes p,
    .section-heading p,
    .detail-empty p,
    .detail-state p {
      margin: 0;
    }

    .overview-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .overview-card {
      border: 1px solid #e5eaf1;
      border-radius: 8px;
      background: #f8fafc;
      padding: 14px 16px;
    }

    .overview-card-label {
      display: block;
      margin-bottom: 6px;
      color: #5b6472;
      font-size: 0.85rem;
    }

    .overview-card-value {
      font-size: 1.5rem;
      line-height: 1;
    }

    .overview-lists {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .overview-list h3 {
      margin: 0 0 10px;
      font-size: 1rem;
    }

    .overview-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .overview-chip {
      border-radius: 999px;
      background: #eef2f7;
      color: #4b5563;
      padding: 6px 10px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .overview-empty {
      color: #5b6472;
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

      .section-heading-top {
        flex-direction: column;
        align-items: flex-start;
      }

      .overview-cards,
      .overview-lists {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TripDetailPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly authStateService = inject(AuthStateService);
  readonly languageService = inject(LanguageService);
  private readonly tripService = inject(TripService);
  private readonly dayPlanService = inject(DayPlanService);

  private dayPlanSubscription?: Subscription;

  readonly tripId = signal<string | null>(this.route.snapshot.paramMap.get('tripId'));
  readonly trip = signal<Trip | null>(null);
  readonly dayPlans = signal<DayPlan[]>([]);
  readonly copy = this.languageService.dictionary;
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
  readonly emptyDayPlans = computed(() => this.dayPlans().filter((dayPlan) => dayPlan.status === 'empty'));
  readonly partialDayPlans = computed(() => this.dayPlans().filter((dayPlan) => dayPlan.status === 'partial'));
  readonly plannedDayPlans = computed(() => this.dayPlans().filter((dayPlan) => dayPlan.status === 'planned'));
  
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
      this.tripLoadError.set(this.copy().tripDetailPage.missingTripId);
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
        this.tripLoadError.set(this.copy().tripDetailPage.tripNotFound);
        this.isLoadingTrip.set(false);
        this.isLoadingDayPlans.set(false);
        return;
      }

      this.trip.set(trip);
      this.isLoadingTrip.set(false);

      this.dayPlanSubscription = this.dayPlanService.watchDayPlans(tripId).subscribe({
        next: (dayPlans) => {
          const dayPlansByDate = new Map(dayPlans.map((dayPlan) => [dayPlan.date, dayPlan]));
          const mergedDayPlans = createTripDays(trip).map(
            (generatedDayPlan) => dayPlansByDate.get(generatedDayPlan.date) ?? generatedDayPlan
          );

          this.dayPlans.set(mergedDayPlans);
          this.isLoadingDayPlans.set(false);
        },
        error: (error) => {
          this.dayPlanLoadError.set(
            error instanceof Error ? error.message : this.copy().tripDetailPage.dayPlansLoadFailed
          );
          this.isLoadingDayPlans.set(false);
        }
      });
    } catch (error) {
      this.tripLoadError.set(error instanceof Error ? error.message : this.copy().tripDetailPage.tripLoadFailed);
      this.isLoadingTrip.set(false);
      this.isLoadingDayPlans.set(false);
    }
  }
}
