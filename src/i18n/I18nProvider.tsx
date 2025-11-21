'use client'
import { I18nextProvider, useSSR } from 'react-i18next'
import i18n from '@/i18n/client'
import { useEffect, useState } from 'react'

// Internal useSSR component
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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
        .then(() => {
          setIsLoaded(true)
        })
        .catch((err) => {
          console.error('[i18n] Error changing language on client:', err)
          setIsLoaded(true)
        })
    } else {
      setIsLoaded(true)
    }

    return () => {

    };
  }, [locale])

  if (!isLoaded) {
    return null;
  }

  return children;
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