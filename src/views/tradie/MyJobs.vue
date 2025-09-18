<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Work Schedule</h3>
    <div class="space-y-6">
        <div class="border border-gray-200 rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <p class="font-bold text-lg">Kitchen Tap installation</p>
                    <p class="text-sm text-gray-500">For Lisa M. at 456 Swanston St, Carlton</p>
                </div>
                <span class="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">Scheduled</span>
            </div>
            <p class="font-semibold text-gray-800">Date: March 25, 2024 - 10:00 AM</p>
            <div class="mt-4 flex gap-3">
                <button class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Mark as In Progress</button>
                <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">View Details</button>
            </div>
        </div>
        <div class="border border-yellow-300 bg-yellow-50 rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <p class="font-bold text-lg">Bathroom Renovation - Stage 1</p>
                    <p class="text-sm text-gray-500">For John D.</p>
                </div>
                <span class="bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full text-sm">In Progress</span>
            </div>
            <p class="font-semibold text-gray-800">Started: March 22, 2024</p>
            <div class="mt-4 flex gap-3">
                <button class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Mark as Completed</button>
            </div>
        </div>
    </div>
  </div>
</template>
