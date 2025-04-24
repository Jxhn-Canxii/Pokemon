<template>
  <div>
    <!-- Add Permission Button -->
    <UButton icon="i-heroicons-plus" color="blue" @click="isAddModalOpen = true">
      Add Permission
    </UButton>

    <!-- Add Permission Modal -->
    <Modalx v-model:show="isAddModalOpen" title="Add Permission" @close="isAddModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="addPermission">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Name">
              <UInput
                v-model="form.permission_name"
                placeholder="Enter Name"
                :class="{ 'border-red-500': errors.permission_name }"
              />
              <p v-if="errors.permission_name" class="text-red-500 text-sm mt-1">
                {{ errors.permission_name[0] }}
              </p>
            </UFormGroup>

            <!-- Permission Type -->
            <UFormGroup label="Type">
              <UInput
                type="text"
                v-model="form.permission_type"
                placeholder="Enter Type"
                :class="{ 'border-red-500': errors.permission_type }"
              />
              <p v-if="errors.permission_type" class="text-red-500 text-sm mt-1">
                {{ errors.permission_type[0] }}
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
import { BearToken, handleApiError, Alerto, FormDx, replaceSpaceWithUnderScore } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);

const form = ref({
  permission_name: "",
  permission_type: "",
});

const errors = ref({}); // To store validation errors

// Add Permission Function
const addPermission = async () => {
  try {
    errors.value = {}; // Reset errors
    form.value.permission_name = replaceSpaceWithUnderScore(form.value.permission_name);
    const formData = FormDx(form.value);

    const response = await axios.post(`${VUE_APP_API_URL}permissions/add`, formData, BearToken());

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
</script>
