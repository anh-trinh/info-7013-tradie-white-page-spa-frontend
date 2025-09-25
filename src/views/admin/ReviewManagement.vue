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
          <button @click="openDeleteModal(review)" class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeDeleteModal"></div>
      <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6">
        <h3 class="text-xl font-bold mb-2">Delete Review</h3>
        <p>Are you sure you want to delete this review?</p>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="closeDeleteModal" class="px-4 py-2 rounded-md border">Cancel</button>
          <button @click="confirmDelete" :disabled="deleting" class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
            <span v-if="deleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StarRating from '@/components/shared/StarRating.vue';
import reviewService from '@/services/review.service';
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const deleting = ref(false);
const toDelete = ref(null);

onMounted(async () => {
  try {
    const response = await reviewService.getAllReviews();
    reviews.value = response.data;
  } catch (err) {
    error.value = 'Failed to load reviews.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const approveReview = (review) => {
  review.is_flagged = false;
  // TODO: Call API to approve review
  console.log('Approving review:', review);
};

function openDeleteModal(review) {
  toDelete.value = review;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

async function confirmDelete() {
  if (!toDelete.value) return;
  try {
    deleting.value = true;
    await reviewService.deleteReview(toDelete.value.id);
    const index = reviews.value.findIndex(r => r.id === toDelete.value.id);
    if (index > -1) reviews.value.splice(index, 1);
    closeDeleteModal();
  } catch (err) {
    console.error('Failed to delete review', err);
  } finally {
    deleting.value = false;
  }
}

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
