<template>
  <div>
    <!-- Edit User Button -->
    <UButton icon="i-heroicons-pencil-square" color="yellow" @click="editBehavior()">
      Edit
    </UButton>

    <!-- Edit User Modal -->
    <Modalx v-model:show="isEditModalOpen" title="Edit User" @close="isEditModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="EditUser">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Username">
              <UInput
                v-model="form.username"
                disabled
                placeholder="User Name"
                class="bg-gray-200"
              />
            </UFormGroup>

             <!-- Full Name -->
            <UFormGroup label="Full Name">
              <UInput
                v-model="form.full_name"
                placeholder="Enter Full Name"
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
import { ref } from "vue";
import axios from "axios";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL, ROLE } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: { type: Object, required: true },
});

const isEditModalOpen = ref(false);
const roles = ref([]);
const errors = ref({}); // To store validation errors

const form = ref({
  user_id: 0,
  full_name: "",
  username: "",
  email: "",
  role_id: 0,
  password: "",
});

// Open Edit Modal and Load Data
const editBehavior = () => {
  fillForm();
  roleDropdown();
  isEditModalOpen.value = true;
};

// Fill Form with User Data
const fillForm = () => {
  const data = props.data;

  form.value.user_id = data.id;
  form.value.username = data.username;
  form.value.full_name = data.fullName;
  form.value.email = data.email;
  form.value.role_id = data.roleId;
};

// Fetch Roles for Dropdown
const roleDropdown = async () => {
  roles.value = await ROLE();
};

// Edit User Function
const EditUser = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}users/edit`, formData, BearToken());

    Alerto("success", "Success", response.data.message);
    isEditModalOpen.value = false;
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
</script>
