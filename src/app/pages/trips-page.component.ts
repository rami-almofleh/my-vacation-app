import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Trip } from '../models/trip.model';
import { AuthStateService } from '../services/auth-state.service';
import { DayPlanService } from '../services/day-plan.service';
import { LanguageService } from '../services/language.service';
import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-trips-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="trips-page">
      <section class="trips-header">
        <div>
          <h1 class="trips-title">{{ copy().tripsPage.title }}</h1>
          <p class="trips-subtitle">{{ copy().tripsPage.subtitle }}</p>
        </div>
      </section>

      <section *ngIf="accountState() === 'loading'" class="trips-state">
        <p>{{ copy().tripsPage.loadingAccount }}</p>
      </section>

      <section *ngIf="accountState() === 'signed-out'" class="trips-state">
        <div class="auth-panel-header">
          <div>
            <h2 class="trip-form-title">{{ copy().tripsPage.auth.title }}</h2>
            <p class="trip-form-subtitle">{{ copy().tripsPage.auth.subtitle }}</p>
          </div>
        </div>

        <div class="auth-mode-switch" role="tablist" [attr.aria-label]="copy().tripsPage.auth.title">
          <button
            type="button"
            [class.is-active]="authMode() === 'sign-in'"
            (click)="setAuthMode('sign-in')"
          >
            {{ copy().tripsPage.auth.signInTab }}
          </button>
          <button
            type="button"
            [class.is-active]="authMode() === 'sign-up'"
            (click)="setAuthMode('sign-up')"
          >
            {{ copy().tripsPage.auth.signUpTab }}
          </button>
        </div>

        <form class="trip-form" [formGroup]="authForm" (ngSubmit)="submitAuth()">
          <label class="field">
            <span>{{ copy().tripsPage.auth.email }}</span>
            <input type="email" formControlName="email" />
          </label>

          <label class="field">
            <span>{{ copy().tripsPage.auth.password }}</span>
            <div class="password-field">
              <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
              <button
                type="button"
                class="password-toggle"
                [attr.aria-label]="showPassword() ? copy().tripsPage.auth.hidePassword : copy().tripsPage.auth.showPassword"
                (click)="togglePasswordVisibility()"
              >
                <i class="bi" [class.bi-eye]="!showPassword()" [class.bi-eye-slash]="showPassword()"></i>
              </button>
            </div>
          </label>

          <div *ngIf="authSuccessMessage()" class="trip-form-success">
            <p>{{ authSuccessMessage() }}</p>
          </div>

          <div *ngIf="authErrorMessage()" class="trip-form-error">
            <p>{{ authErrorMessage() }}</p>
          </div>

          <div class="trip-form-actions">
            <button type="submit" class="primary-button" [disabled]="authForm.invalid || authStateService.isSubmitting()">
              {{
                authMode() === 'sign-in'
                  ? (authStateService.isSubmitting()
                    ? copy().tripsPage.auth.signInSubmitting
                    : copy().tripsPage.auth.signInSubmit)
                  : (authStateService.isSubmitting()
                    ? copy().tripsPage.auth.signUpSubmitting
                    : copy().tripsPage.auth.signUpSubmit)
              }}
            </button>
          </div>
        </form>
      </section>

      <section *ngIf="accountState() === 'ready'">
        <div *ngIf="loadError()" class="trips-state trips-state-error">
          <p>{{ loadError() }}</p>
        </div>

        <div *ngIf="tripActionError()" class="trips-state trips-state-error">
          <p>{{ tripActionError() }}</p>
        </div>

        <div *ngIf="!loadError() && isLoading()" class="trips-state">
          <p>{{ copy().tripsPage.loadingTrips }}</p>
        </div>

        <div *ngIf="!loadError() && !isLoading() && hasTrips()" class="trips-grid">
          <article
            *ngFor="let trip of trips()"
            class="trip-card"
            [class.trip-card-past]="isPastTrip(trip)"
            [class.trip-card-highlighted]="highlightedTripId() === trip.id"
          >
            <a class="trip-card-link" [routerLink]="['/trips', trip.id]">
              <div class="trip-card-top">
                <div class="trip-card-heading">
                  <span class="trip-year">{{ trip.year }}</span>
                  <span *ngIf="getTripBadge(trip) as badge" class="trip-badge">{{ badge }}</span>
                </div>
                <span class="trip-dates">{{ trip.startDate }} - {{ trip.endDate }}</span>
              </div>
              <h2 class="trip-name">{{ trip.title }}</h2>
              <p class="trip-destination" *ngIf="trip.destination">{{ trip.destination }}</p>
              <div class="trip-meta">
                <span>{{ trip.peopleCount }} {{ copy().tripsPage.card.travelers }}</span>
              </div>
            </a>

            <div class="trip-card-actions">
              <button type="button" class="secondary-button trip-action-link" (click)="openEditTripDialog(trip)">
                {{ copy().tripsPage.actions.edit }}
              </button>
              <button
                type="button"
                class="danger-button"
                [disabled]="deletingTripId() === trip.id"
                (click)="deleteTrip(trip)"
              >
                {{
                  deletingTripId() === trip.id
                    ? copy().tripsPage.actions.deleting
                    : copy().tripsPage.actions.delete
                }}
              </button>
            </div>
          </article>
        </div>

        <div *ngIf="!loadError() && !isLoading() && !hasTrips()" class="trips-empty">
          <h2>{{ copy().tripsPage.emptyTitle }}</h2>
          <p>{{ copy().tripsPage.emptyBody }}</p>
        </div>

        <div
          *ngIf="editingTripId()"
          class="trip-dialog-backdrop"
          (click)="closeEditTripDialog()"
        >
          <section
            class="trip-dialog"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="copy().tripsPage.editTripTitle"
            (click)="$event.stopPropagation()"
          >
            <h2 class="trip-form-title">{{ copy().tripsPage.editTripTitle }}</h2>
            <p class="trip-form-subtitle">{{ copy().tripsPage.editTripSubtitle }}</p>

            <form class="trip-form" [formGroup]="editTripForm" (ngSubmit)="saveTripChanges()">
              <label class="field">
                <span>{{ copy().tripsPage.fields.title }}</span>
                <input type="text" formControlName="title" />
              </label>

              <label class="field">
                <span>{{ copy().tripsPage.fields.destination }}</span>
                <input type="text" formControlName="destination" />
              </label>

              <div class="trip-dialog-grid">
                <label class="field">
                  <span>{{ copy().tripsPage.fields.people }}</span>
                  <input type="number" min="1" formControlName="peopleCount" />
                </label>

                <label class="field">
                  <span>{{ copy().tripsPage.fields.startDate }}</span>
                  <input type="date" formControlName="startDate" />
                </label>

                <label class="field">
                  <span>{{ copy().tripsPage.fields.endDate }}</span>
                  <input type="date" formControlName="endDate" />
                </label>
              </div>

              <label class="field">
                <span>{{ copy().tripsPage.fields.notes }}</span>
                <textarea rows="4" formControlName="notes"></textarea>
              </label>

              <div *ngIf="editTripError()" class="trip-form-error">
                <p>{{ editTripError() }}</p>
              </div>

              <div class="trip-form-actions">
                <button type="button" class="secondary-button" (click)="closeEditTripDialog()">
                  {{ copy().tripsPage.actions.cancel }}
                </button>
                <button type="submit" class="primary-button" [disabled]="editTripForm.invalid || isUpdatingTrip()">
                  {{
                    isUpdatingTrip()
                      ? copy().tripsPage.editTripSubmitting
                      : copy().tripsPage.editTripSubmit
                  }}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .trips-page {
      min-height: 100vh;
      padding: 32px 20px 48px;
      max-width: 1040px;
      margin: 0 auto;
    }

    .trips-header {
      margin-bottom: 24px;
    }

    .trips-state,
    .trips-empty {
      border: 1px solid #d9dee7;
      border-radius: 8px;
      padding: 20px;
      background: #fff;
    }

    .auth-panel-header {
      margin-bottom: 16px;
    }

    .trip-form-title {
      margin: 0;
      font-size: 1.25rem;
    }

    .trip-form-subtitle {
      margin: 8px 0 0;
      color: #5b6472;
    }

    .trips-title {
      margin: 0;
      font-size: 2rem;
      line-height: 1.1;
    }

    .trips-subtitle {
      margin: 8px 0 0;
      color: #5b6472;
      max-width: 640px;
    }

    .trip-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .auth-mode-switch {
      display: inline-flex;
      border: 1px solid #c8d1dc;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .auth-mode-switch button,
    .secondary-button {
      border: 0;
      background: transparent;
      padding: 10px 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      color: #374151;
    }

    .auth-mode-switch button.is-active {
      background: #111827;
      color: #fff;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field span {
      font-size: 0.95rem;
      font-weight: 600;
      color: #374151;
    }

    .field input {
      width: 100%;
      border: 1px solid #c8d1dc;
      border-radius: 8px;
      padding: 12px 14px;
      font: inherit;
      background: #fff;
      color: #111827;
    }

    .password-field {
      position: relative;
    }

    .password-field input {
      padding-right: 48px;
    }

    .password-toggle {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      border: 0;
      background: transparent;
      color: #4b5563;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .field input:focus {
      outline: 2px solid #cfe0ff;
      border-color: #7aa2f7;
    }

    .trip-form-actions {
      display: flex;
      justify-content: flex-start;
      gap: 12px;
    }

    .trip-form-actions .primary-button {
      border: 0;
      border-radius: 8px;
      padding: 12px 18px;
      background: #111827;
      color: #fff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .trip-form-actions .primary-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .secondary-button {
      border: 1px solid #c8d1dc;
      border-radius: 8px;
      background: #fff;
    }

    .trip-form-error {
      border: 1px solid #f0b6b6;
      border-radius: 8px;
      padding: 12px 14px;
      background: #fff5f5;
      color: #8a2424;
    }

    .trip-form-success {
      border: 1px solid #b7ddc0;
      border-radius: 8px;
      padding: 12px 14px;
      background: #f3fbf5;
      color: #1f6b35;
    }

    .trips-state-error {
      border-color: #f0b6b6;
      color: #8a2424;
      margin-bottom: 16px;
    }

    .trips-empty h2 {
      margin: 0 0 8px;
      font-size: 1.25rem;
    }

    .trips-empty p,
    .trips-state p {
      margin: 0;
    }

    .trips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .trip-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 180px;
      border: 1px solid #d9dee7;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
    }

    .trip-card-past {
      opacity: 0.58;
    }

    .trip-card-highlighted {
      border-color: #7aa2f7;
      box-shadow: 0 0 0 1px rgba(122, 162, 247, 0.22);
    }

    .trip-card-link {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 12px;
      padding: 18px;
      text-decoration: none;
      color: inherit;
    }

    .trip-card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 0 18px 18px;
    }

    .trip-action-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }

    .trip-dialog-backdrop {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, 0.45);
      z-index: 1000;
    }

    .trip-dialog {
      width: min(720px, 100%);
      max-height: calc(100vh - 40px);
      overflow: auto;
      border: 1px solid #d9dee7;
      border-radius: 8px;
      background: #fff;
      padding: 20px;
    }

    .trip-dialog-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .danger-button {
      border: 1px solid #e2b8b8;
      border-radius: 8px;
      padding: 10px 14px;
      background: #fff5f5;
      color: #8a2424;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .danger-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .trip-card-top {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .trip-card-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .trip-year {
      font-size: 0.875rem;
      font-weight: 600;
      color: #4b5563;
    }

    .trip-badge {
      border-radius: 999px;
      background: #e8f0ff;
      color: #2454b8;
      padding: 4px 10px;
      font-size: 0.8rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .trip-dates,
    .trip-destination,
    .trip-meta {
      color: #5b6472;
      font-size: 0.95rem;
    }

    .trip-name {
      margin: 0;
      font-size: 1.25rem;
      line-height: 1.2;
    }

    @media (max-width: 640px) {
      .trips-page {
        padding: 20px 16px 32px;
      }

      .trips-title {
        font-size: 1.6rem;
      }

      .trip-dialog-backdrop {
        padding: 16px;
        align-items: flex-end;
      }

      .trip-dialog {
        max-height: 85vh;
      }

      .trip-dialog-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TripsPageComponent implements OnDestroy {
  readonly authStateService = inject(AuthStateService);
  readonly languageService = inject(LanguageService);
  readonly copy = this.languageService.dictionary;

  private readonly formBuilder = inject(FormBuilder);
  private readonly tripService = inject(TripService);
  private readonly dayPlanService = inject(DayPlanService);
  private tripSubscription?: Subscription;

  readonly trips = signal<Trip[]>([]);
  readonly isLoading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly deletingTripId = signal<string | null>(null);
  readonly editingTripId = signal<string | null>(null);
  readonly isUpdatingTrip = signal(false);
  readonly tripActionError = signal<string | null>(null);
  readonly editTripError = signal<string | null>(null);
  readonly authMode = signal<'sign-in' | 'sign-up'>('sign-in');
  readonly showPassword = signal(false);
  readonly authSuccessMessage = signal<string | null>(null);
  readonly authErrorMessage = computed(() => this.authStateService.authError() ?? null);
  readonly hasTrips = computed(() => this.trips().length > 0);
  readonly todayIso = computed(() => new Date().toISOString().slice(0, 10));
  readonly highlightedTripId = computed(() => {
    const today = this.todayIso();
    const currentTrip = this.trips().find((trip) => trip.startDate <= today && trip.endDate >= today);

    if (currentTrip?.id) {
      return currentTrip.id;
    }

    const nextTrip = this.trips().find((trip) => trip.startDate >= today);
    return nextTrip?.id ?? null;
  });
  readonly accountState = computed<'loading' | 'signed-out' | 'ready'>(() => {
    if (!this.authStateService.isReady()) {
      return 'loading';
    }

    return this.authStateService.currentUser() ? 'ready' : 'signed-out';
  });
  readonly authForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  readonly editTripForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    destination: ['', [Validators.maxLength(80)]],
    peopleCount: [1, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    notes: ['', [Validators.maxLength(500)]]
  });

  private readonly watchTripsEffect = effect(() => {
    this.tripSubscription?.unsubscribe();
    this.trips.set([]);
    this.loadError.set(null);

    if (!this.authStateService.isReady()) {
      this.isLoading.set(true);
      return;
    }

    if (!this.authStateService.currentUser()) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.tripSubscription = this.tripService.watchTrips().subscribe({
      next: (trips) => {
        this.trips.set(trips);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.loadError.set(error instanceof Error ? error.message : this.copy().tripsPage.errors.loadFailed);
        this.isLoading.set(false);
      }
    });
  });

  ngOnDestroy(): void {
    this.tripSubscription?.unsubscribe();
  }

  setAuthMode(mode: 'sign-in' | 'sign-up'): void {
    this.authMode.set(mode);
    this.authSuccessMessage.set(null);
    this.authStateService.clearAuthError();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((currentValue) => !currentValue);
  }

  async submitAuth(): Promise<void> {
    this.authSuccessMessage.set(null);
    this.authStateService.clearAuthError();

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.authForm.getRawValue();

    try {
      if (this.authMode() === 'sign-in') {
        await this.authStateService.signInWithEmail(email.trim(), password);
      } else {
        await this.authStateService.signUpWithEmail(email.trim(), password);
        this.authSuccessMessage.set(this.copy().tripsPage.authSuccess);
      }

      this.authForm.reset({
        email: '',
        password: ''
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        this.authStateService.authError.set(this.copy().tripsPage.validation.authFailed);
      }
    }
  }

  async deleteTrip(trip: Trip): Promise<void> {
    if (!trip.id) {
      return;
    }

    this.tripActionError.set(null);

    if (!window.confirm(this.copy().tripsPage.actions.deleteConfirm)) {
      return;
    }

    this.deletingTripId.set(trip.id);

    try {
      await this.dayPlanService.deleteDayPlansForTrip(trip.id);
      await this.tripService.deleteTrip(trip.id);
    } catch (error) {
      this.tripActionError.set(
        error instanceof Error ? error.message : this.copy().tripsPage.errors.deleteFailed
      );
    } finally {
      this.deletingTripId.set(null);
    }
  }

  openEditTripDialog(trip: Trip): void {
    if (!trip.id) {
      return;
    }

    this.editTripError.set(null);
    this.editingTripId.set(trip.id);
    this.editTripForm.reset({
      title: trip.title,
      destination: trip.destination ?? '',
      peopleCount: trip.peopleCount,
      startDate: trip.startDate,
      endDate: trip.endDate,
      notes: trip.notes ?? ''
    });
  }

  closeEditTripDialog(): void {
    this.editingTripId.set(null);
    this.editTripError.set(null);
    this.editTripForm.reset({
      title: '',
      destination: '',
      peopleCount: 1,
      startDate: '',
      endDate: '',
      notes: ''
    });
  }

  async saveTripChanges(): Promise<void> {
    const tripId = this.editingTripId();

    if (!tripId) {
      return;
    }

    this.editTripError.set(null);

    if (this.editTripForm.invalid) {
      this.editTripForm.markAllAsTouched();
      return;
    }

    const { title, destination, peopleCount, startDate, endDate, notes } = this.editTripForm.getRawValue();

    if (startDate > endDate) {
      this.editTripError.set(this.copy().tripsPage.validation.invalidDateRange);
      return;
    }

    this.isUpdatingTrip.set(true);

    try {
      await this.tripService.updateTrip(tripId, {
        title: title.trim(),
        destination: destination.trim() || undefined,
        year: Number(startDate.slice(0, 4)),
        peopleCount,
        startDate,
        endDate,
        notes: notes.trim() || undefined
      });
      this.closeEditTripDialog();
    } catch (error) {
      this.editTripError.set(
        error instanceof Error ? error.message : this.copy().tripsPage.validation.createFailed
      );
    } finally {
      this.isUpdatingTrip.set(false);
    }
  }

  isPastTrip(trip: Trip): boolean {
    return trip.endDate < this.todayIso();
  }

  getTripBadge(trip: Trip): string | null {
    if (!trip.id || this.highlightedTripId() !== trip.id) {
      return null;
    }

    return trip.startDate <= this.todayIso() && trip.endDate >= this.todayIso()
      ? this.copy().tripsPage.card.currentBadge
      : this.copy().tripsPage.card.nextBadge;
  }
}
