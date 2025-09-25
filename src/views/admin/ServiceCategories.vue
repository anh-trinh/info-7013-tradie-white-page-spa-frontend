<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-2xl font-bold text-gray-800">Service Categories</h3>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">Add Category</button>
    </div>
    
    <div v-if="loading" class="text-center text-gray-500">Loading categories...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category.id" class="bg-gray-50 border p-4 rounded-lg">
        <h4 class="font-bold">{{ category.name }}</h4>
        <p class="text-sm text-gray-600">{{ category.description }}</p>
        <p class="text-xs text-gray-500 mt-2">{{ category.active_tradies_count || 0 }} active tradies</p>
        <div class="mt-4 space-x-2">
          <button class="text-blue-500 font-medium">Edit</button>
          <button class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import tradieService from '@/services/tradie.service';

const categories = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchCategories() {
  try {
    const response = await tradieService.getCategories();
    categories.value = response.data;
  } catch (err) {
    error.value = 'Failed to load service categories.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCategories);
</script>
