<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Review Management</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading reviews...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="space-y-4">
      <div v-for="review in reviews" :key="review.id" class="border p-4 rounded-lg" :class="getReviewClass(review)">
        <p class="font-bold">{{ review.resident_name }} → {{ review.tradie_name }}</p>
        <div class="flex items-center my-2 space-x-2">
          <StarRating :rating="review.rating" />
          <span class="text-sm text-gray-600">({{ review.rating }}/5)</span>
        </div>
        <p class="text-gray-700 italic mb-2">"{{ review.comment }}"</p>
        <p class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</p>
        
        <p v-if="review.is_flagged" class="text-xs text-red-600 font-semibold mt-1">▲ Flagged for review</p>
        
        <div class="mt-2 space-x-2">
          <button v-if="review.is_flagged" @click="approveReview(review)" class="text-green-500 font-medium">Approve</button>
          <button @click="deleteReview(review)" class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StarRating from '@/components/shared/StarRating.vue';
// import reviewService from '@/services/review.service'; // Uncomment when API is ready

const reviews = ref([
  // Sample data for demonstration
  {
    id: 1,
    resident_name: 'Sarah J.',
    tradie_name: "Mike's Plumbing",
    rating: 5,
    comment: 'Excellent service! Mike was punctual and professional.',
    created_at: '2024-03-15T10:30:00Z',
    is_flagged: false
  },
  {
    id: 2,
    resident_name: 'John D.',
    tradie_name: 'ABC Electrical',
    rating: 1,
    comment: 'Poor service and overcharged. Would not recommend.',
    created_at: '2024-03-14T14:20:00Z',
    is_flagged: true
  },
  {
    id: 3,
    resident_name: 'Lisa M.',
    tradie_name: 'Garden Care Pro',
    rating: 4,
    comment: 'Good work on the garden maintenance. Very satisfied.',
    created_at: '2024-03-13T09:15:00Z',
    is_flagged: false
  }
]);

const loading = ref(false);
const error = ref(null);

// Uncomment this when API is ready
// onMounted(async () => {
//   try {
//     const response = await reviewService.getAllReviews();
//     reviews.value = response.data;
//   } catch (err) {
//     error.value = 'Failed to load reviews.';
//     console.error(err);
//   } finally {
//     loading.value = false;
//   }
// });

const approveReview = (review) => {
  review.is_flagged = false;
  // TODO: Call API to approve review
  console.log('Approving review:', review);
};

const deleteReview = (review) => {
  if (confirm('Are you sure you want to delete this review?')) {
    const index = reviews.value.findIndex(r => r.id === review.id);
    if (index > -1) {
      reviews.value.splice(index, 1);
    }
    // TODO: Call API to delete review
    console.log('Deleting review:', review);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getReviewClass = (review) => {
  if (review.is_flagged) return 'bg-red-50 border-red-300';
  return 'bg-gray-50 border-gray-300';
};
</script>
