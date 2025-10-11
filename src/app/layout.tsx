import type { Metadata } from 'next'
import './styles/variables.css'
import './styles/main.css'
import './styles/global.css'

export const metadata: Metadata = {
    title: 'Launchpad',
    description: "Migrated to NextJS"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">{children}</div> 
        </body>
    </html>
  )
}