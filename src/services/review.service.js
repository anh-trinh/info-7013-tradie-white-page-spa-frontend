import apiClient from './api';

export default {
  createReview(reviewData) {
    return apiClient.post('/api/reviews', reviewData);
  },
  // Fetch the current user's review for a given booking (if any)
  getMyReviewForBooking(bookingId) {
    // Assumed endpoint; adjust if your backend differs
    return apiClient.get(`/api/bookings/${bookingId}/review`);
  },
  // Admin APIs
  getAllReviews() {
    return apiClient.get('/api/admin/reviews');
  },
  deleteReview(id) {
    return apiClient.delete(`/api/admin/reviews/${id}`);
  }
  // Add more APIs as needed
};