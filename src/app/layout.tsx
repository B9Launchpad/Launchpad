import type { Metadata } from 'next'
import './styles/variables.css'
import './styles/main.css'
import './styles/global.css'
import { ThemeProvider } from '@/functions/ThemeContext'
import { getLocaleFromCookies, getLocaleFromHeaders } from '@/i18n/getLocale'
import { Montserrat } from "next/font/google";

// Динамический импорт I18nProvider, чтобы не грузить i18n в момент сборки
const I18nProvider = (await import('@/i18n/I18nProvider')).default
const { getServerTranslations } = await import('@/i18n/server')

export const metadata: Metadata = {
  title: 'Launchpad',
  description: 'Migrated to NextJS',
}

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let { locale, cookieFound } = await getLocaleFromCookies();
  if(!cookieFound) {
    locale = getLocaleFromHeaders();
  }

  let initialStore = {}

  try {
    // console.log('[i18n] Attempting to load server translations...')
    const result = await getServerTranslations(locale, ['general', 'auth', 'intro', 'countries', 'components'])
    // console.log('[i18n] Loaded namespaces:', Object.keys(result?.initialStore ?? {}))
    initialStore = result.initialStore
  } catch (err) {
    console.error('[i18n] Failed to load server translations:', err)
  }

  if (!initialStore || Object.keys(initialStore).length === 0) {
    console.warn('[i18n] initialStore is empty! i18next might not find translations.')
  } //else {
  //  console.log('[i18n] initialStore loaded successfully.')
  //}

  return (
    <html lang={locale}>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">
          <I18nProvider locale={locale} initialI18nStore={initialStore}>
            <ThemeProvider>{children}</ThemeProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  )
}