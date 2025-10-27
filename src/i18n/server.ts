import i18next, { i18n as I18nInstance } from 'i18next'
import fsBackend from 'i18next-fs-backend'
import path from 'path'
import fs from 'fs/promises'

const localesPath = path.join(process.cwd(), 'public', 'locales')
const modulesManifestPath = path.join(process.cwd(), 'src', 'modules', 'modules.manifest.json')
const modulesRoot = path.join(process.cwd(), 'src', 'modules')

export async function getServerTranslations(locale: string, namespaces: string[] = ['general']) {
  const i18nInstance: I18nInstance = i18next.createInstance()

  // Загружаем манифест модулей
  const manifestRaw = await fs.readFile(modulesManifestPath, 'utf-8')
  const manifest = JSON.parse(manifestRaw)

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

  // Теперь читаем модульные переводы вручную
  for (const mod of manifest) {
    const moduleNamespace = `module-${mod.module}`
    const filePath = path.join(modulesRoot, mod.module, 'locales', `${locale}.json`)

    try {
      const data = await fs.readFile(filePath, 'utf-8')
      const parsed = JSON.parse(data)
      i18nInstance.addResourceBundle(locale, moduleNamespace, parsed, true, true)
    } catch {
      // если перевода нет — просто пропускаем
    }
  }

  return {
    t: i18nInstance.t.bind(i18nInstance),
    initialStore: i18nInstance.store.data,
    locale,
  }
}
