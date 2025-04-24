<template>
  <div>
    <UForm @submit.prevent="addUtilityCharges">
      <div class="space-y-4 p-4">
        <!-- Form Content Group -->
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <UFormGroup class="mb-0">
              <USelect
                v-model="form.utility_charge_id"
                :options="utilities"
                placeholder="Select Utility Charges"
                :class="{ 'border-red-500': errors.utility_charge_id }"
              >
                <template #option="{ option }">
                  {{ option.label }}
                </template>
              </USelect>
              <p v-if="errors.utility_charge_id" class="text-red-500 text-sm mt-1">
                {{ errors.utility_charge_id[0] }}
              </p>
            </UFormGroup>
          </div>
          
          <div class="flex-none">
            <UButton 
              type="submit" 
              color="blue"
              icon="i-heroicons-plus-circle"
              :disabled="!form.utility_charge_id"
            >
              Add Charge
            </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    default: false,
  }
});

// Fix the form initialization
const form = ref({
  room_id: 0,
  utility_charge_id: null
});

const errors = ref({}); // To store validation errors

const utilities = [
  { value: 1, label: 'Electric(VECO)'},
  { value: 2, label: 'Water(MCWD)'},
];

onMounted(() => {
  loadData();
})

const loadData = () => {
  clearForm(); // Clear the form when opening the modal
  fillForm();
};

// Fix the fillForm function
const fillForm = () => {
  const data = props.data;
  form.value.room_id = data.room_id || data.id || 0;
  console.log('Updated form:', form.value); // Debug log
};

// Fix the clearForm function
const clearForm = () => {
  form.value = {
    room_id: 0,
    utility_charge_id: null
  };
};

// Add Company Function
const addUtilityCharges = async () => {
  const prompt = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, add it!",
  });

  if (prompt.isConfirmed) {
    try {
      errors.value = {}; // Reset errors
      const formData = FormDx(form.value); // Use new FormData() instead of FormDx

      const response = await axios.post(
        `${VUE_APP_API_URL}rooms/manual-create-reading`,
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
  }
};
</script>
