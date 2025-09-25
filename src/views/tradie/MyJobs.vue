<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Work Schedule</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    
    <div v-else-if="jobs.length === 0" class="text-center text-gray-500">
      No scheduled jobs at this time.
    </div>

    <div v-else class="space-y-6">
      <div v-for="job in jobs" :key="job.id" class="border rounded-lg p-6" :class="getBorderClass(job.status)">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="font-bold text-lg">{{ job.job_description }}</p>
            <p class="text-sm text-gray-500">
              For {{ job.resident_name }}
              <span v-if="job.address"> at {{ job.address }}</span>
            </p>
          </div>
          <span class="font-semibold px-3 py-1 rounded-full text-sm" :class="statusClass(job.status)">
            {{ job.status }}
          </span>
        </div>
        
        <p v-if="job.scheduled_date" class="font-semibold text-gray-800">
          Date: {{ formatDate(job.scheduled_date) }}
        </p>
        <p v-else-if="job.started_date" class="font-semibold text-gray-800">
          Started: {{ formatDate(job.started_date) }}
        </p>
        
        <div class="mt-4 flex gap-3">
          <button v-if="job.status === 'scheduled'" @click="markInProgress(job)" class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">
            Mark as In Progress
          </button>
          <button v-if="job.status === 'in-progress'" @click="markCompleted(job)" class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">
            Mark as Completed
          </button>
          <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">
            View Details
          </button>
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
const error = ref(null);

onMounted(async () => {
  try {
    const response = await bookingService.getBookings();
    jobs.value = response.data;
  } catch (err) {
    error.value = 'Failed to load jobs.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const markInProgress = (job) => {
  // TODO: Implement mark in progress logic
  job.status = 'in-progress';
  console.log('Marking job as in progress:', job);
};

const markCompleted = (job) => {
  // TODO: Implement mark completed logic
  job.status = 'completed';
  console.log('Marking job as completed:', job);
};

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

const getBorderClass = (status) => {
  if (status === 'in-progress') return 'border-yellow-300 bg-yellow-50';
  return 'border-gray-200';
};

const statusClass = (status) => {
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800';
  if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
  if (status === 'completed') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};
</script>
