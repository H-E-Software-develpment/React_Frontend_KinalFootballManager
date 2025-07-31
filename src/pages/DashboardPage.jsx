import { useAuth } from '../shared/AuthContext.jsx';
import Card from '../components/Card.jsx';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al Sistema de Gestión de Campo de Fútbol Kinal</p>
      </div>

      <div className="dashboard-grid">
        <Card title="Mi Información" className="dashboard-card hover-lift">
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{user?.phone}</span>
            </div>
            {user?.academic && (
              <div className="info-item">
                <span className="info-label">Código Académico:</span>
                <span className="info-value">{user.academic}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Rol:</span>
              <span className="info-value role-badge">
                {user?.role === 'ADMINSTRATOR' ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          </div>
        </Card>

        {isAdmin && (
          <>
            <Card title="Gestión de Usuarios" className="dashboard-card hover-lift">
              <div className="card-description">
                <p>Como administrador, puedes gestionar todos los usuarios del sistema.</p>
                <div className="card-features">
                  <span className="feature-tag">Buscar usuarios</span>
                  <span className="feature-tag">Editar perfiles</span>
                  <span className="feature-tag">Gestionar roles</span>
                </div>
              </div>
              <a href="/users" className="card-link">
                <span>Ver Usuarios</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </Card>

            <Card title="Estadísticas" className="dashboard-card hover-lift">
              <div className="card-description">
                <p>Próximamente: Estadísticas del sistema y uso del campo.</p>
                <div className="stats-preview">
                  <div className="stat-item">
                    <span className="stat-number">---</span>
                    <span className="stat-label">Usuarios Total</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">---</span>
                    <span className="stat-label">Reservas Hoy</span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        <Card title="Mi Perfil" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Gestiona tu información personal y configuración de cuenta.</p>
            <div className="card-features">
              <span className="feature-tag">Editar información</span>
              <span className="feature-tag">Cambiar contraseña</span>
              <span className="feature-tag">Configuración</span>
            </div>
          </div>
          <a href="/profile" className="card-link">
            <span>Ver Perfil</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Card>

        <Card title="Reservas" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Próximamente: Sistema de reservas del campo de fútbol.</p>
            <div className="coming-soon">
              <span className="coming-soon-badge">Próximamente</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
