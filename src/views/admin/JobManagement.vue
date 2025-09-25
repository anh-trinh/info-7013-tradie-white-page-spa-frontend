<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Job Management</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading jobs...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-sm">JOB</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">RESIDENT</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">TRADIE</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">STATUS</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id" class="border-b">
            <td class="py-3 px-4">
              <p class="font-semibold">{{ booking.job_description }}</p>
              <p class="text-xs text-gray-500">
                {{ formatCurrency(booking.final_price ?? booking.quote_amount) }} • {{ formatDate(booking.created_at) }}
              </p>
            </td>
            <td class="py-3 px-4">
              <div class="font-medium">
                {{ booking.resident_contact ? `${booking.resident_contact.first_name} ${booking.resident_contact.last_name}` : 'N/A' }}
              </div>
              <div v-if="booking.resident_contact?.phone_number" class="text-xs text-gray-500">
                {{ booking.resident_contact.phone_number }}
              </div>
              <div v-else-if="booking.resident_contact?.email" class="text-xs text-gray-500">
                {{ booking.resident_contact.email }}
              </div>
            </td>
            <td class="py-3 px-4">
              <div class="font-medium">
                {{ booking.tradie_contact ? `${booking.tradie_contact.first_name} ${booking.tradie_contact.last_name}` : 'N/A' }}
              </div>
              <div v-if="booking.tradie_contact?.phone_number" class="text-xs text-gray-500">
                {{ booking.tradie_contact.phone_number }}
              </div>
              <div v-else-if="booking.tradie_contact?.email" class="text-xs text-gray-500">
                {{ booking.tradie_contact.email }}
              </div>
            </td>
            <td class="py-3 px-4">
              <span class="py-1 px-3 rounded-full text-xs" :class="statusClass(booking.status)">
                {{ booking.status }}
              </span>
            </td>
            <td class="py-3 px-4 space-x-2">
              <button @click="openDetails(booking)" class="text-blue-500 font-medium">View Details</button>
              <button @click="openStatusModal(booking)" class="text-yellow-500 font-medium">Update Status</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetails" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h4 class="text-lg font-semibold mb-3">Job Details</h4>
        <div v-if="detailsLoading" class="text-gray-500">Loading...</div>
        <div v-else-if="detailsError" class="text-red-600">{{ detailsError }}</div>
        <div v-else-if="selected" class="space-y-3 text-sm">
          <div><span class="font-semibold">Final Price:</span> {{ formatCurrency(selected.final_price) }}</div>
          <div><span class="font-semibold">Status:</span> {{ selected.status || 'N/A' }}</div>
          <div><span class="font-semibold">Scheduled At:</span> {{ formatDate(selected.scheduled_at) || 'N/A' }}</div>
          <div><span class="font-semibold">Updated:</span> {{ formatDate(selected.updated_at) || 'N/A' }}</div>
          <div><span class="font-semibold">Created:</span> {{ formatDate(selected.created_at) || 'N/A' }}</div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="closeDetails" class="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h4 class="text-lg font-semibold mb-3">Update Job Status</h4>
        <div v-if="statusError" class="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">{{ statusError }}</div>
        <label class="block text-sm font-medium mb-1" for="status">Status</label>
        <select id="status" v-model="newStatus" class="w-full border rounded px-3 py-2">
          <option value="scheduled">scheduled</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <div class="mt-4 flex justify-end space-x-2">
          <button @click="closeStatusModal" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="confirmStatusUpdate" :disabled="statusSubmitting" class="px-4 py-2 rounded text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60">
            {{ statusSubmitting ? 'Updating...' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);
const showDetails = ref(false);
const detailsLoading = ref(false);
const detailsError = ref(null);
const selected = ref(null);

const showStatusModal = ref(false);
const statusError = ref(null);
const statusSubmitting = ref(false);
const newStatus = ref('scheduled');

async function fetchBookings() {
  try {
    const response = await bookingService.getAllBookings();
    bookings.value = response.data;
  } catch (err) {
    error.value = 'Failed to load jobs.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchBookings);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') return 'N/A';
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(num);
};

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-200 text-green-800';
  if (status === 'in-progress') return 'bg-blue-200 text-blue-800';
  if (status === 'scheduled') return 'bg-yellow-200 text-yellow-800';
  if (status === 'cancelled') return 'bg-red-200 text-red-800';
  return 'bg-gray-200 text-gray-800';
};

function openDetails(booking) {
  showDetails.value = true;
  detailsLoading.value = true;
  detailsError.value = null;
  selected.value = null;
  bookingService
    .getAdminBookingById(booking.id)
    .then((res) => {
      selected.value = res.data;
    })
    .catch((err) => {
      console.error(err);
      detailsError.value = 'Failed to load booking details.';
    })
    .finally(() => {
      detailsLoading.value = false;
    });
}

function closeDetails() {
  showDetails.value = false;
  selected.value = null;
}

function openStatusModal(booking) {
  showStatusModal.value = true;
  statusError.value = null;
  statusSubmitting.value = false;
  selected.value = booking;
  const allowed = ['scheduled', 'completed', 'cancelled'];
  newStatus.value = allowed.includes(booking.status) ? booking.status : 'scheduled';
}

function closeStatusModal() {
  showStatusModal.value = false;
  selected.value = null;
}

async function confirmStatusUpdate() {
  if (!selected.value) return;
  statusSubmitting.value = true;
  statusError.value = null;
  try {
    await bookingService.updateBookingStatus(selected.value.id, newStatus.value);
    // update in list
    const idx = bookings.value.findIndex(b => b.id === selected.value.id);
    if (idx !== -1) bookings.value[idx].status = newStatus.value;
    closeStatusModal();
  } catch (err) {
    console.error(err);
    statusError.value = err?.response?.data?.message || 'Failed to update status.';
    statusSubmitting.value = false;
  }
}
</script>
