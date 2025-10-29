'use client'

import { LoginProvider } from '@/contexts/LoginContext'
import LoginFlow from './Index'
import GuestLayout from '@/components/layout/GuestLayout'
import { useContext } from 'react'
import ThemeContext from '@/contexts/ThemeContext'

export default function Page() {
  const { inferredTheme } = useContext(ThemeContext);
  const isDarkTheme = inferredTheme === 'dark';

  return (
    <LoginProvider>
      <GuestLayout backgroundURL={`/static/guest-layout/dusseldorf.webp`}>
        <LoginFlow />
      </GuestLayout>
    </LoginProvider>
  )
}
