import { Injectable, computed, effect, signal } from '@angular/core';

import { SupportedLanguage } from '../i18n/i18n.types';
import { defaultLanguage, translations } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'my-vacation.language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly availableLanguages: SupportedLanguage[] = ['en', 'de'];
  readonly currentLanguage = signal<SupportedLanguage>(this.getInitialLanguage());
  readonly dictionary = computed(() => translations[this.currentLanguage()]);

  private readonly persistLanguageEffect = effect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, this.currentLanguage());
  });

  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage.set(language);
  }

  translate<Key extends keyof typeof translations.en>(
    section: Key
  ): (typeof translations.en)[Key] {
    return this.dictionary()[section];
  }

  private getInitialLanguage(): SupportedLanguage {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === 'en' || storedLanguage === 'de') {
      return storedLanguage;
    }

    return defaultLanguage;
  }
}
