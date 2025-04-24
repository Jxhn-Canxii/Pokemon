<template>
  <div>
    <!-- Add User Button -->
    <UButton icon="i-heroicons-plus" color="blue" @click="isAddModalOpen = true">
      Add User
    </UButton>

    <!-- Add User Modal -->
    <Modalx v-model:show="isAddModalOpen" title="Add User" @close="isAddModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="AddUser">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Username">
              <UInput
                v-model="form.username"
                placeholder="Enter User Name"
                :class="{ 'border-red-500': errors.username }"
              />
              <p v-if="errors.username" class="text-red-500 text-sm mt-1">
                {{ errors.username[0] }}
              </p>
            </UFormGroup>

            <!-- Name -->
            <UFormGroup label="Name">
              <UInput
                v-model="form.full_name"
                placeholder="Enter Full Name"
                :class="{ 'border-red-500': errors.full_name }"
              />
              <p v-if="errors.full_name" class="text-red-500 text-sm mt-1">
                {{ errors.full_name[0] }}
              </p>
            </UFormGroup>

            <!-- Email -->
            <UFormGroup label="Email">
              <UInput
                type="email"
                v-model="form.email"
                placeholder="Enter Email"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email[0] }}
              </p>
            </UFormGroup>

            <!-- Password -->
            <UFormGroup label="Password">
              <UInput
                type="password"
                v-model="form.password"
                placeholder="Enter Password"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                {{ errors.password[0] }}
              </p>
            </UFormGroup>

            <!-- Role -->
            <UFormGroup label="Role">
              <USelect
                v-model="form.role_id"
                :options="roles"
                placeholder="Select Role"
                :class="{ 'border-red-500': errors.role_id }"
              />
              <p v-if="errors.role_id" class="text-red-500 text-sm mt-1">
                {{ errors.role_id[0] }}
              </p>
            </UFormGroup>

            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
              <UButton type="submit" color="blue">
                Submit
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>
    </Modalx>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);

const form = ref({
  username: "",
  full_name: "",
  email: "",
  password: "",
  role_id: null,
});

const errors = ref({}); // To store validation errors
const roles = ref([]); // To store roles fetched from the backend

// Fetch Roles
const fetchRoles = async () => {
  try {
    const response = await axios.get(`${VUE_APP_API_URL}roles/list`, BearToken());
    roles.value = response.data.roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  } catch (error) {
    handleApiError(error);
  }
};

// Add User Function
const AddUser = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}users/add`, formData, BearToken());

    Alerto("success", "Success", response.data.message);
    isAddModalOpen.value = false;
    emits("transaction_id", Math.random());
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      // Handle Laravel validation errors
      errors.value = error.response.data.errors;
    } else {
      handleApiError(error);
    }
  }
};

// Fetch roles on component mount
onMounted(fetchRoles);
</script>
