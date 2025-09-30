<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg flex flex-col">
      <div class="p-6 font-bold text-xl border-b">Dashboard</div>
      <nav class="p-4 flex-1">
        <ul class="space-y-2 text-sm">
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
          <li class="px-4 py-2 rounded hover:bg-gray-50 cursor-pointer">Link</li>
        </ul>
      </nav>
      <div class="p-4 border-t text-sm">Logout</div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <header class="flex items-center justify-between bg-white shadow px-6 py-3">
        <input placeholder="Search for projects, courses, topics and more..." class="w-1/2 border rounded px-3 py-2 text-sm" />
        <div class="flex items-center space-x-4">
          <button class="p-2 rounded hover:bg-gray-100">🔔</button>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-gray-300"></div>
            <span class="text-sm">User_Name</span>
          </div>
        </div>
      </header>

      <!-- Body -->
      <main class="flex-1 p-6 flex space-x-6">
        <!-- Left column -->
        <div class="w-72 space-y-6">
          <div class="bg-white shadow p-4 rounded-lg">Profile Card</div>
          <div class="bg-white shadow p-4 rounded-lg">Your Projects</div>
        </div>

        <!-- Center column -->
        <div class="flex-1 space-y-6">
          <div class="bg-white shadow p-4 rounded-lg">Post Input Box</div>
          <div class="bg-white shadow p-4 rounded-lg h-96">Feed Post</div>
        </div>

        <!-- Right column -->
        <div class="w-80 space-y-6">
          <div class="bg-white shadow p-4 rounded-lg">Recent Approved Repositories</div>
          <div class="bg-white shadow p-4 rounded-lg h-64">Top Projects</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup></script>
<style scoped></style>
