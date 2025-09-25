<template>
  <div class="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Tradie Details</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="mb-6">
        <h3 class="text-xl font-semibold">
          {{ profile?.business_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Tradie' }}
        </h3>
        <p class="text-gray-600">Phone: {{ profile?.phone_number || 'N/A' }}</p>
        <p class="text-gray-600">Location: {{ profile?.location || profile?.address || 'N/A' }}</p>
        <p class="text-gray-600">Category: {{ profile?.category_name || profile?.category || 'N/A' }}</p>
      </div>

      <div class="border-t pt-6">
        <h3 class="text-xl font-semibold mb-3">Leave a Review</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Rating</label>
            <select v-model.number="rating" class="border rounded w-full p-2">
              <option disabled value="">Select rating</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n > 1 ? 's' : '' }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Comment</label>
            <textarea v-model="comment" rows="4" class="border rounded w-full p-2" placeholder="Share your experience..."></textarea>
          </div>
          <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-700 text-sm">{{ successMessage }}</p>
          <div class="flex gap-3">
            <button @click="submitReview" :disabled="submitting" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
              <span v-if="submitting">Submitting...</span>
              <span v-else>Submit Review</span>
            </button>
            <button @click="goBack" class="px-4 py-2 border rounded">Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import reviewService from '@/services/review.service';
import tradieService from '@/services/tradie.service';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const profile = ref(null);
const rating = ref('');
const comment = ref('');
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const tradieId = route.params.id;
const bookingId = route.query.bookingId;

onMounted(async () => {
  try {
    const { data } = await tradieService.getTradieProfile(tradieId);
    profile.value = data;
  } catch {
    // Non-blocking: still allow review even if profile load fails
  } finally {
    loading.value = false;
  }
});

const submitReview = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (!rating.value) {
    errorMessage.value = 'Please select a rating.';
    return;
  }
  try {
    submitting.value = true;
    const payload = {
      tradie_id: Number(tradieId),
      rating: Number(rating.value),
      comment: comment.value?.trim() || '',
    };
    if (bookingId) payload.booking_id = Number(bookingId);
    await reviewService.createReview(payload);
    successMessage.value = 'Thank you! Your review has been submitted.';
    comment.value = '';
    rating.value = '';
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || err?.message || 'Failed to submit review.';
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
</style>
