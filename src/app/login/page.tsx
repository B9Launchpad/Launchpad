'use client'

import { LoginProvider } from '@/contexts/LoginContext'
import LoginFlow from './Index'
import GuestLayout from '@/components/layout/GuestLayout'
import useIsDarkTheme from '@/contexts/useIsDarkTheme'

export default function Page() {
  const isDarkTheme = useIsDarkTheme();

  return (
    <LoginProvider>
      <GuestLayout backgroundURL={`/static/GuestLayout/Skyline${isDarkTheme === true ? 'Dark' : ""}.webp`}>
        <LoginFlow />
      </GuestLayout>
    </LoginProvider>
  )
}
