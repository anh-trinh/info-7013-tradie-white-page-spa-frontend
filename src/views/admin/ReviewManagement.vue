<template>
    <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Review Management</h3>
    <div class="space-y-4">
      <div class="bg-gray-50 border p-4 rounded-lg">
        <p class="font-bold">Sarah J. → Mike's Plumbing</p>
        <div class="flex items-center my-1"><span class="text-yellow-500">★★★★★</span></div>
        <p class="text-gray-700 italic">"Excellent service! Mike was punctual and professional."</p>
        <div class="mt-2 space-x-2">
          <button class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
      <div class="bg-red-50 border border-red-300 p-4 rounded-lg">
        <p class="font-bold">John D. → ABC Electrical</p>
        <div class="flex items-center my-1"><span class="text-yellow-500">★☆☆☆☆</span></div>
        <p class="text-gray-700 italic">"Poor service and overcharged. Would not recommend."</p>
        <p class="text-xs text-red-600 font-semibold mt-1">▲ Flagged for review</p>
        <div class="mt-2 space-x-2">
          <button class="text-green-500 font-medium">Approve</button>
          <button class="text-red-500 font-medium">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
