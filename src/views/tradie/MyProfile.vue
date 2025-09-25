<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Professional Profile</h3>
    
    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="toast.show" class="mb-4 p-3 rounded-md text-sm"
           :class="toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ toast.message }}
      </div>
    </transition>
    
    <div v-if="loading" class="text-center text-gray-500">Loading profile...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <form v-else @submit.prevent="handleSave">
      <h4 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" id="first_name" v-model="profile.first_name" :class="{'border-red-500': errors.first_name}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <p v-if="errors.first_name" class="text-red-600 text-sm mt-1">{{ errors.first_name }}</p>
        </div>
        <div>
          <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" id="last_name" v-model="profile.last_name" :class="{'border-red-500': errors.last_name}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <p v-if="errors.last_name" class="text-red-600 text-sm mt-1">{{ errors.last_name }}</p>
        </div>
        <div>
          <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" id="phone_number" v-model="profile.phone_number" :class="{'border-red-500': errors.phone_number}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <p v-if="errors.phone_number" class="text-red-600 text-sm mt-1">{{ errors.phone_number }}</p>
        </div>
      </div>

      <h4 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Business Details</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="business_name" class="block text-sm font-medium text-gray-700">Business Name</label>
          <input type="text" id="business_name" v-model="profile.business_name" :class="{'border-red-500': errors.business_name}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <p v-if="errors.business_name" class="text-red-600 text-sm mt-1">{{ errors.business_name }}</p>
        </div>
        <div>
          <label for="postcode" class="block text-sm font-medium text-gray-700">Service Area (Postcode)</label>
          <input type="text" id="postcode" v-model="profile.postcode" :class="{'border-red-500': errors.postcode}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <p v-if="errors.postcode" class="text-red-600 text-sm mt-1">{{ errors.postcode }}</p>
        </div>
        <div>
            <label for="base_rate" class="block text-sm font-medium text-gray-700">Base Rate (e.g., $85/hour)</label>
      <input type="text" id="base_rate" v-model="profile.base_rate" :class="{'border-red-500': errors.base_rate}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
            <p v-if="errors.base_rate" class="text-red-600 text-sm mt-1">{{ errors.base_rate }}</p>
        </div>
        <div>
      <label for="primary_service" class="block text-sm font-medium text-gray-700">Primary Service</label>
    <select id="primary_service" v-model="profile.primary_service_id" :class="{'border-red-500': errors.primary_service_id}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="">Select a service...</option>
        <option v-for="service in serviceCategories" :key="service.id" :value="String(service.id)">
                    {{ service.name }}
                </option>
            </select>
            <p v-if="errors.primary_service_id" class="text-red-600 text-sm mt-1">{{ errors.primary_service_id }}</p>
        </div>
         <div class="md:col-span-2">
            <label for="about" class="block text-sm font-medium text-gray-700">About Me / My Business</label>
      <textarea id="about" v-model="profile.about" rows="4" :class="{'border-red-500': errors.about}" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
            <p v-if="errors.about" class="text-red-600 text-sm mt-1">{{ errors.about }}</p>
        </div>
      </div>
      
      <div class="mt-8 text-right">
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700" :disabled="saving">
          <span v-if="saving">Saving...</span>
          <span v-else>Save Profile</span>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import accountService from '@/services/account.service';
import tradieService from '@/services/tradie.service';

const auth = useAuthStore();
const profile = ref({});
const serviceCategories = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const hasTradieProfile = ref(true);
const toast = ref({ show: false, message: '', type: 'success' });
// Validation errors (client + server)
const errors = ref({});

