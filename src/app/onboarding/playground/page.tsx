'use client'

import ProtectedRoute from '@/functions/Auth/ProtectedRoute';
import PlaygroundPage from './Playground';

export default function Page() {

  return (
    <ProtectedRoute>
        <PlaygroundPage />
    </ProtectedRoute>
  )
}
