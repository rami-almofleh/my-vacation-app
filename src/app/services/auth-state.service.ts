import { Injectable, signal } from '@angular/core';
import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth';

import { auth } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  readonly currentUser = signal<User | null>(null);
  readonly isReady = signal(false);
  readonly isSubmitting = signal(false);
  readonly authError = signal<string | null>(null);

  private initialized = false;

  initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    this.initialized = true;

    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.currentUser.set(user);
        this.isReady.set(true);
        resolve();
      });
    });
  }

  async signUpWithEmail(email: string, password: string): Promise<User> {
    this.authError.set(null);
    this.isSubmitting.set(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (error) {
      this.authError.set(this.toErrorMessage(error));
      throw error;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    this.authError.set(null);
    this.isSubmitting.set(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } catch (error) {
      this.authError.set(this.toErrorMessage(error));
      throw error;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async signOutUser(): Promise<void> {
    this.authError.set(null);
    await signOut(auth);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    this.authError.set(null);
    this.isSubmitting.set(true);

    try {
      const user = await this.reauthenticateWithPassword(currentPassword);
      await updatePassword(user, newPassword);
    } catch (error) {
      this.authError.set(this.toErrorMessage(error));
      throw error;
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async reauthenticateWithPassword(currentPassword: string): Promise<User> {
    const user = this.currentUser();

    if (!user || !user.email) {
      throw new Error('Authenticated email user is required.');
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    return user;
  }

  async deleteCurrentUser(): Promise<void> {
    const user = this.currentUser();

    if (!user) {
      throw new Error('Authenticated user is required.');
    }

    await deleteUser(user);
  }

  clearAuthError(): void {
    this.authError.set(null);
  }

  getRequiredUserId(): string {
    const userId = this.currentUser()?.uid;

    if (!userId) {
      throw new Error('Authenticated user is required.');
    }

    return userId;
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Authentication request failed.';
  }
}
