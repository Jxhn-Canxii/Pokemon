<template>
  <div>
    <UButton icon="i-heroicons-pencil" color="yellow" @click="openModal()">
      Edit
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Edit Parking" @close="isAddModalOpen = false" :maxWidth="'xl'">
      <UCard>
        <UForm @submit.prevent="addParking">
          <div class="space-y-6 p-4 overflow-auto">
              <UFormGroup label="Parking Name">
                <UInput
                  v-model="form.parking_name"
                  placeholder="Enter Parking Name"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.parking_name }"
                />
                <p v-if="errors.parking_name" class="text-red-500 text-sm mt-1">
                  {{ errors.parking_name[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Building">
                <USelect
                  v-model="form.building_id"
                  :options="buildings"
                  placeholder="Select Building"
                  :class="{ 'border-red-500': errors.building_id }"
                >
                  <template #option="{ option }">
                    {{ option.label }}
                  </template>
                </USelect>
                <p v-if="errors.building_id" class="text-red-500 text-sm mt-1">
                  {{ errors.building_id[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Area">
                <UInput
                  v-model="form.area"
                  type="number"
                  placeholder="Enter Area"
                  :class="{ 'border-red-500': errors.area }"
                />
                <p v-if="errors.area" class="text-red-500 text-sm mt-1">
                  {{ errors.area[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Price">
                <UInput
                  v-model="form.price"
                  type="number"
                  placeholder="Enter Price"
                  :class="{ 'border-red-500': errors.price }"
                />
                <p v-if="errors.price" class="text-red-500 text-sm mt-1">
                  {{ errors.price[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Remarks">
                <UTextarea
                  v-model="form.remarks"
                  placeholder="Enter Remarks"
                  :class="{ 'border-red-500': errors.remarks }"
                />
                <p v-if="errors.remarks" class="text-red-500 text-sm mt-1">
                  {{ errors.remarks[0] }}
                </p>
              </UFormGroup>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <UButton type="submit" color="blue">
                Save
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
const props = defineProps({
  data: Object,
});
const isAddModalOpen = ref(false);
const buildings = ref([]); // To store company data

const form = ref({
  parking_name: '', 
  price: 0, 
  area: 0, 
  remarks: '', 
  building_id: 0
});

const errors = ref({}); // To store validation errors

const openModal = () => {
  isAddModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
  fillForm();
  getBuildingDropdown(); // Fetch building dropdown data
};

const getBuildingDropdown = async () => {
  try {
      const response = await axios.get(`${VUE_APP_API_URL}buildings/dropdown`, BearToken());
      buildings.value = response.data.buildings;
  } catch (error) {
    handleApiError(error);
    
  }
};

const getRoomTypesDrodown = async () => {
  try {
      const response = await axios.get(`${VUE_APP_API_URL}roomtypes/dropdown`, BearToken());
      roomtypes.value = response.data.roomtypes;
  } catch (error) {
    handleApiError(error);
    
  }
};

const fillForm = () => {
  const data = props.data;

  form.value = {
    parking_id: data.id,
    parking_name: data.name, 
    price: data.price, 
    area: data.area, 
    remarks: data.remarks, 
    building_id: data.buildingId,
  };
};

// Add a function to clear the form
const clearForm = () => {
  form.value = {
    parking_name: '', 
    price: 0, 
    area: 0, 
    remarks: '', 
    building_id: ''
  };
  errors.value = {};
};

// Add Company Function
const addParking = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value); // Use new FormData() instead of FormDx

    const response = await axios.post(
      `${VUE_APP_API_URL}parkings/edit`,
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
