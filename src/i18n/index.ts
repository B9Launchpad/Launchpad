import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';

i18n
  .use(LanguageDetector) // Automatically detects browser langauge
  .use(initReactI18next)
  .use(I18NextHttpBackend)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl', 'de', 'ru'],
    ns: ['general', 'countries', 'intro', 'auth', 'components'],
    interpolation: {
      escapeValue: false 
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;