import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import UsersPage from './pages/admin/UsersPage.jsx';
import FieldsPage from './pages/admin/FieldsPage.jsx';
import EventsPage from './pages/admin/EventsPage.jsx';
import PaymentsPage from './pages/student/PaymentsPage.jsx';
import AddPaymentPage from './pages/student/AddPaymentPage.jsx';
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
        element: <StudentDashboard />
      },
      {
        path: 'admin-dashboard',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'student-dashboard',
        element: <StudentDashboard />
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
      },
      {
        path: 'fields',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <FieldsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'events',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <EventsPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'payments',
        element: <PaymentsPage />
      },
      {
        path: 'add-payment',
        element: <AddPaymentPage />
      }
    ]
  }
]);
