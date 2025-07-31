import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import { userService } from '../services/userService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  // Redirect students to student dashboard
  useEffect(() => {
    if (user && user.role !== 'ADMINSTRATOR') {
      navigate('/student-dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Get all users count
      const allUsers = await userService.findUsers({}, 100, 0);
      
      // Get students count
      const students = await userService.findUsers({ role: 'STUDENT' }, 100, 0);
      
      // Get admins count
      const admins = await userService.findUsers({ role: 'ADMINSTRATOR' }, 100, 0);
      
      // Get recent users (last 5)
      const recent = await userService.findUsers({}, 5, 0);

      setStats({
        totalUsers: allUsers.total || 0,
        totalStudents: students.total || 0,
        totalAdmins: admins.total || 0,
        recentUsers: recent.user || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Panel de Administrador</h1>
        <p>Bienvenido, {user?.name}. Gestiona el sistema completo desde aquí.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <Card className="stat-card hover-lift">
          <div className="stat-content">
            <div className="stat-icon users-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Usuarios</p>
            </div>
          </div>
        </Card>

        <Card className="stat-card hover-lift">
          <div className="stat-content">
            <div className="stat-icon students-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V10M22 10L12 15L2 10M22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{stats.totalStudents}</h3>
              <p>Estudiantes</p>
            </div>
          </div>
        </Card>

        <Card className="stat-card hover-lift">
          <div className="stat-content">
            <div className="stat-icon admins-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C16.4183 15 20 11.4183 20 7C20 2.58172 16.4183 -1 12 -1C7.58172 -1 4 2.58172 4 7C4 11.4183 7.58172 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-info">
              <h3>{stats.totalAdmins}</h3>
              <p>Administradores</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="dashboard-grid">
        <Card title="Gestión de Usuarios" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Administra todos los usuarios del sistema. Busca, edita y gestiona cuentas de estudiantes.</p>
            <div className="card-features">
              <span className="feature-tag">Buscar usuarios</span>
              <span className="feature-tag">Editar estudiantes</span>
              <span className="feature-tag">Eliminar cuentas</span>
              <span className="feature-tag">Cambiar roles</span>
            </div>
          </div>
          <a href="/users" className="card-link">
            <span>Gestionar Usuarios</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Card>

        <Card title="Mi Perfil Administrativo" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Gestiona tu información personal y configuración de administrador.</p>
            <div className="admin-info">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rol:</span>
                <span className="info-value role-badge">Administrador</span>
              </div>
            </div>
          </div>
          <a href="/profile" className="card-link">
            <span>Ver Perfil</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Card>

        <Card title="Actividad Reciente" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Últimos usuarios registrados en el sistema:</p>
            <div className="recent-users">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.slice(0, 3).map(recentUser => (
                  <div key={recentUser.uid} className="recent-user-item">
                    <div className="user-avatar">
                      {recentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <span className="user-name">{recentUser.name}</span>
                      <span className="user-role">{recentUser.role === 'ADMINSTRATOR' ? 'Admin' : 'Estudiante'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-recent">No hay usuarios recientes</p>
              )}
            </div>
          </div>
          {stats.recentUsers.length > 3 && (
            <a href="/users" className="card-link">
              <span>Ver Todos</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </Card>

        <Card title="Configuraciones del Sistema" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Próximamente: Configuraciones avanzadas del sistema.</p>
            <div className="coming-soon">
              <span className="coming-soon-badge">Próximamente</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
