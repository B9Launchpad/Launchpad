import i18next, { i18n as I18nInstance } from 'i18next'
import fsBackend from 'i18next-fs-backend'
import path from 'path'
import fs from 'fs/promises'

const localesPath = path.join(process.cwd(), 'public', 'locales')

export async function getServerTranslations(locale: string, namespaces: string[] = ['general']) {
  console.log('\n[i18n] 🛰️ getServerTranslations called')
  console.log('[i18n] Locale:', locale)
  console.log('[i18n] Namespaces:', namespaces)
  console.log('[i18n] Locales path:', localesPath)

  const i18nInstance: I18nInstance = i18next.createInstance()

  try {
    await i18nInstance
      .use(fsBackend)
      .init({
        lng: locale,
        fallbackLng: 'en',
        supportedLngs: ['en', 'pl', 'de', 'ru'],
        ns: namespaces,
        defaultNS: 'general',
        interpolation: { escapeValue: false },
        backend: {
          loadPath: path.join(localesPath, '{{lng}}', '{{ns}}.json'),
        },
        initImmediate: false,
      })
  } catch (err) {
    console.error('[i18n] ❌ Error during i18next init:', err)
  }

  // 🔍 Ручная проверка существования файлов (без import)
  for (const ns of namespaces) {
    const filePath = path.join(localesPath, locale, `${ns}.json`)
    try {
      const data = await fs.readFile(filePath, 'utf8')
      const parsed = JSON.parse(data)
      console.log(`[i18n] ✅ Found ${filePath} with keys:`, Object.keys(parsed).slice(0, 5))
    } catch (err: any) {
      console.error(`[i18n] ❌ Cannot read ${filePath}:`, err.message)
    }
  }

  const storeData = i18nInstance.store?.data || {}
  if (!storeData[locale]) {
    console.warn(`[i18n] ⚠️ No store data found for locale "${locale}".`)
  } else {
    console.log(`[i18n] ✅ Store loaded for ${locale}:`, Object.keys(storeData[locale]))
  }

  return {
    t: i18nInstance.t.bind(i18nInstance),
    initialStore: storeData,
    locale,
  }
}