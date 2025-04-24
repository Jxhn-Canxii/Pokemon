<template>
  <div>
    <UButton icon="i-heroicons-plus" color="blue" @click="openModal()">
      Add Room
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Add Room" @close="isAddModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UForm @submit.prevent="addRoom">
          <div class="space-y-6 p-4 overflow-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <UFormGroup label="Room Name">
                <UInput
                  v-model="form.room_num"
                  placeholder="Enter Room Name"
                  :class="{ 'border-red-500': errors.room_num }"
                />
                <p v-if="errors.room_num" class="text-red-500 text-sm mt-1">
                  {{ errors.room_num[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Floor">
                <UInput
                  v-model="form.floor"
                  type="number"
                  placeholder="Floor Number"
                  :class="{ 'border-red-500': errors.floor }"
                />
                <p v-if="errors.floor" class="text-red-500 text-sm mt-1">
                  {{ errors.floor[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Room Type">
                <USelect
                  v-model="form.roomtype_id"
                  :options="roomtypes"
                  placeholder="Select Type"
                  :class="{ 'border-red-500': errors.roomtype_id }"
                >
                  <template #option="{ option }">
                    {{ option.label }}
                  </template>
                </USelect>
                <p v-if="errors.roomtype_id" class="text-red-500 text-sm mt-1">
                  {{ errors.roomtype_id[0] }}
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
            </div>

            <!-- Rates Section -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Rate</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Room Rate">
                  <UInput
                    v-model="form.room_price"
                    type="number"
                    step="0.01"
                    placeholder="Enter Room Price"
                  />
                  <p v-if="errors.room_price" class="text-red-500 text-sm mt-1">
                    {{ errors.room_price[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Balcony Rate">
                  <UInput
                    v-model="form.balcony_price"
                    type="number"
                    step="0.01"
                    placeholder="Enter Balcony Price"
                  />
                  <p v-if="errors.balcony_price" class="text-red-500 text-sm mt-1">
                    {{ errors.balcony_price[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Service Rate">
                  <UInput
                    v-model="form.service_price"
                    type="number"
                    step="0.01"
                    placeholder="Enter Service Price"
                  />
                  <p v-if="errors.service_price" class="text-red-500 text-sm mt-1">
                    {{ errors.service_price[0] }}
                  </p>
                </UFormGroup>
              </div>
            </div>

            <!-- Areas Section -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Area</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Room Area">
                  <UInput
                    v-model="form.room_area"
                    type="number"
                    step="0.01"
                    placeholder="Enter Room Area"
                  />
                  <p v-if="errors.room_area" class="text-red-500 text-sm mt-1">
                    {{ errors.room_area[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Balcony Area">
                  <UInput
                    v-model="form.balcony_area"
                    type="number"
                    step="0.01"
                    placeholder="Enter Balcony Area"
                  />
                  <p v-if="errors.balcony_area" class="text-red-500 text-sm mt-1">
                    {{ errors.balcony_area[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Service Area">
                  <UInput
                    v-model="form.service_area"
                    type="number"
                    step="0.01"
                    placeholder="Enter Service Area"
                  />
                  <p v-if="errors.service_area" class="text-red-500 text-sm mt-1">
                    {{ errors.service_area[0] }}
                  </p>
                </UFormGroup>
              </div>
            </div>

            <!-- Condo Dues Section -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Condo Dues</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UFormGroup label="Room Dues">
                  <p hidden>{{ form.room_dues = form.room_area * form.room_price }}</p>
                  <UInput
                    v-model="form.room_dues"
                    type="number"
                    class="bg-gray-200"
                    disabled
                    placeholder="Enter Room Dues"
                  />
                  <p v-if="errors.room_dues" class="text-red-500 text-sm mt-1">
                    {{ errors.room_dues[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Balcony Dues">
                  <p hidden>{{ form.balcony_dues = form.balcony_area * form.balcony_price }}</p>
                  <UInput
                    v-model="form.balcony_dues"
                    type="number"
                    class="bg-gray-200"
                    disabled
                    placeholder="Enter Balcony Dues"
                  />
                  <p v-if="errors.balcony_dues" class="text-red-500 text-sm mt-1">
                    {{ errors.balcony_dues[0] }}
                  </p>
                </UFormGroup>

                <UFormGroup label="Service Dues">
                 <p hidden>{{ form.service_dues = form.service_area * form.service_price }}</p>
                  <UInput
                    v-model="form.service_dues"
                    type="number"
                    class="bg-gray-200"
                    disabled
                    placeholder="Enter Service Dues"
                  />
                  <p v-if="errors.service_dues" class="text-red-500 text-sm mt-1">
                    {{ errors.service_dues[0] }}
                  </p>
                </UFormGroup>
              </div>
            </div>

            <!-- Total Dues (Read Only) -->
            <UFormGroup label="Total Dues">
              <UInput
                :model-value="calculateTotalDues"
                disabled
                class="bg-gray-100 text-red-500 cursor-not-allowed"
              />
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
const isAddModalOpen = ref(false);
const imageFiles = ref([]); // To store uploaded image files
const roomtypes = ref([]); // To store company data
const buildings = ref([]); // To store company data

const form = ref({
 room_num: "", 
 floor: 1, 
 building_id: "", 
 roomtype_id: "",
 room_price: 0,
 service_price: 0,
 balcony_price: 0,
 room_area: 0,
 service_area: 0,
 balcony_area: 0,
});

const errors = ref({}); // To store validation errors

const openModal = () => {
  isAddModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
  getBuildingDropdown(); // Fetch building dropdown data
  getRoomTypesDrodown(); // Fetch room types dropdown data
};

const calculateTotalDues = computed(() => {
  const roomDues = parseFloat(form.value.room_dues) || 0;
  const balconyDues = parseFloat(form.value.balcony_dues) || 0;
  const serviceDues = parseFloat(form.value.service_dues) || 0;
  return roomDues + balconyDues + serviceDues;
});
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


// Add a function to clear the form
const clearForm = () => {
  form.value = {
    room_num: "", 
    floor: 1, 
    building_id: "", 
    roomtype_id: "",
    room_price: 0,
    service_price: 0,
    balcony_price: 0,
    room_area: 0,
    service_area: 0,
    balcony_area: 0,
  };
  errors.value = {};
};

// Add Company Function
const addRoom = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value); // Use new FormData() instead of FormDx

    const response = await axios.post(
      `${VUE_APP_API_URL}rooms/add`,
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
