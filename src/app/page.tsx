'use client'

import MainLayout from '@/components/layout/MainLayout';
import useIsDarkTheme from '@/functions/useIsDarkTheme'

export default function Page() {
  const isDarkTheme = useIsDarkTheme();

  return (
      <MainLayout>
        <></>
      </MainLayout>
  )
}
