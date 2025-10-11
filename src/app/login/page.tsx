'use client'

import { LoginProvider } from '@functions/Auth/LoginContext'
import LoginFlow from './Index'
import GuestLayout from '@/components/layout/GuestLayout'

export default function Page() {
  return (
    <LoginProvider>
      <GuestLayout>
        <LoginFlow />
      </GuestLayout>
    </LoginProvider>
  )
}
