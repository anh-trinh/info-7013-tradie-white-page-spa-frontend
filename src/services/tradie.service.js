import apiClient from './api';

export default {
  getCategories() {
    return apiClient.get('/api/services');
  },
  // Admin APIs
  createCategory(categoryData) {
    return apiClient.post('/api/admin/categories', categoryData);
  },
  deleteCategory(id) {
    return apiClient.delete(`/api/admin/categories/${id}`);
  },
  getTradieProfile(accountId) {
    return apiClient.get(`/api/tradies/${accountId}`);
  },
  updateTradieProfile(profileData) {
    // New endpoint: update current user's tradie profile without accountId in URL
    return apiClient.put(`/api/tradies/profile`, profileData);
  },
  createTradieProfile(profileData) {
    return apiClient.post('/api/tradies', profileData);
  },
  updateCategory(id, categoryData) {
    return apiClient.put(`/api/admin/categories/${id}`, categoryData);
  }
};