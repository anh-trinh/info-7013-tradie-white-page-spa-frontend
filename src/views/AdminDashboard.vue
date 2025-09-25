<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <TheHeader />
    <main class="container mx-auto p-6">
      <div class="flex items-center mb-6">
        <span class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-lg mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 16v-2m0-10v2M6 12H4m16 0h-2m-10 0h2M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>
        </span>
        <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
      </div>
      <div class="bg-white rounded-lg shadow-md">
        <div class="flex border-b border-gray-200">
          <RouterLink to="/admin/accounts" class="admin-tab">Account Management</RouterLink>
          <RouterLink to="/admin/categories" class="admin-tab">Service Categories</RouterLink>
          <RouterLink to="/admin/jobs" class="admin-tab">Job Management</RouterLink>
          <RouterLink to="/admin/reviews" class="admin-tab">Review Management</RouterLink>
        </div>
        <div class="p-6">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>
<style>
.admin-tab {
  padding: 1rem 1.5rem;
  color: #6b7280; /* text-gray-500 */
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.router-link-exact-active.admin-tab {
  color: #dc2626; /* text-red-600 */
  border-bottom-color: #dc2626;
}
</style>
