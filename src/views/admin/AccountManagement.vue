<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">User Accounts</h3>
    
    <div v-if="loading" class="text-center text-gray-500">Loading accounts...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-sm">USER</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">TYPE</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">STATUS</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">JOINED</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="account in accounts" :key="account.id" class="border-b">
            <td class="py-3 px-4">
                <p class="font-semibold">{{ account.first_name }} {{ account.last_name }}</p>
                <p class="text-xs text-gray-500">{{ account.email }}</p>
            </td>
            <td class="py-3 px-4"><span class="py-1 px-3 rounded-full text-xs" :class="roleClass(account.role)">{{ account.role }}</span></td>
            <td class="py-3 px-4"><span class="py-1 px-3 rounded-full text-xs" :class="statusClass(account.status)">{{ account.status }}</span></td>
            <td class="py-3 px-4">{{ formatDate(account.created_at) }}</td>
            <td class="py-3 px-4 space-x-2">
                <button @click="toggleSuspend(account)" class="text-yellow-500 font-medium">
                  {{ account.status === 'active' ? 'Suspend' : 'Activate' }}
                </button>
                <button @click="openDeleteModal(account)" class="text-red-500 font-medium">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h4 class="text-lg font-semibold mb-2">Confirm Delete</h4>
        <p class="text-sm text-gray-600 mb-4">Are you sure you want to permanently delete this account? This action cannot be undone.</p>

        <div v-if="deleteError" class="mb-3 p-2 rounded bg-red-50 text-red-700 text-sm">{{ deleteError }}</div>

        <div class="flex justify-end space-x-2">
          <button @click="closeDeleteModal" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="confirmDelete" :disabled="deleting" class="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 disabled:opacity-60">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import accountService from '@/services/account.service';

const accounts = ref([]);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const deleting = ref(false);
const deleteError = ref(null);
const toDelete = ref(null);

async function fetchAccounts() {
  try {
    const response = await accountService.getAllAccounts();
    accounts.value = response.data;
  } catch (err) {
    error.value = 'Failed to load accounts.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function toggleSuspend(account) {
  const newStatus = account.status === 'active' ? 'suspended' : 'active';
  try {
    await accountService.updateAccountStatus(account.id, newStatus);
    // Update status on UI
    account.status = newStatus; 
  } catch (err) {
    // Inline error banner instead of alert
    error.value = 'Failed to update status.';
    console.error(err);
  }
}

onMounted(fetchAccounts);

function openDeleteModal(account) {
  toDelete.value = account;
  deleteError.value = null;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  toDelete.value = null;
  deleting.value = false;
  deleteError.value = null;
}

async function confirmDelete() {
  if (!toDelete.value) return;
  deleting.value = true;
  deleteError.value = null;
  try {
    await accountService.deleteAccount(toDelete.value.id);
    // Remove from list
    accounts.value = accounts.value.filter(a => a.id !== toDelete.value.id);
    closeDeleteModal();
  } catch (err) {
    deleteError.value = err?.response?.data?.message || 'Failed to delete account.';
    console.error(err);
    deleting.value = false;
  }
}

// Helper functions for styling
const roleClass = (role) => ({
  'bg-blue-200 text-blue-800': role === 'tradie',
  'bg-green-200 text-green-800': role === 'resident',
});
const statusClass = (status) => ({
  'bg-green-200 text-green-800': status === 'active',
  'bg-yellow-200 text-yellow-800': status === 'suspended',
  'bg-gray-200 text-gray-800': status === 'pending' || status === 'inactive',
});

// Date helper DD/MM/YYYY
const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
</script>
