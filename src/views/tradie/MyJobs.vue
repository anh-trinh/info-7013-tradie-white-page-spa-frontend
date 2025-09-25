<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Work Schedule</h3>
    
    <div v-if="loading">Loading schedule...</div>
    <div v-else class="space-y-6">
        <div v-for="job in jobs" :key="job.id" class="border rounded-lg p-6">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-bold text-lg">{{ job.quote?.job_description || job.job_description }}</p>
                    <p class="text-sm text-gray-500">For Resident | Scheduled: {{ new Date(job.scheduled_at || job.scheduled_date).toLocaleString() }}</p>
                </div>
                <span class="font-semibold px-3 py-1 rounded-full text-sm capitalize" 
                      :class="{'bg-blue-100 text-blue-800': job.status === 'scheduled', 'bg-green-100 text-green-800': job.status === 'completed'}">
                    {{ job.status }}
                </span>
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
    const response = await bookingService.getBookings(); // Shared API
    jobs.value = response.data || [];
    loading.value = false;
});
</script>
