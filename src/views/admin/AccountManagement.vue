<template>
  <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">User Accounts</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-sm">USER</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">TYPE</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">STATUS</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">JOINED</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">ACTIONS</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr class="border-b">
            <td class="py-3 px-4">
                <p class="font-semibold">Mike Johnson</p>
                <p class="text-xs text-gray-500">mike@mikesplumbing.com.au</p>
            </td>
            <td class="py-3 px-4"><span class="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-xs">Tradie</span></td>
            <td class="py-3 px-4"><span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Active</span></td>
            <td class="py-3 px-4">Jan 15, 2024</td>
            <td class="py-3 px-4 space-x-2">
                <button class="text-blue-500 font-medium">View</button>
                <button class="text-yellow-500 font-medium">Suspend</button>
                <button class="text-red-500 font-medium">Delete</button>
            </td>
          </tr>
          <tr class="border-b">
            <td class="py-3 px-4">
                <p class="font-semibold">Sarah Johnson</p>
                <p class="text-xs text-gray-500">sarah.johnson@email.com</p>
            </td>
            <td class="py-3 px-4"><span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Resident</span></td>
            <td class="py-3 px-4"><span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Active</span></td>
            <td class="py-3 px-4">Feb 3, 2024</td>
            <td class="py-3 px-4 space-x-2">
                <button class="text-blue-500 font-medium">View</button>
                <button class="text-yellow-500 font-medium">Suspend</button>
                <button class="text-red-500 font-medium">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
