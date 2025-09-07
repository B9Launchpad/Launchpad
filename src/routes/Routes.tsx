import { useRoutes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import IntroRoutes from './IntroRoutes';
//import DashboardRoutes from './DashboardRoutes';
// import more microservice routes as needed

export default function AppRoutes() {
  const routes = useRoutes([
    {
      path: 'login/*',
      element: <AuthRoutes />,
    },
    {
      path: 'onboarding/*',
      element: <IntroRoutes />
    }
  ]);

  return routes;
}