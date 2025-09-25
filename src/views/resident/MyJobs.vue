<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Jobs</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    
    <div v-else-if="bookings.length === 0" class="text-center text-gray-500">
      You have no active jobs.
    </div>

    <div v-else class="space-y-6">
      <div v-for="booking in bookings" :key="booking.id" class="border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-bold text-lg">{{ booking.job_description }}</p>
            <p class="text-sm text-gray-500">
              {{ booking.tradie_name }} 
              <span v-if="booking.completed_date">- Completed on {{ formatDate(booking.completed_date) }}</span>
              <span v-else-if="booking.scheduled_date">- Scheduled for {{ formatDate(booking.scheduled_date) }}</span>
            </p>
            
            <!-- Show star rating if job is completed and has a review -->
            <div v-if="booking.status === 'completed' && booking.review" class="flex items-center mt-2 space-x-2">
              <StarRating :rating="booking.review.rating" />
              <span class="text-sm text-gray-600">Your review</span>
            </div>
            
            <div class="mt-4 flex gap-3">
              <button v-if="booking.status === 'completed' && !booking.review" class="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Leave Review</button>
              <button v-if="booking.status === 'completed'" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">View Invoice</button>
              <button v-if="booking.status === 'scheduled'" class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Reschedule</button>
              <button v-if="booking.status === 'scheduled'" class="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-semibold">Cancel</button>
            </div>
          </div>
          <span class="font-semibold px-3 py-1 rounded-full text-sm ml-4" :class="statusClass(booking.status)">
            {{ booking.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';
import StarRating from '@/components/shared/StarRating.vue';

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await bookingService.getBookings();
    bookings.value = response.data;
  } catch (err) {
    error.value = 'Failed to load jobs.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800';
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800';
  if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};
</script>
