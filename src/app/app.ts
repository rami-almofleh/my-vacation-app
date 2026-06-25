import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStateService } from './services/auth-state.service';
import { DayPlanService } from './services/day-plan.service';
import { LanguageService } from './services/language.service';
import { TripService } from './services/trip.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly authStateService = inject(AuthStateService);
  readonly languageService = inject(LanguageService);
  readonly copy = this.languageService.dictionary;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly tripService = inject(TripService);
  private readonly dayPlanService = inject(DayPlanService);
  protected readonly title = signal('my-vacation');
  readonly isCreateTripDialogOpen = signal(false);
  readonly isCreatingTrip = signal(false);
  readonly isProfileMenuOpen = signal(false);
  readonly accountDialog = signal<'none' | 'change-password' | 'delete-account'>('none');
  readonly accountNotice = signal<string | null>(null);
  readonly accountError = signal<string | null>(null);
  readonly tripFormError = signal<string | null>(null);
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);
  readonly accountState = computed<'loading' | 'signed-out' | 'ready'>(() => {
    if (!this.authStateService.isReady()) {
      return 'loading';
    }

    return this.authStateService.currentUser() ? 'ready' : 'signed-out';
  });
  readonly currentUserEmail = computed(() => this.authStateService.currentUser()?.email ?? '');
  readonly tripForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    destination: ['', [Validators.maxLength(80)]],
    peopleCount: [1, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    notes: ['', [Validators.maxLength(500)]]
  });
  readonly changePasswordForm = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });
  readonly deleteAccountForm = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  openCreateTripDialog(): void {
    this.closeProfileMenu();
    this.tripFormError.set(null);
    this.isCreateTripDialogOpen.set(true);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((currentValue) => !currentValue);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  openAccountDialog(dialog: 'change-password' | 'delete-account'): void {
    this.closeProfileMenu();
    this.accountError.set(null);
    this.accountNotice.set(null);
    this.accountDialog.set(dialog);
  }

  closeCreateTripDialog(): void {
    this.tripFormError.set(null);
    this.tripForm.reset({
      title: '',
      destination: '',
      peopleCount: 1,
      startDate: '',
      endDate: '',
      notes: ''
    });
    this.isCreateTripDialogOpen.set(false);
  }

  closeAccountDialog(): void {
    this.accountDialog.set('none');
    this.accountError.set(null);
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.changePasswordForm.reset({
      currentPassword: '',
      newPassword: ''
    });
    this.deleteAccountForm.reset({
      currentPassword: ''
    });
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword.update((currentValue) => !currentValue);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.update((currentValue) => !currentValue);
  }

  async createTrip(): Promise<void> {
    this.tripFormError.set(null);

    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const { title, destination, peopleCount, startDate, endDate, notes } = this.tripForm.getRawValue();

    if (startDate > endDate) {
      this.tripFormError.set(this.copy().tripsPage.validation.invalidDateRange);
      return;
    }

    this.isCreatingTrip.set(true);

    try {
      const tripId = await this.tripService.createTrip({
        title: title.trim(),
        destination: destination.trim() || undefined,
        year: Number(startDate.slice(0, 4)),
        peopleCount,
        startDate,
        endDate,
        notes: notes.trim() || undefined
      });
      await this.dayPlanService.syncTripDayPlans({
        id: tripId,
        startDate,
        endDate
      });

      this.closeCreateTripDialog();
      await this.router.navigate(['/trips', tripId]);
    } catch (error) {
      this.tripFormError.set(
        error instanceof Error ? error.message : this.copy().tripsPage.validation.createFailed
      );
    } finally {
      this.isCreatingTrip.set(false);
    }
  }

  async changePassword(): Promise<void> {
    this.accountError.set(null);
    this.accountNotice.set(null);

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.getRawValue();

    try {
      await this.authStateService.changePassword(currentPassword, newPassword);
      this.closeAccountDialog();
      this.accountNotice.set(this.copy().common.profile.passwordChanged);
    } catch (error) {
      this.accountError.set(
        error instanceof Error ? error.message : this.copy().common.profile.accountActionFailed
      );
    }
  }

  async deleteAccount(): Promise<void> {
    this.accountError.set(null);
    this.accountNotice.set(null);

    if (this.deleteAccountForm.invalid) {
      this.deleteAccountForm.markAllAsTouched();
      return;
    }

    const { currentPassword } = this.deleteAccountForm.getRawValue();

    try {
      await this.authStateService.reauthenticateWithPassword(currentPassword);
      await this.dayPlanService.deleteDayPlansForCurrentUser();
      await this.tripService.deleteTripsForCurrentUser();
      await this.authStateService.deleteCurrentUser();
      this.closeAccountDialog();
      this.accountNotice.set(this.copy().common.profile.accountDeleted);
      await this.router.navigate(['/trips']);
    } catch (error) {
      this.accountError.set(
        error instanceof Error ? error.message : this.copy().common.profile.accountActionFailed
      );
    }
  }

  async signOut(): Promise<void> {
    this.closeProfileMenu();
    this.closeCreateTripDialog();
    this.accountNotice.set(null);
    this.accountError.set(null);
    await this.authStateService.signOutUser();
    await this.router.navigate(['/trips']);
  }
}
