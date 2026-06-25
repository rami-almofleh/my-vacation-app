import { SupportedLanguage, TranslationDictionary } from './i18n.types';
import { translationsDe } from './translations.de';
import { translationsEn } from './translations.en';

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: translationsEn,
  de: translationsDe
};

export const defaultLanguage: SupportedLanguage = 'en';
