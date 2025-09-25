<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Scheduled Jobs</h3>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="jobs.length === 0" class="text-gray-500">You have no jobs scheduled yet.</div>
      <div v-else class="space-y-6">
          <div v-for="job in jobs" :key="job.id" class="border rounded-lg p-6">
              <div class="flex justify-between items-start">
                  <div>
                      <p class="font-bold text-lg">{{ job.quote.job_description }}</p>
                      <p class="text-sm text-gray-500 font-semibold">With: {{ job.tradie_contact?.business_name || `${job.tradie_contact?.first_name} ${job.tradie_contact?.last_name}` }}</p>
                  </div>
                  <span class="font-semibold px-3 py-1 rounded-full text-sm capitalize" :class="statusClass(job.status)">{{ job.status }}</span>
              </div>
        <div class="mt-4 border-t pt-4">
          <p><strong>Scheduled for:</strong> {{ formatDate(job.scheduled_at) }}</p>
                  <p><strong>Address:</strong> {{ job.quote.service_address }}</p>
          <p><strong>Final Price:</strong> {{ formatCurrency(job.final_price) }}</p>
                  <p><strong>Tradie's Phone:</strong> {{ job.tradie_contact?.phone_number || 'N/A' }}</p>
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  v-if="job.status === 'scheduled'"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold"
                  @click="openStatusModal(job, 'completed')"
                >
                  Mark as Completed
                </button>
                <button
                  v-if="job.status === 'scheduled'"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold"
                  @click="openStatusModal(job, 'cancelled')"
                >
                  Cancel Job
                </button>
                <div v-if="job.status === 'completed'" class="flex gap-3 items-center">
                  <span v-if="job.has_review" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    You have reviewed this job
                  </span>
                  <button
                    v-else
                    class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold"
                    @click="openReviewModal(job)"
                  >
                    Leave Review
                  </button>
                  
                </div>
              </div>
          </div>
      </div>
    </div>
  </div>

  <!-- Update Status Modal -->
  <div v-if="showStatusModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold">Confirm Status Update</h3>
      </div>
      <div class="px-6 py-4 space-y-3">
        <p>
          Are you sure you want to set this job to
          <span class="font-semibold">{{ pendingStatus }}</span>?
        </p>
        <div class="text-sm text-gray-600">
          <p v-if="pendingStatus === 'completed'">This indicates the work has been successfully completed.</p>
          <p v-else-if="pendingStatus === 'cancelled'">This will cancel the job and notify the tradie.</p>
        </div>
        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>
      <div class="px-6 py-4 border-t flex justify-end gap-3">
        <button class="px-4 py-2 rounded border" @click="closeStatusModal" :disabled="saving">Close</button>
        <button class="px-4 py-2 rounded text-white" :class="pendingStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'" @click="confirmUpdateStatus" :disabled="saving">
          <span v-if="saving">Saving...</span>
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Review Modal -->
  <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-semibold">Leave a Review</h3>
      </div>
      <div class="px-6 py-4 space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Rating</label>
          <select v-model.number="reviewRating" class="border rounded w-full p-2">
            <option disabled value="">Select rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n > 1 ? 's' : '' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Comment</label>
          <textarea v-model="reviewComment" rows="4" class="border rounded w-full p-2" placeholder="Share your experience..."></textarea>
        </div>
        <p v-if="reviewError" class="text-sm text-red-600">{{ reviewError }}</p>
        <p v-if="reviewSuccess" class="text-sm text-green-700">{{ reviewSuccess }}</p>
      </div>
      <div class="px-6 py-4 border-t flex justify-end gap-3">
        <button class="px-4 py-2 rounded border" @click="closeReviewModal" :disabled="reviewSubmitting">Close</button>
        <button class="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700" @click="submitReview" :disabled="reviewSubmitting">
          <span v-if="reviewSubmitting">Submitting...</span>
          <span v-else>Submit Review</span>
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import bookingService from '@/services/booking.service';
  import reviewService from '@/services/review.service';
  
  const jobs = ref([]);
  const loading = ref(true);
  const showStatusModal = ref(false);
  const selectedJob = ref(null);
  const pendingStatus = ref('scheduled');
  const saving = ref(false);
  const errorMessage = ref('');
  // Review modal state
  const showReviewModal = ref(false);
  const reviewJob = ref(null);
  const reviewRating = ref('');
  const reviewComment = ref('');
  const reviewSubmitting = ref(false);
  const reviewError = ref('');
  const reviewSuccess = ref('');
  
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

  const openStatusModal = (job, status) => {
    selectedJob.value = job;
    pendingStatus.value = status;
    errorMessage.value = '';
    showStatusModal.value = true;
  };

  const closeStatusModal = () => {
    showStatusModal.value = false;
    selectedJob.value = null;
    pendingStatus.value = 'scheduled';
    saving.value = false;
    errorMessage.value = '';
  };

  const confirmUpdateStatus = async () => {
    if (!selectedJob.value) return;
    try {
      saving.value = true;
      await bookingService.updateMyBookingStatus(selectedJob.value.id, pendingStatus.value);
      // update local list
      const idx = jobs.value.findIndex(j => j.id === selectedJob.value.id);
      if (idx !== -1) jobs.value[idx] = { ...jobs.value[idx], status: pendingStatus.value };
      closeStatusModal();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update status';
      errorMessage.value = msg;
      saving.value = false;
    }
  };

  const extractTradieId = (job) => job?.tradie_id || job?.tradie_contact?.account_id || job?.tradie_contact?.id || job?.tradieContactId;

  const openReviewModal = (job) => {
    reviewJob.value = job;
    reviewRating.value = '';
    reviewComment.value = '';
    reviewError.value = '';
    reviewSuccess.value = '';
    showReviewModal.value = true;
  };

  const closeReviewModal = () => {
    showReviewModal.value = false;
    reviewJob.value = null;
    reviewSubmitting.value = false;
    reviewError.value = '';
    reviewSuccess.value = '';
  };

  const submitReview = async () => {
    if (!reviewJob.value) return;
    reviewError.value = '';
    reviewSuccess.value = '';
    if (!reviewRating.value) {
      reviewError.value = 'Please select a rating.';
      return;
    }
    try {
      reviewSubmitting.value = true;
      const tradieId = extractTradieId(reviewJob.value);
      if (!tradieId) throw new Error('Unable to find tradie to review.');
      const payload = {
        tradie_id: Number(tradieId),
        booking_id: Number(reviewJob.value.id),
        rating: Number(reviewRating.value),
        comment: reviewComment.value?.trim() || '',
      };
  await reviewService.createReview(payload);
  // Update local job to reflect reviewed state
  const idx = jobs.value.findIndex(j => j.id === reviewJob.value.id);
  if (idx !== -1) jobs.value[idx] = { ...jobs.value[idx], has_review: true };
  closeReviewModal();
    } catch (err) {
      reviewError.value = err?.response?.data?.message || err?.message || 'Failed to submit review.';
      reviewSubmitting.value = false;
    }
  };
  </script>
