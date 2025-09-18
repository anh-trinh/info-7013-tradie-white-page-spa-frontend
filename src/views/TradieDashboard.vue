<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="font-bold text-xl text-gray-800">Tradie Dashboard</h1>
        <div v-if="auth.isLoggedIn">
          <span>Welcome back, {{ auth.getUser?.first_name }}!</span>
          <button @click="auth.logout" class="ml-4 font-semibold text-blue-600 hover:underline">Logout</button>
        </div>
      </div>
    </header>
    <main class="container mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">My Tradie Dashboard</h2>
      <RouterView />
    </main>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
const auth = useAuthStore();
</script>
