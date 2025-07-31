import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard
      if (user.role === 'ADMINSTRATOR') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/student-dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  // This should rarely be seen as users will be redirected immediately
  return (
    <div className="dashboard-redirect">
      <LoadingSpinner size="large" />
      <p>Redirigiendo al dashboard...</p>
    </div>
  );
};

export default DashboardPage;
