<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Quote Requests</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    
    <div v-else-if="quotes.length === 0" class="text-center text-gray-500">
      You have no active quote requests.
    </div>

    <div v-else class="space-y-6">
      <div v-for="quote in quotes" :key="quote.id" class="border border-gray-200 rounded-lg p-6">
        <h4 class="font-bold text-lg">{{ quote.job_description }}</h4>
        <p class="text-sm text-gray-500 mb-4">Status: <span class="font-semibold" :class="statusClass(quote.status)">{{ quote.status }}</span></p>
        
        <div class="mt-4 flex flex-wrap gap-3">
            <button v-if="quote.status === 'responded'" class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Accept</button>
            <button v-if="quote.status === 'responded'" class="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Counter Offer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';

const quotes = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await bookingService.getQuotes();
    quotes.value = response.data;
  } catch (err) {
    error.value = 'Failed to load quote requests.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const statusClass = (status) => {
  if (status === 'responded') return 'text-blue-600';
  if (status === 'accepted') return 'text-green-600';
  if (status === 'pending') return 'text-gray-600';
  return '';
};
</script>
