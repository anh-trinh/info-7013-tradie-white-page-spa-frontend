<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Work Schedule</h3>
    <div v-if="loading">Loading schedule...</div>
    <div v-else>
      <div v-if="jobs.length === 0" class="text-gray-500">You have no scheduled work yet.</div>
      <div v-else class="space-y-6">
        <div v-for="job in jobs" :key="job.id" class="border rounded-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-bold text-lg">{{ job.quote.job_description }}</p>
              <p class="text-sm text-gray-500 font-semibold">For: {{ job.resident_contact ? `${job.resident_contact.first_name} ${job.resident_contact.last_name}` : 'Resident' }}</p>
            </div>
            <span class="font-semibold px-3 py-1 rounded-full text-sm capitalize" :class="statusClass(job.status)">{{ job.status }}</span>
          </div>

          <div class="mt-4 border-t pt-4">
            <p><strong>Scheduled for:</strong> {{ formatDate(job.scheduled_at) }}</p>
            <p><strong>Address:</strong> {{ job.quote.service_address }}</p>
            <p><strong>Resident's Phone:</strong> {{ job.resident_contact?.phone_number || 'N/A' }}</p>
            <p><strong>Agreed Price:</strong> {{ formatCurrency(job.final_price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bookingService from '@/services/booking.service';

const jobs = ref([]);
const loading = ref(true);

onMounted(async () => {
  const response = await bookingService.getBookings();
  jobs.value = response.data;
  loading.value = false;
});

const statusClass = (status) => ({
  'bg-blue-100 text-blue-800': status === 'scheduled',
  'bg-yellow-100 text-yellow-800': status === 'in_progress',
  'bg-green-100 text-green-800': status === 'completed',
  'bg-red-100 text-red-800': status === 'cancelled',
});

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  const n = Number(value);
  if (Number.isNaN(n)) return `$${value}`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
};
</script>
