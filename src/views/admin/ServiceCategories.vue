<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-2xl font-bold text-gray-800">Service Categories</h3>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">Add Category</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-50 border p-4 rounded-lg">
        <h4 class="font-bold">Plumbing</h4>
        <p class="text-sm text-gray-600">Water, drainage, and pipe services</p>
        <p class="text-xs text-gray-500 mt-2">48 active tradies</p>
        <div class="mt-4 space-x-2">
          <button class="text-blue-500 font-medium">Edit</button>
          <button class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
