<template>
    <div>
    <h3 class="text-2xl font-bold text-gray-800 mb-4">Job Management</h3>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-sm">JOB</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">RESIDENT</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">TRADIE</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">STATUS</th>
            <th class="text-left py-3 px-4 font-semibold text-sm">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="py-3 px-4">
              <p class="font-semibold">Kitchen Drain Repair</p>
              <p class="text-xs text-gray-500">$180 - Mar 20, 2024</p>
            </td>
            <td class="py-3 px-4">Sarah Johnson</td>
            <td class="py-3 px-4">Mike's Plumbing</td>
            <td class="py-3 px-4"><span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Completed</span></td>
            <td class="py-3 px-4 space-x-2">
              <button class="text-blue-500 font-medium">View Details</button>
              <button class="text-yellow-500 font-medium">Update Status</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
