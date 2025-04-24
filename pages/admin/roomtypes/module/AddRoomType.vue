<template>
  <div>
    <!-- Add Room Type Button -->
    <UButton icon="i-heroicons-plus" color="blue" @click="openModal()">
      Add Room Type
    </UButton>

    <!-- Add Company Modal -->
    <Modalx v-model:show="isAddModalOpen" title="Add Room Type" @close="isAddModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="addRoomType">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Name">
              <UInput
                v-model="form.name"
                placeholder="Enter Name"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">
                {{ errors.name[0] }}
              </p>
            </UFormGroup>
            
            <!-- Abbre -->
            <UFormGroup label="Abbreviation">
              <UInput
                v-model="form.abbre"
                placeholder="Enter Abbreviation"
                :class="{ 'border-red-500': errors.abbre }"
              />
              <p v-if="errors.abbre" class="text-red-500 text-sm mt-1">
                {{ errors.abbre[0] }}
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
import { ref, computed } from "vue";
import axios from "axios";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);
const form = ref({
 name: "", 
 abbre: "", 
});

const errors = ref({}); // To store validation errors

const openModal = () => {
  isAddModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
};


// Add a function to clear the form
const clearForm = () => {
  form.value = {
    name: "", 
    abbre: "", 
  };
  errors.value = {};
};

// Add Company Function
const addRoomType = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value); // Use new FormData() instead of FormDx
    const response = await axios.post(
      `${VUE_APP_API_URL}roomtypes/add`,
      formData,
      BearToken()
    );

    await Alerto("success", "Success", response.data.message);
    clearForm(); // Clear the form
    isAddModalOpen.value = false; // Close modal
    emits("transaction_id", Math.random());
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      handleApiError(error);
    }
  }
};
</script>
