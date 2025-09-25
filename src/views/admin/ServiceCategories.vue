<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-gray-800">Service Categories</h3>
      <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">Add Category</button>
    </div>
    
    <div v-if="loading" class="text-center text-gray-500">Loading categories...</div>
  <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category.id" class="bg-gray-50 border p-4 rounded-lg">
        <h4 class="font-bold">{{ category.name }}</h4>
        <p class="text-sm text-gray-600">{{ category.description }}</p>
        <p class="text-xs text-gray-500 mt-2">{{ category.active_tradies_count || 0 }} active tradies</p>
        <div class="mt-4 space-x-4 text-sm">
          <button @click="openEditModal(category)" class="text-blue-500 font-medium hover:underline">Edit</button>
          <button @click="openDeleteModal(category)" class="text-red-500 font-medium hover:underline">Delete</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="closeFormModal"></div>
    <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6">
      <h3 class="text-xl font-bold mb-4">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full border rounded-md p-2" placeholder="e.g., Plumbing" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea v-model="form.description" class="w-full border rounded-md p-2" placeholder="Short description"></textarea>
        </div>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="closeFormModal" class="px-4 py-2 rounded-md border">Cancel</button>
        <button @click="submitForm" :disabled="submitting" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          <span v-if="submitting">Saving...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirm Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="closeDeleteModal"></div>
    <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6">
      <h3 class="text-xl font-bold mb-2">Delete Category</h3>
      <p>Are you sure you want to delete "<strong>{{ deletingCategory?.name }}</strong>"?</p>
      <p class="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="closeDeleteModal" class="px-4 py-2 rounded-md border">Cancel</button>
        <button @click="confirmDelete" :disabled="submitting" class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
          <span v-if="submitting">Deleting...</span>
          <span v-else>Delete</span>
        </button>
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

// Modal/Form state
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const formError = ref('');
const editingCategory = ref(null);
const deletingCategory = ref(null);
const form = ref({ name: '', description: '' });

async function fetchCategories() {
  try {
    loading.value = true;
    error.value = null;
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

function openCreateModal() {
  editingCategory.value = null;
  form.value = { name: '', description: '' };
  formError.value = '';
  showFormModal.value = true;
}

function openEditModal(category) {
  editingCategory.value = category;
  form.value = { name: category.name || '', description: category.description || '' };
  formError.value = '';
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
}

async function submitForm() {
  if (!form.value.name?.trim()) {
    formError.value = 'Name is required.';
    return;
  }
  try {
    submitting.value = true;
    if (editingCategory.value) {
      await tradieService.updateCategory(editingCategory.value.id, form.value);
    } else {
      await tradieService.createCategory(form.value);
    }
    closeFormModal();
    await fetchCategories();
  } catch (err) {
    console.error(err);
    formError.value = 'Failed to save category. Please try again.';
  } finally {
    submitting.value = false;
  }
}

function openDeleteModal(category) {
  deletingCategory.value = category;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

async function confirmDelete() {
  if (!deletingCategory.value) return;
  try {
    submitting.value = true;
    await tradieService.deleteCategory(deletingCategory.value.id);
    closeDeleteModal();
    await fetchCategories();
  } catch (err) {
    console.error(err);
    // Optionally surface inline error under modal header
  } finally {
    submitting.value = false;
  }
}
</script>
