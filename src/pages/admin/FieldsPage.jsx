import { useState, useEffect } from 'react';
import { fieldService } from '../../services/fieldService.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import './FieldsPage.css';

const FieldsPage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    fid: ''
  });
  const [editingField, setEditingField] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await fieldService.findFields(filters);
      setFields(response.field || []);
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
    await fetchFields(activeFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateField = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fieldService.createField(createFormData);
      setSuccess('Campo creado correctamente');
      setCreateFormData({ name: '', description: '' });
      setShowCreateForm(false);
      await fetchFields();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditField = (field) => {
    setEditingField(field.fid);
    setEditFormData({
      name: field.name,
      description: field.description || ''
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

  const handleUpdateField = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fieldService.editField(editingField, editFormData);
      setSuccess('Campo actualizado correctamente');
      setEditingField(null);
      await fetchFields();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (fid, fieldName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el campo "${fieldName}"?`)) {
      try {
        setLoading(true);
        await fieldService.deleteField(fid);
        setSuccess('Campo eliminado correctamente');
        await fetchFields();
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditFormData({});
    setErrors({});
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setCreateFormData({ name: '', description: '' });
    setErrors({});
  };

  return (
    <div className="fields-page">
      <div className="page-header">
        <h1>Gestión de Campos</h1>
        <p>Administra todos los campos deportivos del sistema</p>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="create-field-btn"
        >
          + Crear Nuevo Campo
        </Button>
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

      {showCreateForm && (
        <Card title="Crear Nuevo Campo" className="create-card">
          <form onSubmit={handleCreateField} className="create-form">
            <div className="create-grid">
              <Input
                label="Nombre del Campo"
                type="text"
                name="name"
                value={createFormData.name}
                onChange={handleCreateChange}
                placeholder="Ej: Campo de Fútbol Principal"
                required
              />
              <Input
                label="Descripción"
                type="text"
                name="description"
                value={createFormData.description}
                onChange={handleCreateChange}
                placeholder="Descripción del campo (opcional)"
              />
            </div>
            <div className="create-actions">
              <Button type="submit" variant="primary" disabled={loading}>
                Crear Campo
              </Button>
              <Button type="button" variant="outline" onClick={cancelCreate}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Buscar Campos" className="search-card">
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
              label="ID del Campo"
              type="text"
              name="fid"
              value={searchFilters.fid}
              onChange={handleFilterChange}
              placeholder="Buscar por ID"
            />
          </div>

          <div className="search-actions">
            <Button type="submit" variant="primary" disabled={loading}>
              Buscar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setSearchFilters({name: '', fid: ''});
                fetchFields();
              }}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Lista de Campos" className="fields-card">
        {loading ? (
          <LoadingSpinner size="large" />
        ) : (
          <div className="fields-table">
            {fields.length === 0 ? (
              <p className="no-fields">No se encontraron campos</p>
            ) : (
              fields.map(field => (
                <div key={field.fid} className="field-item">
                  {editingField === field.fid ? (
                    <form onSubmit={handleUpdateField} className="edit-form">
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
                          label="Descripción"
                          type="text"
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                        />
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
                    <div className="field-info">
                      <div className="field-details">
                        <h3>{field.name}</h3>
                        <p><strong>ID:</strong> {field.fid}</p>
                        {field.description && <p><strong>Descripción:</strong> {field.description}</p>}
                        <p><strong>Fecha de creación:</strong> {new Date(field.createdAt).toLocaleDateString()}</p>
                        <p><strong>Última actualización:</strong> {new Date(field.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="field-actions">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleEditField(field)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteField(field.fid, field.name)}
                        >
                          Eliminar
                        </Button>
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

export default FieldsPage;
