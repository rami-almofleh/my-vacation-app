import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';

import { db } from '../firebase.config';
import { Trip } from '../models/trip.model';
import { AuthStateService } from './auth-state.service';

type TripDocument = Omit<Trip, 'id' | 'days'>;

export type CreateTripInput = Omit<TripDocument, 'ownerId' | 'createdAt' | 'updatedAt'>;

export type UpdateTripInput = Partial<Omit<TripDocument, 'ownerId' | 'createdAt'>>;

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly tripsCollection = collection(db, 'trips');

  constructor(private readonly authStateService: AuthStateService) {}

  watchTrips(): Observable<Trip[]> {
    const ownerId = this.authStateService.getRequiredUserId();
    const tripsQuery = query(
      this.tripsCollection,
      where('ownerId', '==', ownerId),
      orderBy('year', 'desc'),
      orderBy('startDate', 'asc')
    );

    return new Observable<Trip[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        tripsQuery,
        (snapshot) => {
          subscriber.next(snapshot.docs.map((tripDocument) => this.mapTripDocument(tripDocument)));
        },
        (error) => subscriber.error(error)
      );

      return unsubscribe;
    });
  }

  async getTrip(tripId: string): Promise<Trip | null> {
    const ownerId = this.authStateService.getRequiredUserId();
    const tripSnapshot = await getDoc(doc(this.tripsCollection, tripId));

    if (!tripSnapshot.exists()) {
      return null;
    }

    const trip = this.mapTripDocument(tripSnapshot as QueryDocumentSnapshot<TripDocument>);

    if (trip.ownerId !== ownerId) {
      throw new Error('Access denied for requested trip.');
    }

    return trip;
  }

  async createTrip(input: CreateTripInput): Promise<string> {
    const ownerId = this.authStateService.getRequiredUserId();
    const timestamp = new Date().toISOString();

    const tripPayload: TripDocument = {
      ownerId,
      title: input.title,
      destination: input.destination,
      year: input.year,
      peopleCount: input.peopleCount,
      startDate: input.startDate,
      endDate: input.endDate,
      notes: input.notes,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const tripReference = await addDoc(this.tripsCollection, tripPayload);

    return tripReference.id;
  }

  async updateTrip(tripId: string, updates: UpdateTripInput): Promise<void> {
    const existingTrip = await this.getTrip(tripId);

    if (!existingTrip) {
      throw new Error('Trip not found.');
    }

    await updateDoc(doc(this.tripsCollection, tripId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteTrip(tripId: string): Promise<void> {
    const existingTrip = await this.getTrip(tripId);

    if (!existingTrip) {
      throw new Error('Trip not found.');
    }

    await deleteDoc(doc(this.tripsCollection, tripId));
  }

  private mapTripDocument(tripDocument: QueryDocumentSnapshot<TripDocument>): Trip {
    const tripData = tripDocument.data();

    return {
      id: tripDocument.id,
      ownerId: tripData.ownerId,
      title: tripData.title,
      destination: tripData.destination,
      year: tripData.year,
      peopleCount: tripData.peopleCount,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      notes: tripData.notes,
      createdAt: tripData.createdAt,
      updatedAt: tripData.updatedAt,
      days: []
    };
  }
}
