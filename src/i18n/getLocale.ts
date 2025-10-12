import { cookies } from "next/headers"

export async function getLocaleFromCookies() {
  try {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('i18next')
    return localeCookie?.value ? {locale: localeCookie.value, cookieFound: true} : {locale: 'en', cookieFound: false}
  } catch (error) {
    console.log('[i18n] No cookie store available, using default locale')
    return {locale: 'en', cookieFound: false}
  }
}

// Retrieve locale from headers
export function getLocaleFromHeaders(): string {
  try {
    const headers = require('next/headers').headers()
    const acceptLanguage = headers.get('accept-language')
    if (acceptLanguage) {
      // First (most preferred)
      return acceptLanguage.split(',')[0].split('-')[0]
    }
  } catch (error) {
    // ignore
  }
  return 'en'
}