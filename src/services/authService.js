import api from './api.js';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  async register(userData) {
    try {
      // Ensure the data format matches backend expectations
      const registerData = {
        name: userData.name?.trim(),
        email: userData.email?.trim(),
        phone: userData.phone?.trim(),
        password: userData.password,
        academic: userData.academic?.trim() || undefined
      };

      // Remove undefined values
      Object.keys(registerData).forEach(key => {
        if (registerData[key] === undefined || registerData[key] === '') {
          delete registerData[key];
        }
      });

      console.log('Sending registration data:', registerData);

      const response = await api.post('/auth/register', registerData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
