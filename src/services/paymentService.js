import api from './api.js';

export const paymentService = {
  async findPayments(filters = {}, limit = 10, from = 0) {
    try {
      const response = await api.post('/payment/findPayments', filters, {
        params: { limit, from }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
    }
  },

  async createPayment(paymentData) {
    try {
      const response = await api.post('/payment/createPayment', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register payment method' };
    }
  },

  async deletePayment(pid) {
    try {
      const response = await api.delete(`/payment/deletePayment/${pid}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete payment method' };
    }
  }
};
