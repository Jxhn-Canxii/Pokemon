<template>
  <div>
    <!-- Add Company Button -->
    <UButton icon="i-heroicons-plus" color="blue" @click="isAddModalOpen = true">
      Add Our Company
    </UButton>

    <!-- Add Company Modal -->
    <Modalx v-model:show="isAddModalOpen" title="Add Our Company" @close="isAddModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="addCompany">
          <div class="space-y-4 p-4 overflow-auto">
            <UFormGroup label="Company Name">
              <UInput
                v-model="form.our_company_name"
                placeholder="Enter Company Name"
                :class="{ 'border-red-500': errors.our_company_name }"
              />
              <p v-if="errors.our_company_name" class="text-red-500 text-sm mt-1">
                {{ errors.our_company_name[0] }}
              </p>
            </UFormGroup>

            <!-- Contact Info -->
            <UFormGroup label="Contact Info">
              <UInput
                v-model="form.contact_info"
                placeholder="Enter Contact Info"
                :class="{ 'border-red-500': errors.contact_info }"
              />
              <p v-if="errors.contact_info" class="text-red-500 text-sm mt-1">
                {{ errors.contact_info[0] }}
              </p>
            </UFormGroup>

            <!-- Address -->
            <UFormGroup label="Address">
              <UInput
                v-model="form.address"
                placeholder="Enter Address"
                :class="{ 'border-red-500': errors.address }"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1">
                {{ errors.address[0] }}
              </p>
            </UFormGroup>

            <!-- TIN -->
            <UFormGroup label="TIN">
              <UInput
                v-model="form.tin"
                placeholder="Enter TIN"
                :class="{ 'border-red-500': errors.tin }"
              />
              <p v-if="errors.tin" class="text-red-500 text-sm mt-1">
                {{ errors.tin[0] }}
              </p>
            </UFormGroup>

            <!-- Remarks -->
            <UFormGroup label="Remarks">
              <UInput
                v-model="form.remarks"
                placeholder="Enter Remarks"
                :class="{ 'border-red-500': errors.remarks }"
              />
              <p v-if="errors.remarks" class="text-red-500 text-sm mt-1">
                {{ errors.remarks[0] }}
              </p>
            </UFormGroup>

            <!-- Abbreviation -->
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

            <!-- Email -->
            <UFormGroup label="Email">
              <UInput
                v-model="form.email"
                placeholder="Enter Email"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email[0] }}
              </p>
            </UFormGroup>

            <!-- Company Images -->
            <UFormGroup label="Company Images">
              <div class="space-y-4">
                <!-- Custom File Input -->
                <div class="flex items-center justify-center w-full">
                  <label class="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 text-gray-500"/>
                      <p class="mb-2 text-sm text-gray-500">
                        <span class="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p class="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5 Files)</p>
                    </div>
                    <input 
                      type="file" 
                      class="hidden" 
                      multiple 
                      accept="image/*"
                      @change="handleFileUpload" 
                    />
                  </label>
                </div>

                <!-- Error Message -->
                <p v-if="errors.our_company_images" class="text-red-500 text-sm mt-1">
                  {{ errors.our_company_images[0] }}
                </p>

                <!-- Preview Images -->
                <div v-if="imageFiles.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div v-for="(file, index) in imageFiles" :key="index" class="relative group">
                    <img 
                      :src="URL.createObjectURL(file)" 
                      class="h-24 w-full object-cover rounded-lg"
                      alt="Preview"
                    />
                    <button 
                      @click.prevent="removeFile(index)" 
                      class="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <UIcon name="i-heroicons-x-mark" class="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
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
const isAddModalOpen = ref(false);
const imageFiles = ref([]); // To store uploaded image files
const form = ref({
  our_company_name: "",
  contact_info: "",
  address: "",
  tin: "",
  remarks: "",
  abbre: "",
  email: "",
});

const errors = ref({}); // To store validation errors

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
    our_company_name: "",
    contact_info: "",
    address: "",
    tin: "",
    remarks: "",
    abbre: "",
    email: "",
  };
  imageFiles.value = [];
  errors.value = {};
};

// Add Company Function
const addCompany = async () => {
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
      `${VUE_APP_API_URL}our-companies/add`,
      formData,
      {
        ...BearToken(),
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
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
