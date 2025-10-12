'use client'

import { useEffect } from 'react'
import { useTranslation as useI18nTranslation } from 'react-i18next'

export function useServerTranslation(ns: string) {
    const { t, i18n, ready } = useI18nTranslation(ns)
    console.log("useServerTranslations called. ns: ", ns)


    useEffect(() => {
        if (!i18n.hasResourceBundle(i18n.language, ns)) {
            console.log(`[i18n] Lazy loading namespace on server: ${ns}`)
            i18n.loadNamespaces(ns)
        }
    }, [i18n, ns])

  return { t, i18n, ready }
}