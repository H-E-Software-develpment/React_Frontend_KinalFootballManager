import { useState, useEffect } from 'react';
import { userService } from '../services/userService.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    academic: ''
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.showProfile();
      const { name, email, phone, academic } = response.user;
      setProfileData({ name, email, phone, academic: academic || '' });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await userService.editUserProfile(profileData);
      setSuccess('Perfil actualizado correctamente');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.confirmation) {
      setErrors({ confirmation: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await userService.changeUserPassword(passwordData.password, passwordData.confirmation);
      setSuccess('Contraseña cambiada correctamente');
      setPasswordData({ password: '', confirmation: '' });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.name) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y configuración</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Información Personal
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Cambiar Contraseña
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      {activeTab === 'info' && (
        <Card title="Información Personal" className="profile-card">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
              error={errors.name}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
              error={errors.email}
            />

            <Input
              label="Teléfono"
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              required
              error={errors.phone}
            />

            <Input
              label="Código Académico"
              type="text"
              name="academic"
              value={profileData.academic}
              onChange={handleProfileChange}
              error={errors.academic}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="profile-submit-btn"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Actualizar Información'}
            </Button>
          </form>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card title="Cambiar Contraseña" className="profile-card">
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <Input
              label="Nueva Contraseña"
              type="password"
              name="password"
              value={passwordData.password}
              onChange={handlePasswordChange}
              required
              error={errors.password}
            />

            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              name="confirmation"
              value={passwordData.confirmation}
              onChange={handlePasswordChange}
              required
              error={errors.confirmation}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="profile-submit-btn"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Cambiar Contraseña'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
