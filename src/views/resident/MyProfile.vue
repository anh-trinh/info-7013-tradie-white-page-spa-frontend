<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Profile</h3>
    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 font-medium mb-2">Full Name</label>
        <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2" value="John Doe" readonly />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input type="email" class="w-full border border-gray-300 rounded-md px-4 py-2" value="john.doe@email.com" readonly />
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Phone</label>
        <input type="text" class="w-full border border-gray-300 rounded-md px-4 py-2" value="0123 456 789" readonly />
      </div>
    </div>
  </div>
</template>
