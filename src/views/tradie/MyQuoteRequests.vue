<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h3 class="text-2xl font-bold text-gray-800 mb-6">Quote Requests</h3>
    <div class="space-y-6">
      <div class="border border-blue-300 bg-blue-50 rounded-lg p-6">
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-bold text-lg">Leaky Bathroom Faucet</h4>
                <p class="text-sm text-gray-600">Requested by Sarah Johnson</p>
                <p class="text-xs text-gray-500">123 Collins Street, Richmond, VIC 3121</p>
            </div>
            <span class="bg-blue-200 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">New Request</span>
        </div>
        <p class="mt-4 text-gray-700 italic">"The faucet in the main bathroom has been dripping constantly for the last two days. Looking for a quote to get it fixed."</p>
        <div class="mt-4 flex flex-wrap gap-3">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold">Send Quote</button>
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold">Decline</button>
        </div>
      </div>
      <div class="border border-gray-200 rounded-lg p-6">
         <div class="flex justify-between items-start">
            <div>
                <h4 class="font-bold text-lg">Blocked Kitchen Drain</h4>
                <p class="text-sm text-gray-600">Requested by David C.</p>
            </div>
            <span class="bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-full text-sm">Responded</span>
        </div>
        <div class="mt-4 bg-gray-100 p-4 rounded-md">
          <p class="font-semibold text-gray-800">Your Quote: $180</p>
          <p class="text-sm text-gray-600">Waiting for resident to respond.</p>
        </div>
      </div>
    </div>
  </div>
</template>
