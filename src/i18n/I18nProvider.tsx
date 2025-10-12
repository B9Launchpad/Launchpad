'use client'

import { useEffect } from 'react'
import { I18nextProvider, useSSR } from 'react-i18next'
import i18n from '@/i18n/client'

// Внутренний компонент который использует useSSR
function SSRInitializer({ 
  children, 
  initialI18nStore, 
  locale 
}: { 
  children: React.ReactNode
  initialI18nStore: any
  locale: string 
}) {
  useSSR(initialI18nStore, locale)
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale)
  }

  return children
}

export default function I18nProvider({
  children,
  locale,
  initialI18nStore
}: {
  children: React.ReactNode
  locale: string
  initialI18nStore: any
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <SSRInitializer 
        initialI18nStore={initialI18nStore} 
        locale={locale}
      >
        {children}
      </SSRInitializer>
    </I18nextProvider>
  )
}