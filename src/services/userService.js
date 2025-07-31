import api from './api.js';

export const userService = {
  async findUsers(filters = {}, limit = 10, from = 0) {
    try {
      const response = await api.post('/user/findUsers', filters, {
        params: { limit, from }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  async editUser(uid, userData) {
    try {
      const response = await api.put(`/user/editUser/${uid}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to edit user' };
    }
  },

  async deleteUser(uid) {
    try {
      const response = await api.delete(`/user/deleteUser/${uid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  async showProfile() {
    try {
      const response = await api.get('/user/showProfile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  async editUserProfile(userData) {
    try {
      const response = await api.put('/user/editUserProfile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  async changeUserPassword(password, confirmation) {
    try {
      const response = await api.put('/user/changeUserPassword', { 
        password, 
        confirmation 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  }
};
