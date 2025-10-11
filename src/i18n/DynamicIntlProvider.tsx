// 'use client'
// 
// import { ReactNode, useState, useEffect, createContext, useContext } from 'react'
// import { NextIntlClientProvider } from 'next-intl'
// import { getCookie } from 'cookies-next'
// import { SUPPORTED_LOCALES, loadMessages } from '@/i18n/utils'
// 
// type DynamicIntlContextType = {
//   locale: string
//   changeLocale: (newLocale: string) => Promise<void>
// }
// 
// const DynamicIntlContext = createContext<DynamicIntlContextType | null>(null)
// 
// export const useDynamicIntl = () => {
//   const ctx = useContext(DynamicIntlContext)
//   if (!ctx) throw new Error('useDynamicIntl must be used within DynamicIntlProvider')
//   return ctx
// }
// 
// export function DynamicIntlProvider({
//   children,
//   locale: initialLocale,
//   messages: initialMessages,
// }: {
//   children: ReactNode
//   locale: string
//   messages: Record<string, any>
// }) {
//   const [locale, setLocale] = useState(initialLocale)
//   const [messages, setMessages] = useState(initialMessages)
// 
//   async function changeLocale(newLocale: string) {
//     if (newLocale === locale || !SUPPORTED_LOCALES.includes(newLocale)) return
// 
//     // через API ставим cookie, чтобы сервер подхватил язык
//     await fetch('/api/locale', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ locale: newLocale }),
//     })
// 
//     // подгружаем сообщения с сервера
//     const newMessages = await fetch(`/api/messages?locale=${newLocale}`).then(r => r.json())
//     setLocale(newLocale)
//     setMessages(newMessages)
//   }
// 
//   useEffect(() => {
//     const cookieLocale = getCookie('i18next')
//     if (cookieLocale && cookieLocale !== locale) {
//       changeLocale(cookieLocale as string)
//     }
//   }, [])
// 
//   return (
//     <DynamicIntlContext.Provider value={{ locale, changeLocale }}>
//       <NextIntlClientProvider locale={locale} messages={messages}>
//         {children}
//       </NextIntlClientProvider>
//     </DynamicIntlContext.Provider>
//   )
// }
