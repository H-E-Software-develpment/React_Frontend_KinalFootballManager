import api from './api.js';

export const eventService = {
  async findEvents(filters = {}, limit = 10, from = 0) {
    try {
      const response = await api.post('/event/findEvents', filters, {
        params: { limit, from }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post('/event/createEvent', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create event' };
    }
  },

  async editEvent(eid, eventData) {
    try {
      const response = await api.put(`/event/editEvent/${eid}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to edit event' };
    }
  },

  async deleteEvent(eid) {
    try {
      const response = await api.delete(`/event/deleteEvent/${eid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete event' };
    }
  }
};
