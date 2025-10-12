'use client'

import { LoginProvider } from '@functions/Auth/LoginContext'
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
