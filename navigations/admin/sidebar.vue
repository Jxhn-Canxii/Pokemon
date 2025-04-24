<template>
  <USidebar v-model="isSidebarOpen" class="w-64 shadow-xl text-white">
    <!-- Logo Section -->
    <div class="flex items-center justify-start space-x-2 p-4 border-b">
      <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-lime-500" />
      <span class="text-2xl font-bold text-black">Admin Panel</span>
    </div>

    <!-- Profile Section -->
    <div class="px-4 py-4 border-b border-gray-200">
      <div class="flex items-center space-x-3 bg-lime-100 p-2 rounded">
        <div class="relative">
          <!-- Profile Photo -->
          <img
            src="/images/default/profile.png"
            alt="Profile"
            class="w-12 h-12 rounded-full object-cover bg-white border-2 border-lime-500"
          />
          <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        <div class="flex-1 min-w-0">
          <!-- User Name -->
          <h2 class="text-sm font-semibold text-gray-900 truncate">
            {{ user.fullName }}
          </h2>
          <!-- Role Name -->
          <p class="text-xs text-gray-500 truncate">
            {{ user.roleName }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Items -->
    <div v-for="(group, index) in sidebarGroups" :key="group.label" class="mb-4">
      <!-- Single Link -->
      <div v-if="!group.label">
        <UVerticalNavigation :links="group.links" />
      </div>
      
      <!-- Dropdown Group -->
      <div v-else>
        <!-- Group Header -->
        <div 
          @click="toggleGroup(index)"
          class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
        >
          <span class="text-sm font-semibold text-gray-700 uppercase">
            {{ group.label }}
          </span>
          <UIcon 
            :name="openGroup === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-500"
          />
        </div>
        
        <!-- Group Links -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-1 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-1 opacity-0"
        >
          <div v-show="openGroup === index">
            <UVerticalNavigation :links="group.links" />
          </div>
        </Transition>
      </div>
    </div>
  </USidebar>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { VUE_APP_API_URL } from "@/utility/Global.js";
import { JSONParser } from "@/utility/Helper.js";

const user = ref(JSONParser(localStorage.getItem('user')));
const isSidebarOpen = ref(true);
const openGroup = ref(0); // Track which group is open

// Initialize user details from localStorage
onMounted(() => {

});

// Toggle group visibility
const toggleGroup = (index) => {
  openGroup.value = openGroup.value === index ? null : index;
};

const logout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of the system.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire("Logged Out", "You have been successfully logged out", "success");
      window.location.href = '/'; // Redirect to login page (adjust path as needed)
    }
  });
};

// Sidebar Groups with Links
const sidebarGroups = [
  {
    // Single links without label (no dropdown)
    links: [
      { label: "Dashboard", to: "/admin/dashboard/", icon: "i-heroicons-chart-pie", badge: "4" },
    ],
  },
  {
    // Dropdown group with label
    label: "Billing",
    links: [
      { label: "Billings", to: "/admin/billings/?tab=0", icon: "i-heroicons-document" },
      { label: "Owners", to: "/admin/owners/?tab=0", icon: "i-heroicons-users" }, //cause default is tab owners ok!
      { label: "Charges", to: "/admin/charges/", icon: "i-heroicons-banknotes" },
    ],
  },
  {
    label: "Collections",
    links: [
      { label: "Collections", to: "/admin/dashboard/", icon: "i-heroicons-banknotes", badge: "4" },
      { label: "Penalties", to: "/admin/dashboard/", icon: "i-heroicons-banknotes", badge: "4" },
      { label: "Miscelleneous", to: "/admin/dashboard/", icon: "i-heroicons-banknotes", badge: "4" },
    ],
  },
  {
    label: "Room Management",
    links: [
      { label: "Rooms", to: "/admin/rooms/", icon: "i-heroicons-home-modern" },
      { label: "Parkings", to: "/admin/parkings/", icon: "i-heroicons-truck" },
      { label: "Room Types", to: "/admin/roomtypes/", icon: "i-heroicons-inbox-stack" },
      { label: "Buildings", to: "/admin/buildings/", icon: "i-heroicons-building-office" },
    ],
  },
  {
    label: "System Management",
    links: [
      { label: "Our Company", to: "/admin/ourcompany/", icon: "i-heroicons-rectangle-group" },
      { label: "Users", to: "/admin/users/", icon: "i-heroicons-user-group" },
      { label: "Roles", to: "/admin/roles/", icon: "i-heroicons-identification" },
      { label: "Permissions", to: "/admin/permissions/", icon: "i-heroicons-key" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "System Logs", icon: "i-heroicons-list-bullet", to: "/admin/logs/", },
      { label: "Logout", icon: "i-heroicons-arrow-left-on-rectangle", click: logout },
    ],
  },
];
</script>

<style scoped>
.transition {
  transition-property: all;
}

/* Add these new styles */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
