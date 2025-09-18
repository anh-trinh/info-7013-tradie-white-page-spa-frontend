<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <header class="bg-slate-800 text-white shadow-lg">
      <div class="container mx-auto px-6 py-3 flex justify-between items-center">
        <h1 class="font-bold text-xl flex items-center">
          <span class="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-md mr-2 font-mono">A</span>
          Admin Dashboard
        </h1>
        <div v-if="auth.isLoggedIn">
          <span>Hello, {{ auth.getUser?.first_name }}!</span>
          <button @click="auth.logout" class="ml-4 font-semibold text-red-400 hover:underline">Logout</button>
        </div>
      </div>
    </header>
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
import { useAuthStore } from '@/stores/auth.store';
const auth = useAuthStore();
</script>
<style>
.admin-tab {
  @apply py-4 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px;
}
.router-link-exact-active {
  @apply text-red-600 border-red-600;
}
</style>
