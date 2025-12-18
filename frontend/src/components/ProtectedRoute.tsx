import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const user = authService.getUser();
    if (!user || !requiredRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
