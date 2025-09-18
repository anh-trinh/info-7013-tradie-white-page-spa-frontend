<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">My Quote Requests</h3>
    <div class="space-y-6">
      <div class="border border-gray-200 rounded-lg p-6">
        <h4 class="font-bold text-lg">Blocked Kitchen Drain</h4>
        <p class="text-sm text-gray-500 mb-4">Requested from Mike's Plumbing Services</p>
        <div class="bg-gray-100 p-4 rounded-md">
          <p class="font-semibold text-gray-800">Quote: $180</p>
          <p class="text-sm text-gray-600">Includes callout fee and 2 hours work</p>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
            <button class="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Accept</button>
            <button class="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Counter Offer</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold">Reject</button>
        </div>
      </div>
      <div class="border border-gray-200 rounded-lg p-6">
        <h4 class="font-bold text-lg">Electrical Safety Check</h4>
        <p class="text-sm text-gray-500 mb-4">Requested from 3 electricians</p>
        <div class="mt-4">
            <p class="text-gray-600 font-medium bg-blue-100 text-blue-800 inline-block px-3 py-1 rounded-full">Awaiting Quotes</p>
        </div>
      </div>
    </div>
  </div>
</template>
