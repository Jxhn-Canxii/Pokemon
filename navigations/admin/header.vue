<template>
  <header class="bg-white shadow-md px-4 py-3 flex items-center justify-between lg:px-6 p-2">
    <!-- Mobile Sidebar Toggle Button (Hamburger Menu) -->
    <div class="flex justify-start items-center gap-1">
      <button @click="$emit('toggleSidebar')" class="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200">
        <UIcon name="i-heroicons-bars-3" class="text-2xl" />
      </button>

      <h1 class="text-lg font-semibold text-gray-800">Admin Panel</h1>
    </div>
    <!-- User Dropdown (Right Side) -->
    <div class="flex justify-end items-center gap-2 px-2">
      <UButton color="purple" title="Reload Permissions" size="lg" @click.prevent="reloadDefault()" icon="i-heroicons-arrow-path"></UButton>
      <UButton color="primary" size="lg" :label="user.fullName" icon="i-heroicons-user"></UButton>
      <UButton color="red" size="lg" title="Logout" icon="i-heroicons-power" @click.prevent="logout()"></UButton>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from "vue";
import Swal from "sweetalert2";
import { getPermissions, getRoles } from "@/utility/PreProcess.js";
import { useAuthStore } from "@/store/auth";

defineEmits(["toggleSidebar"]);
const authStore = useAuthStore();
const user = ref(JSON.parse(localStorage.getItem("user")));
// Load token on component mount
onMounted(() => {
  // console.log(authStore.token);
});

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

const reloadDefault = async () => {
  Swal.fire({
    title: "Processing...",
    text: "Please wait while the data is being reloaded.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await getPermissions(authStore.token);
    await getRoles(authStore.token);

    Swal.close();
    Swal.fire("Success!", "Default data reloaded successfully.", "success");

    window.location.reload();
  } catch (error) {
    Swal.close();
    Swal.fire("Error", "An error occurred while reloading data. Please try again.", "error");
  }
};
</script>
