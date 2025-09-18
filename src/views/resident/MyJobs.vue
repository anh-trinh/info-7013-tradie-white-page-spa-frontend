<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Jobs</h3>
    <div class="space-y-6">
        <div class="border border-gray-200 rounded-lg p-6 flex justify-between items-center">
            <div>
                <p class="font-bold text-lg">Hot Water System Repair</p>
                <p class="text-sm text-gray-500">Mike's Plumbing Services - Completed on March 15, 2024</p>
                <div class="mt-4 flex gap-3">
                    <button class="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Leave Review</button>
                    <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">View Invoice</button>
                </div>
            </div>
            <span class="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">Completed</span>
        </div>
        <div class="border border-gray-200 rounded-lg p-6 flex justify-between items-center">
            <div>
                <p class="font-bold text-lg">Kitchen Tap installation</p>
                <p class="text-sm text-gray-500">Mike's Plumbing Services - Scheduled for March 25, 2024 at 10:00 AM</p>
                 <div class="mt-4 flex gap-3">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Reschedule</button>
                    <button class="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-semibold">Cancel</button>
                </div>
            </div>
            <span class="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">Scheduled</span>
        </div>
    </div>
  </div>
</template>
