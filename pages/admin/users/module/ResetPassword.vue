<template>
  <div>
    <!-- Reset Password Button -->
    <UButton icon="i-heroicons-lock-closed" color="gray" @click="resetBehavior()">
      Reset
    </UButton>

    <!-- Reset Password Modal -->
    <Modalx v-model:show="isEditModalOpen" title="Change Password" @close="isEditModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="ChangePassword">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Name">
              <UInput
                v-model="form.full_name"
                disabled
                placeholder="Enter Full Name"
                class="bg-gray-200"
              />
            </UFormGroup>

            <!-- New Password -->
            <UFormGroup label="New Password">
              <UInput
                type="password"
                v-model="form.new_password"
                placeholder="Enter New Password"
                :class="{ 'border-red-500': errors.new_password }"
              />
              <p v-if="errors.new_password" class="text-red-500 text-sm mt-1">
                {{ errors.new_password[0] }}
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
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: { type: Object, required: true },
});

const isEditModalOpen = ref(false);
const errors = ref({}); // To store validation errors

const form = ref({
  user_id: 0,
  full_name: "",
  new_password: "",
});

// Open Reset Password Modal and Load Data
const resetBehavior = () => {
  fillForm();
  isEditModalOpen.value = true;
};

// Fill Form with User Data
const fillForm = () => {
  const data = props.data;

  form.value.user_id = data.id;
  form.value.full_name = data.fullName;
};

// Change Password Function
const ChangePassword = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value);
    const response = await axios.post(`${VUE_APP_API_URL}users/change-password`, formData, BearToken());

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
