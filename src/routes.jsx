import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './shared/ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <UsersPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
