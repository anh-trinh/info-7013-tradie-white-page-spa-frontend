import apiClient from './api';

export default {
  getProfile() {
    return apiClient.get('/api/accounts/me');
  },
  updateProfile(profileData) {
    return apiClient.put('/api/accounts/me', profileData);
  },
  // Admin APIs
  getAllAccounts() {
    return apiClient.get('/api/admin/accounts');
  },
  updateAccountStatus(id, status) {
    return apiClient.put(`/api/admin/accounts/${id}/status`, { status });
  }
};