<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-sm">
      <h1 class="text-3xl font-semibold text-center text-emerald-900 mb-6">
        Condo Management System
      </h1>

      <!-- Display error message -->
      <div v-if="error" class="bg-red-500 text-white text-sm p-2 mb-4 rounded">
        {{ error }}
      </div>

      <form @submit.prevent="login">
        <!-- Username Field -->
        <div class="mb-4">
          <label
            for="username"
            class="block text-sm font-medium text-emerald-900 mb-2"
            >Username</label
          >
          <UInput
            v-model="form.username"
            size="md"
            placeholder="Enter your username"
            :class="{ 'border-red-500': errors.username }"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-user"
                :padded="false"
              />
            </template>
          </UInput>
          <!-- Error Message -->
          <p v-if="errors.username" class="text-red-500 text-sm mt-1">
            {{ errors.username[0] }}
          </p>
        </div>

        <!-- Password Field -->
        <div class="mb-6 relative">
          <label
            for="password"
            class="block text-sm font-medium text-emerald-900 mb-2"
            >Password</label
          >
          <UInput
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            size="md"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            placeholder="Enter your password"
            :class="{ 'border-red-500': errors.password }"
          >
            <template #trailing>
              <UButton
                color="gray"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                :padded="false"
                @click.prevent="showPassword = !showPassword"
              />
            </template>
          </UInput>
          <!-- Error Message -->
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password[0] }}
          </p>
        </div>

        <UButton
          color="yellow"
          type="submit"
          width="w-full"
          size="md"
          class="flex w-full items-center justify-center"
          variant="solid"
        >
          Login
        </UButton>
         <p v-if="errors.message" class="text-red-500 text-sm mt-1">
            {{ errors.message[0] }}
          </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios"; // Import axios for API requests
import { useAuthStore } from "@/store/auth"; // Import the auth store
import { useRouter } from "vue-router"; // Import the router for navigation
import Swal from "sweetalert2"; // Import SweetAlert2
import { FormDx, handleApiError } from "@/utility/Helper.js";
import { getPermissions, getRoles } from "@/utility/PreProcess.js";
import { VUE_APP_API_URL } from "@/utility/Global.js";

definePageMeta({
  layout: "guest",
});

const error = ref(""); // Declare error ref to store the error message
const errors = ref({}); // Reactive object to store field-specific errors
const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const showPassword = ref(false); // Boolean to toggle password visibility

// Toggle function to show/hide password
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Login function using axios for HTTP request
const login = async () => {
  // Reset errors
  errors.value = {};

  // Show the loading spinner alert using SweetAlert2
  const swalInstance = Swal.fire({
    title: "Logging in...",
    text: "Please wait while we authenticate you.",
    allowOutsideClick: false, // Prevent closing the modal by clicking outside
    didOpen: () => {
      Swal.showLoading(); // Show the loading spinner
    },
  });

  try {
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}login`, formData);
    if (response.data && response.data.token) {
      // Assuming the response contains a token and user data
      const { token, user } = response.data;

      console.log(response.data);
      // Save token and user data to store
      const authStore = useAuthStore();
      authStore.setAuthData(token, user); // Store token and set authenticated to true

      // Close the Swal loading spinner
      swalInstance.close();

      // Redirect to the homepage or another page after login
      await preProcess(token); // Call preprocessing function

      router.push("/admin/dashboard/"); // Redirect to the homepage or dashboard
    }
  } catch (error) {
    // Close the Swal loading spinner
    swalInstance.close();

    if (error.response && error.response.data && error.response.data.errors) {
      // Handle field-specific errors
      errors.value = error.response.data.errors;
    } else {
      // Handle general error
      handleApiError(error);
    }
  }
};

// Pre-process function to get permissions and roles
const preProcess = async (token) => {
  try {
    await getPermissions(token); // Get permissions
    await getRoles(token); // Get roles
  } catch (error) {
    // Handle errors in the preprocessing steps
    console.error("Error in preprocessing:", error);
    Swal.fire({
      icon: "error",
      title: "Preprocessing failed",
      text: "There was an issue fetching permissions or roles. Please try again.",
    });
  }
};

onMounted(() => {
  console.log(process.env.VITE_APP_API_URL);
});
</script>
