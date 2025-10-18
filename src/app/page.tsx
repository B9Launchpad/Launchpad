import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/functions/Auth/ProtectedRoute';

export default function Page() {

  return (
      <ProtectedRoute>
        <MainLayout>
              <></>
        </MainLayout>
      </ProtectedRoute>
  )
}
