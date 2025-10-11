import fs from 'fs'
import path from 'path'
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const DEFAULT_LOCALE = 'en'
const SUPPORTED_LOCALES = ['en', 'ru', 'de', 'pl']

export async function detectLocale(): Promise<string> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('i18next')?.value
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale
  }
  return DEFAULT_LOCALE
}

const messagesCache: Record<string, Record<string, any>> = {}

export function loadMessages(locale: string) {
  if (messagesCache[locale]) return messagesCache[locale]

  const dir = path.join(process.cwd(), 'src/messages', locale)
  if (!fs.existsSync(dir)) return {}

  const files = fs.readdirSync(dir)
  const messages: Record<string, any> = {}

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const namespace = path.basename(file, '.json')
    messages[namespace] = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  }

  messagesCache[locale] = messages
  return messages
}

export default getRequestConfig(async () => {
  const locale = await detectLocale()
  const messages = loadMessages(locale)
  return { locale, messages }
})