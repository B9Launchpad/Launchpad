'use client'

import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/functions/Auth/ProtectedRoute';
import useIsDarkTheme from '@/contexts/useIsDarkTheme'

export default function Page() {

  return (
      <MainLayout>
        <ProtectedRoute>
            <></>
        </ProtectedRoute>
      </MainLayout>
  )
}
