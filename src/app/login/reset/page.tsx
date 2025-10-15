'use client'

import ResetFlow from './Index'
import GuestLayout from '@/components/layout/GuestLayout'
import { ResetProvider } from '@/contexts/ResetContext'

export default function Page() {
  return (
    <ResetProvider>
      <GuestLayout backgroundURL='/static/guest-soviet.webp'>
        <ResetFlow />
      </GuestLayout>
    </ResetProvider>
  )
}