// Load data on mount
onMounted(async () => {
  try {
    const accountId = auth.getUser?.id;
    if (!accountId) throw new Error('User not logged in.');

    // Fetch categories and account in parallel first
    const [categoriesRes, accountRes] = await Promise.all([
      tradieService.getCategories(),
      accountService.getProfile(),
    ]);
    serviceCategories.value = categoriesRes.data || [];

    // Try get tradie profile separately to catch 404
    let tradieData = {};
    try {
      const tradieProfileRes = await tradieService.getTradieProfile(accountId);
      tradieData = tradieProfileRes.data || {};
      hasTradieProfile.value = true;
    } catch (e) {
      if (e?.response?.status === 404) {
        hasTradieProfile.value = false; // No tradie profile yet
      } else {
        throw e;
      }
    }

    // Determine initial primary service id from various possible API shapes
    const initialPrimaryServiceId = getInitialPrimaryServiceId(tradieData);

    profile.value = {
      first_name: accountRes.data?.first_name || '',
      last_name: accountRes.data?.last_name || '',
      phone_number: accountRes.data?.phone_number || '',
      business_name: tradieData?.business_name || '',
      postcode: tradieData?.postcode || '',
      base_rate: tradieData?.base_rate || '',
      primary_service_id: initialPrimaryServiceId,
      about: tradieData?.about || tradieData?.bio || '',
    };
  } catch (err) {
    error.value = 'Failed to load profile data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function getInitialPrimaryServiceId(tradieData) {
  // Direct fields
  const direct = tradieData?.primary_service_id ?? tradieData?.service_category_id ?? tradieData?.primary_service?.id;
  if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
    return String(direct);
  }
  // Relationship: categories[0].pivot.service_category_id
  const firstCategory = tradieData?.categories?.[0];
  if (firstCategory?.pivot?.service_category_id) {
    return String(firstCategory.pivot.service_category_id);
  }
  if (firstCategory?.id) {
    return String(firstCategory.id);
  }
  return '';
}

async function handleSave() {
  saving.value = true;
  // Clear previous errors
  errors.value = {};
  try {
    const accountId = auth.getUser?.id;
    if (!accountId) throw new Error('User not logged in.');

    // Split data into account and tradie payloads
    const accountData = {
      first_name: profile.value.first_name,
      last_name: profile.value.last_name,
      phone_number: profile.value.phone_number,
    };

    const tradieData = {
      business_name: profile.value.business_name,
      postcode: profile.value.postcode,
      base_rate: profile.value.base_rate,
      primary_service_id: profile.value.primary_service_id ? Number(profile.value.primary_service_id) : null,
      about: profile.value.about,
    };

    // Required fields validation
    if (!profile.value.first_name) errors.value.first_name = 'First Name is required.';
    if (!profile.value.last_name) errors.value.last_name = 'Last Name is required.';
    if (!profile.value.phone_number) errors.value.phone_number = 'Phone is required.';
  if (!profile.value.business_name) errors.value.business_name = 'Business Name is required.';
  if (!profile.value.postcode) errors.value.postcode = 'Service Area (Postcode) is required.';
  // Newly required fields
  if (!(String(profile.value.base_rate ?? '').trim())) errors.value.base_rate = 'Base Rate is required.';
  if (!profile.value.primary_service_id) errors.value.primary_service_id = 'Primary Service is required.';
  if (!(String(profile.value.about ?? '').trim())) errors.value.about = 'About is required.';

    // Stop if any client-side errors
    if (Object.keys(errors.value).length > 0) {
      throw new Error('Validation failed');
    }

    // Always update account basic info
    await accountService.updateProfile(accountData);
    // Update auth store so header reflects new name immediately
    auth.updateUser({
      first_name: accountData.first_name,
      last_name: accountData.last_name,
      phone_number: accountData.phone_number,
    });

    // Update tradie profile using new endpoint (no accountId needed)
    await tradieService.updateTradieProfile(tradieData);

    showToast('Profile updated successfully!', 'success');
  } catch (err) {
    console.error(err);
    // Try extract validation errors from common shapes
    const fe = extractFieldErrors(err);
    if (Object.keys(fe).length) {
      errors.value = { ...errors.value, ...fe };
    }
    if (err.message !== 'Validation failed') {
      showToast('Failed to update profile.', 'error');
    }
  } finally {
    saving.value = false;
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  window.setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function extractFieldErrors(err) {
  const result = {};
  const data = err?.response?.data;
  // Laravel-style: { errors: { field: [msg] } }
  if (data?.errors && typeof data.errors === 'object') {
    for (const [key, val] of Object.entries(data.errors)) {
      if (Array.isArray(val) && val.length) result[key] = val[0];
      else if (typeof val === 'string') result[key] = val;
    }
    return result;
  }
  // Direct map: { field: 'message' }
  if (data && typeof data === 'object') {
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'string') result[key] = val;
      else if (Array.isArray(val) && val.length && typeof val[0] === 'string') result[key] = val[0];
    }
  }
  return result;
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
