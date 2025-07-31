import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMINSTRATOR') {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
