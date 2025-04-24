<template>
  <div>
    <UForm @submit.prevent="addParkingCharges">
      <div class="space-y-4 p-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <UFormGroup class="mb-0">
              <USelect
                v-model="form.parking_id"
                :options="parkings"
                placeholder="Select Parking Slot"
                :class="{ 'border-red-500': errors.parking_id }"
                :disabled="!parkings.length"
              >
                <template #option="{ option }">
                  {{ option.label }}
                </template>
                <template #empty>
                  No parking slots available
                </template>
              </USelect>
              <p v-if="errors.parking_id" class="text-red-500 text-sm mt-1">
                {{ errors.parking_id[0] }}
              </p>
            </UFormGroup>
          </div>
          
          <div class="flex-none">
            <UButton 
              type="submit" 
              color="blue"
              icon="i-heroicons-plus-circle"
              :disabled="!form.parking_id"
            >
              Add Parking
            </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  parkingsDropdown: {
    type: Array,
    default: () => [],
  }
});

const parkings = computed(() => {
  return props.parkingsDropdown;
});

const form = ref({
  room_id: 0,
  parking_id: null
});

const errors = ref({}); // To store validation errors

onMounted(() => {
  loadData();
})

const loadData = () => {
  clearForm(); // Clear the form when opening the modal
  fillForm();
};

const fillForm = () => {
  const data = props.data;
  form.value.room_id = data.room_id || data.id || 0;
  console.log('Form updated:', form.value);
  console.log('Available parkings:', parkings.value);
};

const clearForm = () => {
  form.value = {
    room_id: 0,
    parking_id: null
  };
};

const addParkingCharges = async () => {
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
        `${VUE_APP_API_URL}billings/create-parking-charge-bill`,
        formData,
        BearToken()
      );

      await Alerto("success", "Success", response.data.message);
      clearForm(); // Clear the form

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

watch(() => props.parkingsDropdown, (newVal) => {
  console.log('Parkings dropdown updated:', newVal);
}, { immediate: true });
</script>
