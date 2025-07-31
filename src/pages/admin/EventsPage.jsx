import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    eid: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await eventService.findEvents(filters);
      setEvents(response.event || []);
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
    await fetchEvents(activeFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const eventData = {
        ...createFormData,
        dateFrom: new Date(createFormData.dateFrom).toISOString(),
        dateTo: new Date(createFormData.dateTo).toISOString()
      };
      await eventService.createEvent(eventData);
      setSuccess('Evento creado correctamente');
      setCreateFormData({ name: '', description: '', dateFrom: '', dateTo: '' });
      setShowCreateForm(false);
      await fetchEvents();
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

  const handleEditEvent = (event) => {
    setEditingEvent(event.eid);
    setEditFormData({
      name: event.name,
      description: event.description || '',
      dateFrom: formatDateForInput(event.dateFrom),
      dateTo: formatDateForInput(event.dateTo)
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

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const eventData = {
        ...editFormData,
        dateFrom: new Date(editFormData.dateFrom).toISOString(),
        dateTo: new Date(editFormData.dateTo).toISOString()
      };
      await eventService.editEvent(editingEvent, eventData);
      setSuccess('Evento actualizado correctamente');
      setEditingEvent(null);
      await fetchEvents();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eid, eventName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el evento "${eventName}"?`)) {
      try {
        setLoading(true);
        await eventService.deleteEvent(eid);
        setSuccess('Evento eliminado correctamente');
        await fetchEvents();
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setEditFormData({});
    setErrors({});
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setCreateFormData({ name: '', description: '', dateFrom: '', dateTo: '' });
    setErrors({});
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (dateFrom, dateTo) => {
    const now = new Date();
    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    if (now < start) {
      return { status: 'upcoming', label: 'Próximo', color: '#3b82f6' };
    } else if (now >= start && now <= end) {
      return { status: 'active', label: 'En curso', color: '#22c55e' };
    } else {
      return { status: 'finished', label: 'Finalizado', color: '#6b7280' };
    }
  };

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Gestión de Eventos</h1>
        <p>Administra todos los eventos del sistema deportivo</p>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="create-event-btn"
        >
          + Crear Nuevo Evento
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
        <Card title="Crear Nuevo Evento" className="create-card">
          <form onSubmit={handleCreateEvent} className="create-form">
            <div className="create-grid">
              <Input
                label="Nombre del Evento"
                type="text"
                name="name"
                value={createFormData.name}
                onChange={handleCreateChange}
                placeholder="Ej: Torneo de Fútbol 2024"
                required
              />
              <Input
                label="Descripción"
                type="text"
                name="description"
                value={createFormData.description}
                onChange={handleCreateChange}
                placeholder="Descripción del evento (opcional)"
              />
              <Input
                label="Fecha y Hora de Inicio"
                type="datetime-local"
                name="dateFrom"
                value={createFormData.dateFrom}
                onChange={handleCreateChange}
                required
              />
              <Input
                label="Fecha y Hora de Finalización"
                type="datetime-local"
                name="dateTo"
                value={createFormData.dateTo}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="create-actions">
              <Button type="submit" variant="primary" disabled={loading}>
                Crear Evento
              </Button>
              <Button type="button" variant="outline" onClick={cancelCreate}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Buscar Eventos" className="search-card">
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
              label="ID del Evento"
              type="text"
              name="eid"
              value={searchFilters.eid}
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
                setSearchFilters({name: '', eid: ''});
                fetchEvents();
              }}
            >
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Lista de Eventos" className="events-card">
        {loading ? (
          <LoadingSpinner size="large" />
        ) : (
          <div className="events-table">
            {events.length === 0 ? (
              <p className="no-events">No se encontraron eventos</p>
            ) : (
              events.map(event => {
                const eventStatus = getEventStatus(event.dateFrom, event.dateTo);
                return (
                  <div key={event.eid} className="event-item">
                    {editingEvent === event.eid ? (
                      <form onSubmit={handleUpdateEvent} className="edit-form">
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
                          <Input
                            label="Fecha de Inicio"
                            type="datetime-local"
                            name="dateFrom"
                            value={editFormData.dateFrom}
                            onChange={handleEditChange}
                            required
                          />
                          <Input
                            label="Fecha de Finalización"
                            type="datetime-local"
                            name="dateTo"
                            value={editFormData.dateTo}
                            onChange={handleEditChange}
                            required
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
                      <div className="event-info">
                        <div className="event-header">
                          <h3>{event.name}</h3>
                          <div 
                            className="event-status"
                            style={{ backgroundColor: eventStatus.color }}
                          >
                            {eventStatus.label}
                          </div>
                        </div>
                        <div className="event-details">
                          <p><strong>ID:</strong> {event.eid}</p>
                          {event.description && <p><strong>Descripción:</strong> {event.description}</p>}
                          <p><strong>Inicio:</strong> {formatDisplayDate(event.dateFrom)}</p>
                          <p><strong>Finalización:</strong> {formatDisplayDate(event.dateTo)}</p>
                          <p><strong>Creado:</strong> {new Date(event.createdAt).toLocaleDateString()}</p>
                          <p><strong>Actualizado:</strong> {new Date(event.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="event-actions">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleEditEvent(event)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDeleteEvent(event.eid, event.name)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventsPage;
