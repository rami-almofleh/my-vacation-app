import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore';

import { db } from '../firebase.config';
import { DayPlan } from '../models/trip.model';
import { AuthStateService } from './auth-state.service';

type DayPlanDocument = Omit<DayPlan, 'id'>;

export type CreateDayPlanInput = Omit<DayPlanDocument, 'ownerId' | 'createdAt' | 'updatedAt'>;

export type UpdateDayPlanInput = Partial<Omit<DayPlanDocument, 'ownerId' | 'tripId' | 'createdAt'>>;

function removeUndefinedFields<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as T;
}

@Injectable({
  providedIn: 'root'
})
export class DayPlanService {
  private readonly dayPlansCollection = collection(db, 'dayPlans') as CollectionReference<DayPlanDocument>;

  constructor(private readonly authStateService: AuthStateService) {}

  watchDayPlans(tripId: string): Observable<DayPlan[]> {
    const ownerId = this.authStateService.getRequiredUserId();
    const dayPlansQuery = query(
      this.dayPlansCollection,
      where('ownerId', '==', ownerId),
      where('tripId', '==', tripId)
    );

    return new Observable<DayPlan[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        dayPlansQuery,
        (snapshot) => {
          subscriber.next(
            snapshot.docs
              .map((dayPlanDocument) => this.mapDayPlanDocument(dayPlanDocument))
              .sort((left, right) => left.date.localeCompare(right.date))
          );
        },
        (error) => subscriber.error(error)
      );

      return unsubscribe;
    });
  }

  async getDayPlan(dayPlanId: string): Promise<DayPlan | null> {
    const ownerId = this.authStateService.getRequiredUserId();
    const dayPlanSnapshot = await getDoc(doc(this.dayPlansCollection, dayPlanId));

    if (!dayPlanSnapshot.exists()) {
      return null;
    }

    const dayPlan = this.mapDayPlanDocument(dayPlanSnapshot as QueryDocumentSnapshot<DayPlanDocument>);

    if (dayPlan.ownerId !== ownerId) {
      throw new Error('Access denied for requested day plan.');
    }

    return dayPlan;
  }

  async createDayPlan(input: CreateDayPlanInput): Promise<string> {
    const ownerId = this.authStateService.getRequiredUserId();
    const timestamp = new Date().toISOString();

    const dayPlanPayload: DayPlanDocument = {
      ownerId,
      tripId: input.tripId,
      date: input.date,
      title: input.title,
      mode: input.mode,
      summaryText: input.summaryText,
      morningText: input.morningText,
      middayText: input.middayText,
      eveningText: input.eveningText,
      categories: input.categories,
      locationHint: input.locationHint,
      status: input.status,
      copiedFromDayId: input.copiedFromDayId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const dayPlanReference = await addDoc(
      this.dayPlansCollection,
      removeUndefinedFields(dayPlanPayload)
    );

    return dayPlanReference.id;
  }

  async updateDayPlan(dayPlanId: string, updates: UpdateDayPlanInput): Promise<void> {
    const existingDayPlan = await this.getDayPlan(dayPlanId);

    if (!existingDayPlan) {
      throw new Error('Day plan not found.');
    }

    await updateDoc(
      doc(this.dayPlansCollection, dayPlanId),
      removeUndefinedFields({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    );
  }

  async deleteDayPlan(dayPlanId: string): Promise<void> {
    const existingDayPlan = await this.getDayPlan(dayPlanId);

    if (!existingDayPlan) {
      throw new Error('Day plan not found.');
    }

    await deleteDoc(doc(this.dayPlansCollection, dayPlanId));
  }

  private mapDayPlanDocument(dayPlanDocument: QueryDocumentSnapshot<DayPlanDocument>): DayPlan {
    const dayPlanData = dayPlanDocument.data();

    return {
      id: dayPlanDocument.id,
      ownerId: dayPlanData.ownerId,
      tripId: dayPlanData.tripId,
      date: dayPlanData.date,
      title: dayPlanData.title,
      mode: dayPlanData.mode,
      summaryText: dayPlanData.summaryText,
      morningText: dayPlanData.morningText,
      middayText: dayPlanData.middayText,
      eveningText: dayPlanData.eveningText,
      categories: dayPlanData.categories,
      locationHint: dayPlanData.locationHint,
      status: dayPlanData.status,
      copiedFromDayId: dayPlanData.copiedFromDayId,
      createdAt: dayPlanData.createdAt,
      updatedAt: dayPlanData.updatedAt
    };
  }
}
