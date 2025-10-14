import i18n from 'i18next'

// DO NOT INITIALISE AT CREATION!
export const i18nInstance = i18n.createInstance()

// General configuration
export const commonConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl', 'de', 'ru'],
  ns: ['general', 'main', 'countries', 'intro', 'auth', 'components'],
  defaultNS: 'general',
  interpolation: { escapeValue: false }
}