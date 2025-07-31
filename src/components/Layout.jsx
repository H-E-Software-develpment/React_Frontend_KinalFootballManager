import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import Button from './Button.jsx';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>Kinal Football Manager</h2>
          </div>
          
          <div className="nav-links">
            <NavLink
              to={isAdmin ? "/admin-dashboard" : "/student-dashboard"}
              className="nav-link"
            >
              Dashboard
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              Perfil
            </NavLink>
            {isAdmin && (
              <NavLink to="/users" className="nav-link">
                Usuarios
              </NavLink>
            )}
          </div>

          <div className="nav-user">
            <span className="user-welcome">Hola, {user?.name}</span>
            <Button variant="outline" size="small" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
