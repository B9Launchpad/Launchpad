'use client'

import { LoginProvider } from '@/contexts/LoginContext'
import IntroLayout from '@/components/layout/IntroLayout'
import OnboardingStage from './Index';

export default function Page() {

  return (
    <LoginProvider>
      <IntroLayout>
        <OnboardingStage />
      </IntroLayout>
    </LoginProvider>
  )
}
