import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/functions/Auth/ProtectedRoute';

export default function Page() {

  return (
      <MainLayout>
        <ProtectedRoute>
            <></>
        </ProtectedRoute>
      </MainLayout>
  )
}
