import apiClient from './api';

export default {
  createReview(reviewData) {
    return apiClient.post('/api/reviews', reviewData);
  }
  // Add more APIs as needed
};