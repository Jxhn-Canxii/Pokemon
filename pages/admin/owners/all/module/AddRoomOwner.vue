<template>
  <div>
    <UButton icon="i-heroicons-building-office" color="blue" @click="openModal()">
      Add
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Add Room Owner" @close="isAddModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UForm @submit.prevent="addOwner">
          <div class="space-y-6 p-4 overflow-auto">
            <div class="flex justify-between gap-3">
                <div>
                  <label for="" class="font-bold">Select Room <a class="text-red-500 text-sm">(Optional)</a></label>
                </div>
                <div class="flex gap-3">
                    <UButton icon="i-heroicons-arrow-path" color="gray" @click.prevent="clearRoomForm()">
                      Reset
                    </UButton>
                    <SelectRoom @result="fillRoomForm" />
                </div>    
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Room">
                <UInput
                  v-model="form.room_name"
                  placeholder="Select Room Name"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.room_name }"
                />
                <p v-if="errors.room_name" class="text-red-500 text-sm mt-1">
                  {{ errors.room_name[0] }}
                </p>
              </UFormGroup>
              <UFormGroup label="Condo Due">
                <UInput
                  v-model="form.condo_dues"
                  placeholder="Select Condo Due"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.condo_dues }"
                />
                <p v-if="errors.condo_dues" class="text-red-500 text-sm mt-1">
                  {{ errors.condo_dues[0] }}
                </p>
              </UFormGroup>
            </div>
            <div class="flex justify-between gap-3">
                <div>
                  <label for="" class="font-bold">Select Parking  <a class="text-red-500 text-sm">(Optional)</a></label>
                </div>
                <div class="flex gap-3">
                    <UButton icon="i-heroicons-arrow-path" color="gray" @click.prevent="clearParkingForm()">
                      Reset
                    </UButton>
                    <SelectParking @result="fillParkingForm" />
                </div>    
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Parking Slot">
                <UInput
                  v-model="form.parking_slot"
                  placeholder="Select Parking Slot"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.parking_slot }"
                />
                <p v-if="errors.parking_slot" class="text-red-500 text-sm mt-1">
                  {{ errors.parking_slot[0] }}
                </p>
              </UFormGroup>
              <UFormGroup label="Parking Fee">
                <UInput
                  v-model="form.parking_fee"
                  placeholder="Select Parking Fee"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.parking_fee }"
                />
                <p v-if="errors.parking_fee" class="text-red-500 text-sm mt-1">
                  {{ errors.parking_fee[0] }}
                </p>
              </UFormGroup>
            </div>
            <!-- Personal Information -->
            <div class="flex justify-between gap-3">
                <div>
                  <label for="" class="font-bold">Owner Information</label>
                </div>
                <div class="flex gap-3">
                    <UButton icon="i-heroicons-arrow-path" color="gray" @click.prevent="clearCustomerForm()">
                      Reset
                    </UButton>
                    <SelectOwner @result="fillCustomerForm" />
                </div>    
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="Full Name">
                <UInput
                  v-model="form.fullname"
                  placeholder="Enter Full Name"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.fullname, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.fullname" class="text-red-500 text-sm mt-1">
                  {{ errors.fullname[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Email">
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="Enter Email"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.email, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                  {{ errors.email[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Contact Number">
                <UInput
                  v-model="form.contact"
                  placeholder="Enter Contact Number"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.contact, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.contact" class="text-red-500 text-sm mt-1">
                  {{ errors.contact[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Gender">
                <USelect
                  v-model="form.gender"
                  :options="[
                    { value: '1', label: 'Male' },
                    { value: '2', label: 'Female' }
                  ]"
                  placeholder="Select Gender"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.gender, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.gender" class="text-red-500 text-sm mt-1">
                  {{ errors.gender[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Birth Date">
                <UInput
                  v-model="form.birth_date"
                  type="date"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.birth_date, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.birth_date" class="text-red-500 text-sm mt-1">
                  {{ errors.birth_date[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Civil Status">
                <USelect
                  v-model="form.civil_status"
                  :options="[
                    { value: '1', label: 'Single' },
                    { value: '2', label: 'Married' },
                    { value: '3', label: 'Widow' }
                  ]"
                  placeholder="Select Civil Status"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.civil_status, 'bg-gray-200' : form.guest_id > 0 }"
                />
                <p v-if="errors.civil_status" class="text-red-500 text-sm mt-1">
                  {{ errors.civil_status[0] }}
                </p>
              </UFormGroup>

              <!-- Replace the existing nationality input with this -->
              <UFormGroup label="Nationality">
                <USelect
                  v-model="form.nationality"
                  :options="nationalities"
                  placeholder="Select Nationality"
                  searchable
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.nationality, 'bg-gray-200' : form.guest_id > 0 }"
                >
                  <template #option="{ option }">
                    {{ option.label }}
                  </template>
                </USelect>
                <p v-if="errors.nationality" class="text-red-500 text-sm mt-1">
                  {{ errors.nationality[0] }}
                </p>
              </UFormGroup>
            </div>

            <!-- Address and Remarks -->
            <div class="grid grid-cols-1 gap-4">
              <UFormGroup label="Address">
                <UTextarea
                  v-model="form.address"
                  placeholder="Enter Complete Address"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.address, 'bg-gray-200' : form.guest_id > 0 }"
                  rows="3"
                />
                <p v-if="errors.address" class="text-red-500 text-sm mt-1">
                  {{ errors.address[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Remarks">
                <UTextarea
                  v-model="form.remarks"
                  placeholder="Enter Remarks (Optional)"
                  :disabled="form.guest_id > 0"
                  :class="{ 'border-red-500': errors.remarks, 'bg-gray-200' : form.guest_id > 0 }"
                  rows="3"
                />
                <p v-if="errors.remarks" class="text-red-500 text-sm mt-1">
                  {{ errors.remarks[0] }}
                </p>
              </UFormGroup>
            </div>

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
import nationalitiesData from '@/data/nationalities.json';

import SelectRoom from './SelectRoom.vue';
import SelectParking from './SelectParking.vue';
import SelectOwner from './SelectOwner.vue';

const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);
const imageFiles = ref([]); // To store uploaded image files
const roomtypes = ref([]); // To store company data
const buildings = ref([]); // To store company data
const nationalities = ref(nationalitiesData.nationalities);

const form = ref({
 room_id: 0,
 room_name: '',
 condo_dues: 0,
 parking_id: 0,
 parking_slot: 0,
 parking_fee: 0,
 guest_id: 0,
 id_number: 0,
 fullname: '', 
 email: '', 
 gender: '', 
 birth_date: '', 
 civil_status: '', 
 nationality: '', 
 contact: '', 
 address: '', 
 remarks: '',
});
// gender: 1 - male , 2 - female
// civil status  1 - single,2 - married, 3 -widow
const errors = ref({}); // To store validation errors

const openModal = () => {
  isAddModalOpen.value = true;
  clearParkingForm(); // Clear the form when opening the modal
  clearRoomForm();
  clearCustomerForm();
};

//add function to fill forms
const fillParkingForm = (data) => {
    form.value.parking_id = data.id;
    form.value.parking_slot = data.name;
    form.value.parking_fee = data.price ?? 0;
}
const fillRoomForm = (data) => {
    console.log(data);
    form.value.room_id = data.id;
    form.value.room_name = data.room_num;
    form.value.condo_dues = data.condoDues ?? 0;
}
const fillCustomerForm = (data) => {
  console.log(data);
  form.value.guest_id = data.id;
  form.value.account_num = data.account_num;
  form.value.id_number = data.id_number;
  form.value.fullname = data.fullname; 
  form.value.email = data.email; 
  form.value.gender = data.gender; 
  form.value.birth_date = data.birthdate; 
  form.value.civil_status = data.civilStatus; 
  form.value.nationality = data.nationality; 
  form.value.contact = data.contactinfo; 
  form.value.address = data.address; 
  form.value.remarks = data.remarks;
  errors.value = {};
};
// Add a function to clear the form
const clearParkingForm = () => {
    form.value.parking_id = 0;
    form.value.parking_slot = '';
    form.value.parking_fee = 0;
}
const clearRoomForm = () => {
    form.value.room_id = 0;
    form.value.room_name = 0;
    form.value.condo_dues = 0;
}
const clearCustomerForm = () => {
  form.value.guest_id = 0;
  form.value.account_num = '';
  form.value.id_number = '';
  form.value.fullname = ''; 
  form.value.email = ''; 
  form.value.gender = 0; 
  form.value.birth_date = ''; 
  form.value.civil_status = 0; 
  form.value.nationality = ''; 
  form.value.contact = ''; 
  form.value.address = ''; 
  form.value.remarks = '';
  errors.value = {};
};

// Add Company Function
const addOwner = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value); // Use new FormData() instead of FormDx

    const response = await axios.post(
      `${VUE_APP_API_URL}owners/assign-to-room-and-parking`,
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
