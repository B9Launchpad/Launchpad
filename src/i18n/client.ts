'use client'

import { i18nInstance, commonConfig } from './index'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import I18NextHttpBackend from 'i18next-http-backend'

if (!i18nInstance.isInitialized) {
  i18nInstance
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(I18NextHttpBackend)
    .init({
      ...commonConfig,
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      },
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        caches: ['localStorage', 'cookie']
      }
    })
}

export default i18nInstance