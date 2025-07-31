import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: error.message || 'Error al iniciar sesión'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Card title="Iniciar Sesión" className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="alert alert-error">
                {errors.general}
              </div>
            )}

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              placeholder="ejemplo@correo.com"
              required
              error={errors.email}
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
              placeholder="Tu contraseña"
              required
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Iniciar Sesión'}
            </Button>

            <div className="auth-footer">
              <p>
                ¿No tienes cuenta? 
                <Link to="/register" className="auth-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
