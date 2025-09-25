<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Incoming Quote Requests</h3>

    <div v-if="loading" class="text-center text-gray-500">Loading requests...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="quotes.length === 0" class="text-center text-gray-500">You have no new quote requests.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1">
        <h4 class="font-semibold mb-2">Requests</h4>
        <div class="space-y-4">
          <div v-for="quote in quotes" :key="quote.id"
               @click="selectQuote(quote)"
               class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
               :class="{'bg-blue-50 border-blue-500': selectedQuote && selectedQuote.id === quote.id}">
            <p class="font-bold">{{ quote.job_description }}</p>
            <p class="text-sm text-gray-500">Status: <span class="font-semibold">{{ quote.status }}</span></p>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <div v-if="!selectedQuote" class="text-center text-gray-500 pt-10">
          Select a request from the left to respond.
        </div>
        <div v-else>
          <h4 class="text-xl font-bold mb-4">Request Details</h4>
          <p class="mb-4">{{ selectedQuote.job_description }}</p>

          <div class="space-y-4 border p-4 rounded-md h-64 overflow-y-auto mb-4 bg-gray-50">
            <p v-if="(selectedQuote.messages?.length || 0) === 0" class="text-gray-500">No messages yet. Be the first to respond!</p>
            <div v-for="message in selectedQuote.messages" :key="message.id">
              <p class="text-sm font-semibold">{{ message.sender_account_id === auth.getUser.id ? 'You' : 'Resident' }} said:</p>
              <p class="text-gray-700">{{ message.message }}</p>
              <p v-if="message.offered_price" class="font-bold text-blue-600">Offered Price: ${{ message.offered_price }}</p>
            </div>
          </div>

          <form @submit.prevent="sendQuoteResponse">
            <h5 class="font-semibold mb-2">Send Your Quote</h5>
            <div>
                <label class="block text-sm">Your offered price ($)</label>
                <input v-model.number="offeredPrice" type="number" step="0.01" min="0" placeholder="e.g., 150.00" class="w-full p-2 border rounded-md" required>
            </div>
            <div class="mt-2">
                <label class="block text-sm">Message to Resident</label>
                <textarea v-model="message" placeholder="e.g., This price includes parts and labor..." class="w-full p-2 border rounded-md" required></textarea>
            </div>
            <div class="mt-4">
                <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">Send Quote</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';
import { useAuthStore } from '@/stores/auth.store';

const auth = useAuthStore();
const quotes = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedQuote = ref(null);

// Form state
const message = ref('');
const offeredPrice = ref(null);

// Load quotes assigned to this tradie
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

// When selecting a quote, fetch full details (including messages)
async function selectQuote(quote) {
  try {
    const res = await bookingService.getQuoteById(quote.id);
    selectedQuote.value = res.data;
  } catch (err) {
    console.error('Failed to load quote detail', err);
  }
  // Reset form
  message.value = '';
  offeredPrice.value = null;
}

// Send tradie's quote (message + price)
async function sendQuoteResponse() {
  if (!offeredPrice.value || !message.value.trim() || !selectedQuote.value) {
    alert('Please enter both price and message.');
    return;
  }

  const payload = {
    message: message.value,
    offered_price: offeredPrice.value
  };

  try {
    await bookingService.addQuoteMessage(selectedQuote.value.id, payload);

    alert('Your quote has been sent successfully!');

    // Reload list to reflect status changes
    const response = await bookingService.getQuotes();
    quotes.value = response.data;

    // Clear selection
    selectedQuote.value = null;
  } catch (err) {
    alert('Failed to send quote.');
    console.error(err);
  }
}
</script>
