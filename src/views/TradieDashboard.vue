<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <TheHeader />
    <main class="container mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">My Tradie Dashboard</h2>
      <RouterView />
    </main>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
</script>
