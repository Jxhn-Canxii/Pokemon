<template>
  <div>
    <!-- Add Building Button -->
    <UButton icon="i-heroicons-plus" color="blue" @click="openModal()">
      Add Building
    </UButton>

    <!-- Add Company Modal -->
    <Modalx v-model:show="isAddModalOpen" title="Add Building" @close="isAddModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="addBuilding">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Building Name">
              <UInput
                v-model="form.building_name"
                placeholder="Enter Building Name"
                :class="{ 'border-red-500': errors.building_name }"
              />
              <p v-if="errors.building_name" class="text-red-500 text-sm mt-1">
                {{ errors.building_name[0] }}
              </p>
            </UFormGroup>
            
            <!-- Abbre -->
            <UFormGroup label="Building Abbreviation">
              <UInput
                v-model="form.building_abbre"
                placeholder="Enter Building Abbreviation"
                :class="{ 'border-red-500': errors.building_abbre }"
              />
              <p v-if="errors.building_abbre" class="text-red-500 text-sm mt-1">
                {{ errors.building_abbre[0] }}
              </p>
            </UFormGroup>
            <UFormGroup label="Company">
              <USelect
                v-model="form.our_company_id"
                :options="companies"
                :class="{ 'border-red-500': errors.our_company_id }"
              >
                <template #option="{ option }">
                  {{ option.name }}
                </template>
              </USelect>
              <p v-if="errors.our_company_id" class="text-red-500 text-sm mt-1">
                {{ errors.our_company_id[0] }}
              </p>
            </UFormGroup>
            <!-- Address -->
            <UFormGroup label="Address">
              <UTextarea
                v-model="form.address"
                placeholder="Enter Address"
                :class="{ 'border-red-500': errors.address }"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1">
                {{ errors.address[0] }}
              </p>
            </UFormGroup>

            <!-- Remarks -->
            <UFormGroup label="Contact">
              <UInput
                v-model="form.contact"
                placeholder="Enter Contact"
                :class="{ 'border-red-500': errors.contact }"
              />
              <p v-if="errors.contact" class="text-red-500 text-sm mt-1">
                {{ errors.contact[0] }}
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
const imageFiles = ref([]); // To store uploaded image files
const companies = ref([]); // To store company data

const form = ref({
 building_name: "", 
 address: "", 
 contact: "", 
 building_abbre: "", 
 our_company_id: 0,
});

const errors = ref({}); // To store validation errors

const openModal = () => {
  isAddModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
  getOurCompanyDropdown(); // Fetch company data when opening the modal
};

const getOurCompanyDropdown = async () => {
  try {
      const response = await axios.get(`${VUE_APP_API_URL}our-companies/dropdown`, BearToken());
      companies.value = response.data.ourCompanies;
  } catch (error) {
    handleApiError(error);
    
  }
};
// Handle file upload
const handleFileUpload = (event) => {

   imageFiles.value = Array.from(event.target.files);
};

// Remove file
const removeFile = (index) => {
  imageFiles.value.splice(index, 1);
};

// Add a function to clear the form
const clearForm = () => {
  form.value = {
    building_name: "", 
    address: "", 
    contact: "",  
    building_abbre: "", 
    our_company_id: 0,
  };
  imageFiles.value = [];
  errors.value = {};
};

// Add Company Function
const addBuilding = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = new FormData(); // Use new FormData() instead of FormDx

    // Append form fields
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key]);
    });

    // Append files
    imageFiles.value.forEach((file) => {
      formData.append("our_company_images[]", file);
    });

    const response = await axios.post(
      `${VUE_APP_API_URL}buildings/add`,
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
