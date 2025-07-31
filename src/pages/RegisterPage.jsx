import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../shared/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import InteractiveBackground from '../components/InteractiveBackground.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    academic: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
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

  const validateForm = () => {
    const newErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.phone && formData.phone.length !== 8) {
      newErrors.phone = 'El teléfono debe tener 8 dígitos';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErrors({
        general: error.message || 'Error al registrar usuario'
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <InteractiveBackground />
        <div className="auth-container">
          <Card className="auth-card">
            <div className="success-message">
              <h2>¡Registro Exitoso!</h2>
              <p>Tu cuenta ha sido creada correctamente. Redirigiendo al login...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <InteractiveBackground />
      <div className="auth-container">
        <Card title="Crear Cuenta" className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="alert alert-error">
                {errors.general}
              </div>
            )}

            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              error={errors.name}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
              error={errors.email}
            />

            <Input
              label="Teléfono"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="12345678"
              required
              error={errors.phone}
            />

            <Input
              label="Código Académico"
              type="text"
              name="academic"
              value={formData.academic}
              onChange={handleChange}
              placeholder="Tu código académico"
              error={errors.academic}
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
              error={errors.password}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Crear Cuenta'}
            </Button>

            <div className="auth-footer">
              <p>
                ¿Ya tienes cuenta? 
                <Link to="/login" className="auth-link">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
