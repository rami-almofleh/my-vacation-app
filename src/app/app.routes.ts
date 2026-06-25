import { Routes } from '@angular/router';
import { TripDetailPageComponent } from './pages/trip-detail-page.component';
import { TripsPageComponent } from './pages/trips-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'trips'
  },
  {
    path: 'trips',
    component: TripsPageComponent
  },
  {
    path: 'trips/:tripId',
    component: TripDetailPageComponent
  },
  {
    path: '**',
    redirectTo: 'trips'
  }
];
