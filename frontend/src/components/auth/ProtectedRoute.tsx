import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // Redirect to auth page if not authenticated
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return <>{children}</>;
};
