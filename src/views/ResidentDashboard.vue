<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <TheHeader />

    <main class="container mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h2>
      <div class="flex border-b border-gray-200 mb-8">
        <RouterLink
          to="/dashboard/profile"
          class="py-3 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px"
          exact-active-class="text-blue-600 border-blue-600"
        >My Profile</RouterLink>
        <RouterLink
          to="/dashboard/quotes"
          class="py-3 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px"
          exact-active-class="text-blue-600 border-blue-600"
        >Quote Requests</RouterLink>
        <RouterLink
          to="/dashboard/jobs"
          class="py-3 px-6 text-gray-500 font-medium border-b-2 border-transparent -mb-px"
          exact-active-class="text-blue-600 border-blue-600"
        >My Jobs</RouterLink>
      </div>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import socket from '@/services/socket.service';

onMounted(() => {
  socket.connect();
});
</script>

<style>
/* Inline utility classes are used directly on links; keep style block empty or scoped minimal overrides */
</style>
