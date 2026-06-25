import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { auth, firebaseApp } from './firebase.config';
import { AuthStateService } from './services/auth-state.service';

void firebaseApp;
void auth;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => () => inject(AuthStateService).initialize()
    }
  ]
};
