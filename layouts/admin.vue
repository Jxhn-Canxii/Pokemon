<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div 
      :class="[ 
        'fixed inset-y-0 left-0 z-50 w-[300px] dark:bg-slate-900 bg-white shadow-lg transform transition-transform',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0'
      ]"
    >
      <Sidebar />
    </div>

    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Main Content Wrapper -->
    <div class="flex flex-col flex-grow w-full min-h-screen">
      <!-- Fixed Header -->
      <Header 
        @toggleSidebar="isSidebarOpen = !isSidebarOpen" 
        class="fixed top-0 left-0 right-0 w-full shadow-md z-30 lg:w-screen"
      />

      <!-- Page Content (Pushes Below Header) -->
      <main class="flex-grow justify-center py-2 pt-16 dark:bg-slate-900 bg-white">
        <slot />
      </main>

      <!-- Footer -->
      <!-- <Footer class="mt-auto" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from "@/navigations/admin/sidebar.vue"
import Header from "@/navigations/admin/header.vue"
import Footer from "@/navigations/admin/footer.vue"

const isSidebarOpen = ref(false) // Mobile Sidebar starts closed
</script>
