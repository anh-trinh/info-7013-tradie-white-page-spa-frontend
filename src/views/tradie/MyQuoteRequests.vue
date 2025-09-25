<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Quote Requests</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    
    <div v-else-if="quotes.length === 0" class="text-center text-gray-500">
      No quote requests at this time.
    </div>

    <div v-else class="space-y-6">
      <div v-for="quote in quotes" :key="quote.id" class="border rounded-lg p-6" :class="getBorderClass(quote.status)">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-lg">{{ quote.job_description }}</h4>
            <p class="text-sm text-gray-600">Requested by {{ quote.resident_name }}</p>
            <p class="text-xs text-gray-500" v-if="quote.address">{{ quote.address }}</p>
          </div>
          <span class="font-semibold px-3 py-1 rounded-full text-sm" :class="statusClass(quote.status)">
            {{ quote.status }}
          </span>
        </div>
        
        <p v-if="quote.details" class="mt-4 text-gray-700 italic">"{{ quote.details }}"</p>
        
        <div v-if="quote.status === 'responded' && quote.quote_amount" class="mt-4 bg-gray-100 p-4 rounded-md">
          <p class="font-semibold text-gray-800">Your Quote: ${{ quote.quote_amount }}</p>
          <p class="text-sm text-gray-600">Waiting for resident to respond.</p>
        </div>
        
        <div v-if="quote.status === 'pending'" class="mt-4 flex flex-wrap gap-3">
          <button @click="sendQuote(quote)" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold">Send Quote</button>
          <button @click="declineQuote(quote)" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">Decline</button>
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

const sendQuote = (quote) => {
  // TODO: Implement quote sending logic
  console.log('Sending quote for:', quote);
};

const declineQuote = (quote) => {
  // TODO: Implement quote declining logic  
  console.log('Declining quote for:', quote);
};

const getBorderClass = (status) => {
  if (status === 'pending') return 'border-blue-300 bg-blue-50';
  return 'border-gray-200';
};

const statusClass = (status) => {
  if (status === 'pending') return 'bg-blue-200 text-blue-800';
  if (status === 'responded') return 'bg-gray-200 text-gray-800';
  if (status === 'accepted') return 'bg-green-200 text-green-800';
  return 'bg-gray-200 text-gray-800';
};
</script>
