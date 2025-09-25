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
            <td class="py-3 px-4">{{ new Date(account.created_at).toLocaleDateString() }}</td>
            <td class="py-3 px-4 space-x-2">
                <button @click="toggleSuspend(account)" class="text-yellow-500 font-medium">
                  {{ account.status === 'active' ? 'Suspend' : 'Activate' }}
                </button>
                <button class="text-red-500 font-medium">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import accountService from '@/services/account.service';

const accounts = ref([]);
const loading = ref(true);
const error = ref(null);

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
    alert('Failed to update status.');
    console.error(err);
  }
}

onMounted(fetchAccounts);

// Helper functions for styling
const roleClass = (role) => ({
  'bg-blue-200 text-blue-800': role === 'tradie',
  'bg-green-200 text-green-800': role === 'resident',
});
const statusClass = (status) => ({
  'bg-green-200 text-green-800': status === 'active',
  'bg-yellow-200 text-yellow-800': status === 'suspended',
});
</script>
