<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="font-bold text-xl text-gray-800">W Dashboard</h1>
        <div v-if="auth.isLoggedIn">
          <span>Welcome back, {{ auth.getUser?.first_name }}!</span>
          <button @click="auth.logout" class="ml-4 font-semibold text-blue-600 hover:underline">Logout</button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h2>
      <div class="flex border-b border-gray-200 mb-8">
        <RouterLink to="/dashboard/profile" class="nav-tab">My Profile</RouterLink>
        <RouterLink to="/dashboard/quotes" class="nav-tab">Quote Requests</RouterLink>
        <RouterLink to="/dashboard/jobs" class="nav-tab">My Jobs</RouterLink>
      </div>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
const auth = useAuthStore();
</script>

<style>
.nav-tab {
  @apply py-3 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px;
}
.router-link-exact-active {
  @apply text-blue-600 border-blue-600;
}
</style>
