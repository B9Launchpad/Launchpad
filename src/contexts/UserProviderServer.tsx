import { headers } from 'next/headers'
import { detectOS } from '@utils/detect-os'
import { UserProvider } from '@contexts/UserContext'

export async function UserProviderServer({
    children
}: {
    children: React.ReactNode
}) {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const os = detectOS(userAgent)

    return <UserProvider os={os}>{children}</UserProvider>
}