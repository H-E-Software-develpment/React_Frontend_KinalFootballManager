import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import Card from '../components/Card.jsx';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user && user.role === 'ADMINSTRATOR') {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="student-dashboard">
      <div className="page-header">
        <h1>Portal del Estudiante</h1>
        <p>Bienvenido, {user?.name}. Gestiona tu perfil y reservas desde aquí.</p>
      </div>

      <div className="dashboard-grid">
        <Card title="Mi Información Personal" className="dashboard-card hover-lift">
          <div className="student-info">
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
              <span className="info-value role-badge-student">Estudiante</span>
            </div>
          </div>
          <div className="card-actions">
            <a href="/profile" className="card-link">
              <span>Editar Perfil</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </Card>

        <Card title="Reservas del Campo" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Próximamente: Sistema de reservas del campo de fútbol.</p>
            <div className="feature-preview">
              <div className="preview-item">
                <div className="preview-icon">📅</div>
                <span>Horarios disponibles</span>
              </div>
              <div className="preview-item">
                <div className="preview-icon">⚽</div>
                <span>Reservar campo</span>
              </div>
              <div className="preview-item">
                <div className="preview-icon">📋</div>
                <span>Mis reservas</span>
              </div>
            </div>
            <div className="coming-soon">
              <span className="coming-soon-badge">Próximamente</span>
            </div>
          </div>
        </Card>

        <Card title="Configuración de Cuenta" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Gestiona la configuración y seguridad de tu cuenta.</p>
            <div className="config-options">
              <div className="config-item">
                <div className="config-icon">🔒</div>
                <div className="config-details">
                  <h4>Cambiar Contraseña</h4>
                  <p>Actualiza tu contraseña para mayor seguridad</p>
                </div>
              </div>
              <div className="config-item">
                <div className="config-icon">📝</div>
                <div className="config-details">
                  <h4>Actualizar Información</h4>
                  <p>Mantén tu información personal actualizada</p>
                </div>
              </div>
            </div>
          </div>
          <a href="/profile" className="card-link">
            <span>Configurar Cuenta</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Card>

        <Card title="Actividad Reciente" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Tu actividad reciente en el sistema:</p>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-details">
                  <span>Perfil actualizado</span>
                  <span className="activity-time">Último acceso</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🔐</div>
                <div className="activity-details">
                  <span>Sesión iniciada</span>
                  <span className="activity-time">Hoy</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Ayuda y Soporte" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>¿Necesitas ayuda? Encuentra información útil aquí.</p>
            <div className="help-links">
              <div className="help-item">
                <div className="help-icon">❓</div>
                <span>Preguntas frecuentes</span>
              </div>
              <div className="help-item">
                <div className="help-icon">📞</div>
                <span>Contactar soporte</span>
              </div>
              <div className="help-item">
                <div className="help-icon">📖</div>
                <span>Manual de usuario</span>
              </div>
            </div>
            <div className="coming-soon">
              <span className="coming-soon-badge">Próximamente</span>
            </div>
          </div>
        </Card>

        <Card title="Estadísticas Personales" className="dashboard-card hover-lift">
          <div className="card-description">
            <p>Próximamente: Estadísticas de tu uso del sistema.</p>
            <div className="stats-preview">
              <div className="stat-item">
                <span className="stat-number">---</span>
                <span className="stat-label">Reservas realizadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">---</span>
                <span className="stat-label">Horas de campo</span>
              </div>
            </div>
            <div className="coming-soon">
              <span className="coming-soon-badge">Próximamente</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
