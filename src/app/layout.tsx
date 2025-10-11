import type { Metadata } from 'next'
import './styles/variables.css'
import './styles/main.css'
import './styles/global.css'
import { detectLocale, loadMessages } from "@/i18n/request"
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/functions/ThemeContext'

export const metadata: Metadata = {
    title: 'Launchpad',
    description: "Migrated to NextJS"
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await detectLocale()
  const messages = loadMessages(locale)

  return (
    <html lang="en">
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
              <NextIntlClientProvider locale={locale} messages={messages}>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </NextIntlClientProvider>
            </div> 
        </body>
    </html>
  )
}