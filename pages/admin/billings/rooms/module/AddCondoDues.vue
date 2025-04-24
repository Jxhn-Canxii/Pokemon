<template>
  <div>
    <UButton icon="i-heroicons-plus" color="blue" @click="openModal()">
      Add Condo Dues
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Add Condo Dues" @close="isAddModalOpen = false" :maxWidth="'lg'">
      <UCard>
        <UForm @submit.prevent="addCondoDues">
          <div class="space-y-4 p-4 overflow-auto">
            <!-- Coverage Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="From">
                <UInput
                  v-model="form.coverage_from"
                  type="date"
                  :class="{ 'border-red-500': errors.coverage_from }"
                />
                <p v-if="errors.coverage_from" class="text-red-500 text-sm mt-1">
                  {{ errors.coverage_from[0] }}
                </p>
              </UFormGroup>
            
              <UFormGroup label="To">
                <UInput
                  v-model="form.coverage_to"
                  type="date"
                  :class="{ 'border-red-500': errors.coverage_to }"
                />
                <p v-if="errors.coverage_to" class="text-red-500 text-sm mt-1">
                  {{ errors.coverage_to[0] }}
                </p>
              </UFormGroup>
            </div>

            <!-- Usage and Amount -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Usage">
                <UInput
                  v-model="form.usage"
                  type="number"
                  step="0.01"
                  placeholder="Enter usage in square meters"
                  :class="{ 'border-red-500': errors.usage }"
                />
                <p v-if="errors.usage" class="text-red-500 text-sm mt-1">
                  {{ errors.usage[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Amount">
                <UInput
                  v-model="form.amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  :class="{ 'border-red-500': errors.amount }"
                />
                <p v-if="errors.amount" class="text-red-500 text-sm mt-1">
                  {{ errors.amount[0] }}
                </p>
              </UFormGroup>
            </div>

            <!-- Charge Type -->
            <UFormGroup label="Condo Due Type">
              <USelect
                v-model="form.charge_id"
                :options="props.condoDuesDropdown"
                placeholder="Select Charge type"
                :class="{ 'border-red-500': errors.charge_id}"
              >
                <template #option="{ option }">
                  {{ option.label }}
                </template>
              </USelect>
              <p v-if="errors.charge_id" class="text-red-500 text-sm mt-1">
                {{ errors.charge_id[0] }}
              </p>
            </UFormGroup>
        
            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
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
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    default: false,
  },
  condoDuesDropdown: {
    type: Object,
    default: false,
  }
});
const isAddModalOpen = ref(false);
const errors = ref({});

// Form initialization
const form = ref({
  billing_id: 0,
  room_id: null,
  charge_id: null,
  coverage_from: "",
  coverage_to: "",
  usage: "",
  amount: "",
});

// Charge types
const charges = ref(props.condoDuesDropdown);

// Modal and form handling
const openModal = () => {
  isAddModalOpen.value = true;
  clearForm();
  fillForm();
};
const fillForm = () => {
  const data = props.data;

  form.value.billing_id = data.billingId ?? 0;
  form.value.room_id = data.room_id ?? 0;
}
const clearForm = () => {
  form.value = {
    billing_id: 0,
    room_id: null,
    coverage_from: "",
    coverage_to: "",
    usage: "",
    amount: ""
  };
  errors.value = {};
};

// Submit handler
const addCondoDues = async () => {
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
      errors.value = {};
      const formData = FormDx(form.value); // Use new FormData() instead of FormDx
      const response = await axios.post(
        `${VUE_APP_API_URL}billings/create-condo-dues-charge-bill`,
        formData,
        BearToken()
      );

      await Alerto("success", "Success", response.data.message);
      clearForm();
      isAddModalOpen.value = false;
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

//condoDuesDropdown


</script>
