import { useState, useEffect } from 'react';
import { userService } from '../services/userService.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    email: '',
    academic: '',
    role: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await userService.findUsers(filters);
      setUsers(response.user || []);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, value]) => value.trim() !== '')
    );
    await fetchUsers(activeFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditUser = (user) => {
    setEditingUser(user.uid);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      academic: user.academic || '',
      role: user.role
    });
    setErrors({});
    setSuccess('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userService.editUser(editingUser, editFormData);
      setSuccess('Usuario actualizado correctamente');
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userName}?`)) {
      try {
        setLoading(true);
        await userService.deleteUser(uid);
        setSuccess('Usuario eliminado correctamente');
        await fetchUsers();
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
    setErrors({});
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra todos los usuarios del sistema</p>
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

      <Card title="Buscar Usuarios" className="search-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-grid">
            <Input
              label="Nombre"
              type="text"
              name="name"
              value={searchFilters.name}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={searchFilters.email}
              onChange={handleFilterChange}
              placeholder="Buscar por email"
            />

            <Input
              label="Código Académico"
              type="text"
              name="academic"
              value={searchFilters.academic}
              onChange={handleFilterChange}
              placeholder="Buscar por código"
            />

            <div className="input-group">
              <label className="input-label">Rol</label>
              <select
                name="role"
                value={searchFilters.role}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Todos los roles</option>
                <option value="STUDENT">Estudiante</option>
                <option value="ADMINSTRATOR">Administrador</option>
              </select>
            </div>
          </div>

          <div className="search-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              Buscar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setSearchFilters({name: '', email: '', academic: '', role: ''});
                fetchUsers();
              }}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Lista de Usuarios" className="users-card">
        {loading ? (
          <LoadingSpinner size="large" />
        ) : (
          <div className="users-table">
            {users.length === 0 ? (
              <p className="no-users">No se encontraron usuarios</p>
            ) : (
              users.map(user => (
                <div key={user.uid} className="user-item">
                  {editingUser === user.uid ? (
                    <form onSubmit={handleUpdateUser} className="edit-form">
                      <div className="edit-grid">
                        <Input
                          label="Nombre"
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          required
                        />
                        <Input
                          label="Teléfono"
                          type="tel"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditChange}
                          required
                        />
                        <Input
                          label="Código Académico"
                          type="text"
                          name="academic"
                          value={editFormData.academic}
                          onChange={handleEditChange}
                        />
                        <div className="input-group">
                          <label className="input-label">Rol</label>
                          <select
                            name="role"
                            value={editFormData.role}
                            onChange={handleEditChange}
                            className="input-field"
                          >
                            <option value="STUDENT">Estudiante</option>
                            <option value="ADMINSTRATOR">Administrador</option>
                          </select>
                        </div>
                      </div>
                      <div className="edit-actions">
                        <Button type="submit" variant="primary" size="small" disabled={loading}>
                          Guardar
                        </Button>
                        <Button type="button" variant="outline" size="small" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="user-info">
                      <div className="user-details">
                        <h3>{user.name}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Teléfono:</strong> {user.phone}</p>
                        {user.academic && <p><strong>Código:</strong> {user.academic}</p>}
                        <p><strong>Rol:</strong> {user.role === 'ADMINSTRATOR' ? 'Administrador' : 'Estudiante'}</p>
                        <p><strong>Fecha:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="user-actions">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          Editar
                        </Button>
                        {user.role === 'STUDENT' && (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDeleteUser(user.uid, user.name)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
