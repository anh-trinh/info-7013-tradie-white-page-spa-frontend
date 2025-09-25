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
                ${{ booking.quote_amount }} - {{ formatDate(booking.created_at) }}
              </p>
            </td>
            <td class="py-3 px-4">{{ booking.resident_name || 'N/A' }}</td>
            <td class="py-3 px-4">{{ booking.tradie_name || 'N/A' }}</td>
            <td class="py-3 px-4">
              <span class="py-1 px-3 rounded-full text-xs" :class="statusClass(booking.status)">
                {{ booking.status }}
              </span>
            </td>
            <td class="py-3 px-4 space-x-2">
              <button class="text-blue-500 font-medium">View Details</button>
              <button class="text-yellow-500 font-medium">Update Status</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';

const bookings = ref([]);
const loading = ref(true);
const error = ref(null);

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

const statusClass = (status) => {
  if (status === 'completed') return 'bg-green-200 text-green-800';
  if (status === 'in-progress') return 'bg-blue-200 text-blue-800';
  if (status === 'scheduled') return 'bg-yellow-200 text-yellow-800';
  if (status === 'cancelled') return 'bg-red-200 text-red-800';
  return 'bg-gray-200 text-gray-800';
};
</script>
