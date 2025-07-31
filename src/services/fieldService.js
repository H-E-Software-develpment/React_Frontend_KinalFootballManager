import api from './api.js';

export const fieldService = {
  async findFields(filters = {}, limit = 10, from = 0) {
    try {
      const response = await api.post('/field/findFields', filters, {
        params: { limit, from }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch fields' };
    }
  },

  async createField(fieldData) {
    try {
      const response = await api.post('/field/createField', fieldData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create field' };
    }
  },

  async editField(fid, fieldData) {
    try {
      const response = await api.put(`/field/editField/${fid}`, fieldData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to edit field' };
    }
  },

  async deleteField(fid) {
    try {
      const response = await api.delete(`/field/deleteField/${fid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete field' };
    }
  }
};
