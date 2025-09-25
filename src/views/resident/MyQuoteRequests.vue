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
          <!-- Inline success/error banners -->
          <div v-if="successMessage" class="mb-4 p-3 rounded border border-green-300 bg-green-50 text-green-800">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-800">
            {{ errorMessage }}
          </div>

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
              <p class="font-bold">Tradie has responded with an offer!</p>
              <p v-if="latestOffer" class="font-bold text-green-600 text-2xl my-2">${{ latestOffer.offered_price }}</p>
              <p class="text-sm">You can now accept this offer to schedule the job, or send a counter-offer.</p>
            </div>
            <div class="flex gap-4 mb-6">
              <button @click="acceptOffer" :disabled="!latestOffer" class="bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700">
                Accept & Schedule Job
              </button>
            </div>
          </div>

          <form v-if="hasTradieResponse && selectedQuote.status !== 'accepted'" @submit.prevent="sendMessage">
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

  <!-- Schedule Modal -->
  <div v-if="showScheduleModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="closeScheduleModal"></div>
    <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6">
      <h3 class="text-xl font-bold mb-4">Select date & time</h3>
      <p class="text-sm text-gray-600 mb-4">Choose when you want the tradie to come. You can adjust later if needed.</p>

      <label class="block text-sm font-medium mb-1">Scheduled at</label>
      <input
        v-model="scheduleAt"
        type="datetime-local"
        class="w-full border rounded-md p-2"
        :min="minDateTime"
      />
      <p v-if="scheduleError" class="text-sm text-red-600 mt-1">{{ scheduleError }}</p>

      <div class="mt-6 flex justify-end gap-3">
        <button @click="closeScheduleModal" class="px-4 py-2 rounded-md border">Cancel</button>
        <button @click="confirmSchedule" :disabled="scheduling" class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
          <span v-if="scheduling">Scheduling...</span>
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import bookingService from '@/services/booking.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuoteStore } from '@/stores/quote.store';

const auth = useAuthStore();
const quoteStore = useQuoteStore();

// Wiring component state to store
const quotes = computed(() => quoteStore.quotes.filter((q) => q.status !== 'accepted' && q.status !== 'rejected'));
const selectedQuote = computed(() => quoteStore.selectedQuote);
const loading = computed(() => quoteStore.loading);
const error = computed(() => quoteStore.error);

onMounted(() => {
  quoteStore.fetchQuotes();
});

// Local form state
const newMessage = ref('');
const newPrice = ref(null);

// Latest offer message with a price
const latestOffer = computed(() => {
  if (!selectedQuote.value?.messages) return null;
  return [...selectedQuote.value.messages].reverse().find((m) => m.offered_price);
});

// Whether tradie has replied in the thread
const hasTradieResponse = computed(() => {
  const msgs = selectedQuote.value?.messages || [];
  return msgs.some((m) => m.sender_account_id !== auth.getUser.id);
});

function selectQuote(quote) {
  quoteStore.selectQuote(quote);
}

async function sendMessage() {
  if (!newMessage.value.trim() || !selectedQuote.value) return;
  const payload = {
    message: newMessage.value,
    offered_price: newPrice.value || null,
  };
  await bookingService.addQuoteMessage(selectedQuote.value.id, payload);
  // refresh thread via store
  await quoteStore.selectQuote(selectedQuote.value);
  newMessage.value = '';
  newPrice.value = null;
}

// UI state for scheduling modal and notifications
const showScheduleModal = ref(false);
const scheduleAt = ref(getDefaultDateTimeLocal());
const scheduling = ref(false);
const scheduleError = ref('');
const successMessage = ref('');
const errorMessage = ref('');

function getDefaultDateTimeLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const minDateTime = computed(() => {
  // Prevent selecting past times
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
});

function acceptOffer() {
  if (!selectedQuote.value || !latestOffer.value) {
    errorMessage.value = 'No offer available to accept.';
    setTimeout(() => (errorMessage.value = ''), 3000);
    return;
  }
  scheduleAt.value = getDefaultDateTimeLocal();
  scheduleError.value = '';
  showScheduleModal.value = true;
}

function closeScheduleModal() {
  showScheduleModal.value = false;
}

function toBackendDateTime(datetimeLocal) {
  // Convert from 'YYYY-MM-DDTHH:MM' to 'YYYY-MM-DD HH:MM:SS'
  const d = new Date(datetimeLocal);
  if (isNaN(d)) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = '00';
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

async function confirmSchedule() {
  scheduleError.value = '';
  if (!scheduleAt.value) {
    scheduleError.value = 'Please select a date and time.';
    return;
  }
  const scheduled_at = toBackendDateTime(scheduleAt.value);
  if (!scheduled_at) {
    scheduleError.value = 'Invalid date/time format.';
    return;
  }
  if (!selectedQuote.value || !latestOffer.value) {
    scheduleError.value = 'No offer available to accept.';
    return;
  }
  const payload = {
    quote_id: selectedQuote.value.id,
    final_price: latestOffer.value.offered_price,
    scheduled_at,
  };
  try {
    scheduling.value = true;
    await bookingService.createBooking(payload);
    showScheduleModal.value = false;
    successMessage.value = 'Offer accepted and job has been scheduled! You can view it in "My Jobs".';
    setTimeout(() => (successMessage.value = ''), 4000);
    await quoteStore.fetchQuotes();
    quoteStore.selectedQuote = null;
  } catch (err) {
    console.error(err);
    scheduleError.value = 'Failed to accept the offer. Please try again.';
  } finally {
    scheduling.value = false;
  }
}
</script>
