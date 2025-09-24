<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      
      <a href="/" class="font-bold text-2xl text-gray-800 flex items-center">
        <span class="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-md mr-2 font-mono">W</span>
        White Pages
      </a>
      
      <div v-if="auth.isLoggedIn" class="relative">
    <button @click="toggleDropdown" class="flex items-center space-x-2">
      <div class="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold uppercase">
        {{ avatarInitial }}
      </div>
      <span class="font-semibold text-gray-700">{{ displayName }}</span>
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        
        <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            <RouterLink :to="dashboardUrl" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Dashboard</RouterLink>
            <a @click.prevent="handleLogout" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
        </div>
      </div>
      <div v-else>
        <RouterLink to="/login" class="text-gray-600 font-medium hover:text-blue-600 mr-6">Login</RouterLink>
        <RouterLink to="/register" class="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700">Register</RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const auth = useAuthStore();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const userObj = computed(() => auth.getUser || {});

const displayName = computed(() => {
  const u = userObj.value || {};
  return (
    u.first_name ||
    u.firstName ||
    u.name ||
    (u.email ? u.email.split('@')[0] : '') ||
    'User'
  );
});

const avatarInitial = computed(() => displayName.value?.charAt(0)?.toUpperCase() || 'U');

const dashboardUrl = computed(() => {
  if (auth.getUser?.role === 'tradie') return '/tradie-dashboard';
  if (auth.getUser?.role === 'admin') return '/admin';
  return '/dashboard';
});

const handleLogout = () => {
  auth.logout();
  isDropdownOpen.value = false;
};
</script>
