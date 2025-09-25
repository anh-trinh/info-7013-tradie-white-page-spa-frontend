<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Quote Requests</h3>

    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="quotes.length === 0" class="text-center text-gray-500">You have no active quote requests.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-1 border-r pr-8">
        <h4 class="font-semibold mb-2">Requests</h4>
        <div class="space-y-4">
          <div v-for="quote in quotes" :key="quote.id" 
               @click="selectQuote(quote)"
               class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
               :class="{'bg-blue-50 border-blue-500': selectedQuote && selectedQuote.id === quote.id}">
            <p class="font-bold">{{ quote.job_description }}</p>
            <p class="text-sm text-gray-500">Status: <span class="font-semibold capitalize">{{ quote.status }}</span></p>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <div v-if="!selectedQuote" class="text-center text-gray-500 pt-10">Select a request from the left to see details.</div>
        <div v-else>
          <h4 class="text-xl font-bold mb-4">Conversation History for "{{ selectedQuote.job_description }}"</h4>

          <div class="space-y-4 border p-4 rounded-md h-64 overflow-y-auto mb-4 bg-gray-50">
            <div v-for="message in selectedQuote.messages" :key="message.id">
              <p class="text-sm font-semibold" :class="{'text-blue-600': message.sender_account_id !== auth.getUser.id}">
                {{ message.sender_account_id === auth.getUser.id ? 'You' : 'Tradie' }} said:
              </p>
              <p class="text-gray-700">{{ message.message }}</p>
              <p v-if="message.offered_price" class="font-bold text-green-600">
                Offered Price: ${{ message.offered_price }}
              </p>
            </div>
          </div>

          <div v-if="selectedQuote.status === 'responded'">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p class="font-bold">Tradie has responded!</p>
              <p class="text-sm">You can now accept their offer or send a counter-offer.</p>
            </div>
            <div class="flex gap-4 mb-6">
              <button @click="acceptOffer" class="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600">Accept Offer</button>
            </div>
          </div>

          <form @submit.prevent="sendMessage">
            <h5 class="font-semibold mb-2">Send a message or counter-offer:</h5>
            <textarea v-model="newMessage" placeholder="Your message..." class="w-full p-2 border rounded-md" required></textarea>
            <div class="mt-2">
                <label class="block text-sm">Your new price (optional)</label>
                <input v-model.number="newPrice" type="number" step="0.01" min="0" placeholder="e.g., 120.50" class="w-full p-2 border rounded-md">
            </div>
            <div class="mt-4">
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import bookingService from '@/services/booking.service';
import { useAuthStore } from '@/stores/auth.store';

const auth = useAuthStore();
const quotes = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedQuote = ref(null);
const newMessage = ref('');
const newPrice = ref(null);

// Load list of quotes (exclude accepted and rejected)
async function fetchQuotes() {
  try {
    loading.value = true;
    const response = await bookingService.getQuotes();
    quotes.value = (response.data || []).filter((q) => q.status !== 'accepted' && q.status !== 'rejected');
  } catch {
    error.value = 'Failed to load quote requests.';
  } finally {
    loading.value = false;
  }
}
onMounted(fetchQuotes);

// Latest offer message with a price
const latestOffer = computed(() => {
  if (!selectedQuote.value?.messages) return null;
  return [...selectedQuote.value.messages].reverse().find((m) => m.offered_price);
});

async function selectQuote(quote) {
  const response = await bookingService.getQuoteById(quote.id);
  selectedQuote.value = response.data;
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedQuote.value) return;
  const payload = {
    message: newMessage.value,
    offered_price: newPrice.value || null,
  };
  await bookingService.addQuoteMessage(selectedQuote.value.id, payload);
  await selectQuote(selectedQuote.value); // refresh thread
  newMessage.value = '';
  newPrice.value = null;
}

// Accept current latest offer and create booking
async function acceptOffer() {
  if (!selectedQuote.value || !latestOffer.value) {
    alert('No offer available to accept.');
    return;
  }
  const scheduledAt = prompt(
    'Please enter the desired date and time for the job (YYYY-MM-DD HH:MM:SS):',
    new Date().toISOString().slice(0, 19).replace('T', ' ')
  );
  if (!scheduledAt) return;
  const payload = {
    quote_id: selectedQuote.value.id,
    final_price: latestOffer.value.offered_price,
    scheduled_at: scheduledAt,
  };
  try {
    await bookingService.createBooking(payload);
    alert('Offer accepted and job has been scheduled! You can view it in "My Jobs".');
    await fetchQuotes();
    selectedQuote.value = null;
  } catch (err) {
    alert('Failed to accept the offer.');
    console.error(err);
  }
}
</script>
