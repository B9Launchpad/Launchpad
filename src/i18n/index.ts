import i18n from 'i18next'

// Создаем инстансу но НЕ инициализируем
export const i18nInstance = i18n.createInstance()

// Общая конфигурация
export const commonConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl', 'de', 'ru'],
  ns: ['general', 'countries', 'intro', 'auth', 'components'],
  defaultNS: 'general',
  interpolation: { escapeValue: false }
}