import apiClient from './api';

export default {
  // User APIs
  getQuotes() {
    return apiClient.get('/api/quotes');
  },
  getQuoteById(id) {
    return apiClient.get(`/api/quotes/${id}`);
  },
  addQuoteMessage(id, messageData) {
    return apiClient.post(`/api/quotes/${id}/messages`, messageData);
  },
  getBookings() {
    return apiClient.get('/api/bookings');
  },
  createBooking(payload) {
    return apiClient.post('/api/bookings', payload);
  },
  // Admin APIs
  getAllBookings() {
    return apiClient.get('/api/admin/bookings');
  }
};