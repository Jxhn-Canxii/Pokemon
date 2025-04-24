<template>
  <div>
    <UButton icon="i-heroicons-plus" color="blue" @click="openModal()">
      Add Miscellaneous Dues
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Add Miscellaneous Dues" @close="isAddModalOpen = false" :maxWidth="'xl'">
      <UCard>
        <UForm @submit.prevent="addMiscDues">
          <div class="space-y-4 p-4 overflow-auto">
        
            <!-- Charge Type -->
            <UFormGroup label="Charges">
              <SearchDropdown
                apiEndpoint="charges/search"
                :searchModel="search"
                placeholder="Search Charge"
                itemLabel="name"
                itemId="id"
                :key="form.room_id"
                inputId="chargeName"
                :defaultValue="form.charge_name"
                @item-selected="(data) => fillCharges(data)"
                dataKey="charges"
                returnName="['name']"
                class="flex-1"
              />
              <p v-if="errors.charge_id" class="text-red-500 text-sm mt-1">
                {{ errors.charge_id[0] }}
              </p>
            </UFormGroup>
            
              <!-- Usage and Amount -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="Usage">
                <UInput
                  v-model="form.usage"
                  type="number"
                  step="0.01"
                  placeholder="Enter charge usage"
                  :class="{ 'border-red-500': errors.usage }"
                />
                <p v-if="errors.usage" class="text-red-500 text-sm mt-1">
                  {{ errors.usage[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Rate">
                <UInput
                  v-model="form.rate"
                  type="number"
                  step="0.01"
                  disabled
                  placeholder="Enter rate"
                  :class="{ 'border-red-500': errors.rate }"
                />
                <p v-if="errors.rate" class="text-red-500 text-sm mt-1">
                  {{ errors.rate[0] }}
                </p>
              </UFormGroup>
              <UFormGroup label="Total">
                <small hidden>{{ form.total = (form.usage ?? 0) * (form.rate ?? 0)  }}</small>
                <UInput
                  v-model="form.total"
                  type="number"
                  step="0.01"
                  disabled
                  placeholder="Enter rate"
                  :class="{ 'border-red-500': errors.total }"
                />
                <p v-if="errors.total" class="text-red-500 text-sm mt-1">
                  {{ errors.total[0] }}
                </p>
              </UFormGroup>
            </div>

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
import SearchDropdown from "@/components/SearchDropdown.vue";

const emits = defineEmits(["transaction_id"]);
const props = defineProps({
  data: {
    type: Object,
    default: false,
  },
});
const isAddModalOpen = ref(false);
const errors = ref({});

const search = ref({
  search: "",
  page_num: 1,
  itemsperpage: 10,
});

// Form initialization
const form = ref({
  billing_id: 0,
  room_id: null,
  charge_id: null,
  remarks: "",
  usage: 1,
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

  search.value.search = "";
}

const fillCharges = (data) => {
  console.log(data);
  form.value.charge_id = data.id;
  form.value.charge_name = data.chargeName;
  form.value.rate = data.rate;
} 
const clearForm = () => {
  form.value = {
    billing_id: 0,
    room_id: null,
    remarks: "",
    usage: 1,
    amount: ""
  };
  errors.value = {};
};

// Submit handler
const addMiscDues = async () => {
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
        `${VUE_APP_API_URL}billings/create-misc-charge-bill`,
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
