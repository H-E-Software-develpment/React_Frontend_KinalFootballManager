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
        <Card title="Mi Información" className="dashboard-card">
          <div className="user-info">
            <p><strong>Nombre:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Teléfono:</strong> {user?.phone}</p>
            {user?.academic && (
              <p><strong>Código Académico:</strong> {user.academic}</p>
            )}
            <p><strong>Rol:</strong> {user?.role === 'ADMINSTRATOR' ? 'Administrador' : 'Estudiante'}</p>
          </div>
        </Card>

        {isAdmin && (
          <>
            <Card title="Gestión de Usuarios" className="dashboard-card">
              <p>Como administrador, puedes gestionar todos los usuarios del sistema.</p>
              <a href="/users" className="card-link">Ver Usuarios</a>
            </Card>

            <Card title="Estadísticas" className="dashboard-card">
              <p>Próximamente: Estadísticas del sistema y uso del campo.</p>
            </Card>
          </>
        )}

        <Card title="Mi Perfil" className="dashboard-card">
          <p>Gestiona tu información personal y configuración de cuenta.</p>
          <a href="/profile" className="card-link">Ver Perfil</a>
        </Card>

        <Card title="Reservas" className="dashboard-card">
          <p>Próximamente: Sistema de reservas del campo de fútbol.</p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
