'use client'

import { useLogin } from '@/contexts/LoginContext'
import LoginErrorPage from './Error'
import LoginPromptPage from './Login'
import LoginProcessingPage from './Processing'

export default function LoginFlow() {
  const { loginStatus } = useLogin()

  switch (loginStatus) {
    case 'isProcessing':
      return <LoginProcessingPage />
    case 'isError':
      return <LoginErrorPage />
    default:
      return <LoginPromptPage />
  }
}
