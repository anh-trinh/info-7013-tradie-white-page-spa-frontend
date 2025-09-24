<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <TheHeader />
    <main class="container mx-auto p-6">
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
  @apply py-4 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px;
}
.router-link-exact-active {
  @apply text-red-600 border-red-600;
}
</style>
