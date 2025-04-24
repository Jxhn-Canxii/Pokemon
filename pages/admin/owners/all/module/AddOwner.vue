<template>
  <div>
    <UButton icon="i-heroicons-users" color="blue" @click="openModal()">
      Add Owner
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Add Owner" @close="isAddModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UForm @submit.prevent="addOwner">
          <div class="space-y-6 p-4 overflow-auto">
            <div class="flex justify-between gap-3">
                <div>
                  <label for="" class="font-bold">Owner Information</label>
                </div>
                <div class="flex gap-3">
                    
                </div>    
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="Full Name">
                <UInput
                  v-model="form.fullname"
                  placeholder="Enter Full Name"
                  :class="{ 'border-red-500': errors.fullname }"
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
                  :class="{ 'border-red-500': errors.email }"
                />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                  {{ errors.email[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Contact Number">
                <UInput
                  v-model="form.contact"
                  placeholder="Enter Contact Number"
                  :class="{ 'border-red-500': errors.contact }"
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
                  :class="{ 'border-red-500': errors.gender }"
                />
                <p v-if="errors.gender" class="text-red-500 text-sm mt-1">
                  {{ errors.gender[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Birth Date">
                <UInput
                  v-model="form.birth_date"
                  type="date"
                  :class="{ 'border-red-500': errors.birth_date }"
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
                  :class="{ 'border-red-500': errors.civil_status }"
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
                  :class="{ 'border-red-500': errors.nationality }"
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
                  :class="{ 'border-red-500': errors.address }"
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
                  :class="{ 'border-red-500': errors.remarks }"
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

const emits = defineEmits(["transaction_id"]);
const isAddModalOpen = ref(false);
const imageFiles = ref([]); // To store uploaded image files
const roomtypes = ref([]); // To store company data
const buildings = ref([]); // To store company data
const nationalities = ref(nationalitiesData.nationalities);

const form = ref({
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
  clearForm(); // Clear the form when opening the modal
};

// Add a function to clear the form
const clearForm = () => {
  form.value = {
    fullname: '', 
    email: '', 
    gender: '', 
    birth_date: '', 
    civil_status: '', 
    nationality: '', 
    contact: '', 
    address: '', 
    remarks: '',
  };
  errors.value = {};
};

// Add Company Function
const addOwner = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(form.value); // Use new FormData() instead of FormDx

    const response = await axios.post(
      `${VUE_APP_API_URL}owners/add`,
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
