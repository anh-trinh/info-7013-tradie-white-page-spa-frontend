<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Profile</h3>

    <transition name="fade">
      <div v-if="toast.show" class="mb-4 p-3 rounded-md text-sm" :class="toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ toast.message }}
      </div>
    </transition>
    
    <div v-if="loading" class="text-center text-gray-500">Loading profile...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    
    <form v-else @submit.prevent="handleSave" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="first_name" class="block text-gray-700 font-medium mb-2">First Name</label>
          <input id="first_name" type="text" v-model="form.first_name" :class="{'border-red-500': errors.first_name}" class="w-full border border-gray-300 rounded-md px-4 py-2" />
          <p v-if="errors.first_name" class="text-red-600 text-sm mt-1">{{ errors.first_name }}</p>
        </div>
        <div>
          <label for="last_name" class="block text-gray-700 font-medium mb-2">Last Name</label>
          <input id="last_name" type="text" v-model="form.last_name" :class="{'border-red-500': errors.last_name}" class="w-full border border-gray-300 rounded-md px-4 py-2" />
          <p v-if="errors.last_name" class="text-red-600 text-sm mt-1">{{ errors.last_name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" class="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-50" :value="form.email" readonly />
        </div>
        <div>
          <label for="phone_number" class="block text-gray-700 font-medium mb-2">Phone</label>
          <input id="phone_number" type="tel" v-model="form.phone_number" :class="{'border-red-500': errors.phone_number}" class="w-full border border-gray-300 rounded-md px-4 py-2" />
          <p v-if="errors.phone_number" class="text-red-600 text-sm mt-1">{{ errors.phone_number }}</p>
        </div>
      </div>

      <div v-if="form.address">
        <label class="block text-gray-700 font-medium mb-2">Address</label>
        <textarea class="w-full border border-gray-300 rounded-md px-4 py-2" :value="form.address" rows="3" readonly></textarea>
      </div>

      <div class="text-right">
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

const auth = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });
const errors = ref({});

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  address: '',
});

onMounted(async () => {
  try {
    const response = await accountService.getProfile();
    const data = response.data || {};
    form.value = {
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      phone_number: data.phone_number || data.phone || '',
      address: data.address || '',
    };
  } catch (err) {
    error.value = 'Failed to load profile.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function handleSave() {
  saving.value = true;
  errors.value = {};
  try {
    // Client-side required checks
    if (!form.value.first_name) errors.value.first_name = 'First Name is required.';
    if (!form.value.last_name) errors.value.last_name = 'Last Name is required.';
    if (!form.value.phone_number) errors.value.phone_number = 'Phone is required.';
    if (Object.keys(errors.value).length > 0) {
      throw new Error('Validation failed');
    }

    const payload = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      phone_number: form.value.phone_number,
    };
    await accountService.updateProfile(payload);
    // Update auth store so header reflects new name immediately
    auth.updateUser({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      phone_number: form.value.phone_number,
    });
    showToast('Profile updated successfully!', 'success');
  } catch (err) {
    console.error(err);
    if (err.message !== 'Validation failed') showToast('Failed to update profile.', 'error');
  } finally {
    saving.value = false;
  }
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type };
  window.setTimeout(() => (toast.value.show = false), 3000);
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
