import apiClient from './api';

export default {
  // User APIs
  getQuotes() {
    return apiClient.get('/api/quotes');
  },
  getBookings() {
    return apiClient.get('/api/bookings');
  },
  // Admin APIs
  getAllBookings() {
    return apiClient.get('/api/admin/bookings');
  }
};