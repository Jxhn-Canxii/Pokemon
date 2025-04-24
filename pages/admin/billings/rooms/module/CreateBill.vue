<template>
  <div>
    <UButton icon="i-heroicons-clipboard-document" color="green" @click="openModal()">
      Create
    </UButton>

    <Modalx v-model:show="isEditModalOpen" title="Create Billing" @close="isEditModalOpen = false" maxWidth="fullscreen">
      <UCard>
        <UForm>
          <div class="space-y-6 p-4 overflow-auto">
           <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-3 space-y-3">
                  <UCard>
                      <h3 class="text-lg font-semibold mb-4">Unit Information</h3>
                      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <UFormGroup label="Owner">
                        <UInput
                            v-model="form.owner_name"
                            placeholder="Enter Owner Name"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.owner_name }"
                          />
                        </UFormGroup>
                        <UFormGroup label="Room">
                          <UInput
                            v-model="form.room_num"
                            placeholder="Enter Room Name"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.room_num }"
                          />
                        </UFormGroup>
                        <UFormGroup label="Room Type">
                          <USelect
                            v-model="form.roomtype_id"
                            :options="roomtypes"
                            placeholder="Select Type"
                            disabled
                            class="bg-gray-200"
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
                            disabled
                            class="bg-gray-200"
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
                  </UCard>
                   <UCard>
                      <h3 class="text-lg font-semibold mb-4">Payment Dues</h3>
                      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <UFormGroup label="Room Dues">
                          <UInput
                            v-model="form.room_dues"
                            placeholder="Room Dues"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.room_dues }"
                          />
                          <p v-if="errors.room_dues" class="text-red-500 text-sm mt-1">
                            {{ errors.room_dues[0] }}
                          </p>
                        </UFormGroup>

                        <UFormGroup label="Service Due">
                          <UInput
                            v-model="form.service_dues"
                            type="text"
                            placeholder="Service Dues"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.service_dues }"
                          />
                          <p v-if="errors.service_dues" class="text-red-500 text-sm mt-1">
                            {{ errors.service_dues[0] }}
                          </p>
                        </UFormGroup>

                        <UFormGroup label="Balcony Dues">
                          <UInput
                            v-model="form.balcony_dues"
                            type="text"
                            placeholder="Balcony Dues"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.balcony_dues }"
                          />
                          <p v-if="errors.balcony_dues" class="text-red-500 text-sm mt-1">
                            {{ errors.balcony_dues[0] }}
                          </p>
                        </UFormGroup>

                        <UFormGroup label="Condo Dues">
                          <UInput
                            v-model="form.condo_dues"
                            type="text"
                            placeholder="Condo Dues"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.condo_dues }"
                          />
                          <p v-if="errors.condo_dues" class="text-red-500 text-sm mt-1">
                            {{ errors.condo_dues[0] }}
                          </p>
                        </UFormGroup>

                        <UFormGroup label="Advances">
                          <UInput
                            v-model="form.advances"
                            type="text"
                            placeholder="Advances"
                            disabled
                            class="bg-gray-200"
                            :class="{ 'border-red-500': errors.advances }"
                          />
                          <p v-if="errors.advances" class="text-red-500 text-sm mt-1">
                            {{ errors.advances[0] }}
                          </p>
                        </UFormGroup>
                      </div>
                  </UCard>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-1 gap-3">
                <Transition
                  v-if="showBalance"
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 translate-x-full absolute"
                  enter-to-class="opacity-100 translate-x-0"
                  leave-active-class="transition-all duration-300 ease-in"
                  leave-from-class="opacity-100 translate-x-0 absolute"
                  leave-to-class="opacity-0 -translate-x-full"
                >
                  <UCard>
                    <UButton icon="i-heroicons-bolt" class="float-right" size="xs" variant="ghost" color="yellow" @click.prevent="showBalance = !showBalance">
                      View Readings
                    </UButton>
                    <h3 class="text-lg font-semibold mb-4">Previous Balance</h3>
                    <div class="text-2xl font-bold text-gray-400 mb-6">{{ form.previous_balance }}</div>
                    
                    <div class="border-y py-4">
                      <h4 class="text-sm font-medium text-gray-500 mb-2">Current Charges</h4>
                      <ul class="space-y-2">
                        <li class="flex justify-between">
                          <span class="text-xs">Payments</span>
                          <b>{{ form.payments }}</b>
                        </li>
                      </ul>
                    </div>

                    <h3 class="text-lg font-semibold mb-4">Total Amount Due</h3>
                    <div class="text-2xl font-bold text-red-500 mb-6">{{ form.total_amount_due }}</div>
                  </UCard>
                </Transition>
                <Transition
                  v-else
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 translate-x-full absolute"
                  enter-to-class="opacity-100 translate-x-0"
                  leave-active-class="transition-all duration-300 ease-in"
                  leave-from-class="opacity-100 translate-x-0 absolute"
                  leave-to-class="opacity-0 -translate-x-full"
                >
                  <UCard>
                    <UButton icon="i-heroicons-banknotes" class="float-right" size="xs" variant="ghost" color="blue" @click.prevent="showBalance = !showBalance">
                      View Balance
                    </UButton>
                    <h3 class="text-lg font-semibold mb-4">Meter Readings</h3>
                    
                    <!-- Electric Readings -->
                    <div class="mb-4" v-for="(r,rr) in readings_data" :key="rr">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">{{ r.chargeName }}</h4>
                      <div class="grid grid-cols-2 gap-4 pl-4">
                        <div>
                          <p class="text-xs text-gray-500">Previous</p>
                          <p class="font-semibold">{{ r.prevReading || '0' }}</p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Current</p>
                          <p class="font-semibold">{{ r.presReading || '0' }}</p>
                        </div>
                        <div class="col-span-2">
                          <p class="text-xs text-gray-500">Consumption</p>
                          <p class="font-bold text-blue-600">
                            {{ r.consumption || '0' }}
                          </p>
                        </div>
                      </div>
                    </div>

                  </UCard>
                </Transition>
              </div>
            </div>
         
            <UCard>
                <!-- Add this button above the UTable -->
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">Charges</h3>
                  <div>
                    <UButton
                        color="lime"
                        icon="i-heroicons-arrow-down-on-square"
                        variant="solid"
                        size="sm"
                        label="Capture All Charges"
                        @click="captureAllCharges()"
                    />
                  </div>
                </div>

                <!-- rooms table list -->
                <UTable class="text-nowrap" loading-animation="carousel" :rows="loading ? [] : condo_dues_data" :columns="chargeColumns">
                  <template #chargeSelect-data="{ row, index }">
                    <div class="flex space-x-2">
                      <p>{{ row.chargeName }}</p>
                    </div>
                  </template>
                  <template #usageInput-data="{ row, index }">
                    <div class="flex space-x-2">
                     <UFormGroup>
                        <p >{{ row.usage }}</p>
                      </UFormGroup>
                    </div>
                  </template>
                  <template #actions-data="{ row, index }">
                    <div class="flex space-x-2">
                      <UButton
                        color="red"
                        icon="i-heroicons-arrow-up-on-square"
                        variant="ghost"
                        size="sm"
                        label="Uncapture"
                        @click.prevent="uncaptureCharges(row.id)"
                      />

                    </div>
                  </template>
                </UTable>
          
            </UCard>
           
            <UCard>
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Parkings</h3>
                    <div>
                      
                    </div>
                </div>
                <!-- rooms table list -->
                <UTable class="text-nowrap" loading-animation="carousel" :rows="loading ? [] : parkings_data" :columns="parkingColumns">
                  <!-- <template #chargeSelect-data="{ row, index }">
                    <p>{{ row.chargeName }}</p>
                    <div v-else class="flex space-x-2">
                      <USelect
                        v-model="row.parking_id"
                        :options="parkings_dropdown"
                        placeholder="Select Charges"
                        class="bg-gray-200 w-full"
                      >
                        <template #option="{ option }">
                          {{ option.label }}
                        </template>
                      </USelect>
                    </div>
                  </template> -->
                  <template #usageInput-data="{ row, index }">
                    <div class="flex space-x-2">
                     <UFormGroup>
                        <UInput
                          v-model="row.usage"
                          disabled
                          type="number"
                          placeholder="Owner Name"
                          class="bg-gray-200"
                        />
                      </UFormGroup>
                    </div>
                  </template>
                  <template #actions-data="{ row, index }">
                    <div class="flex space-x-2">
                      <UButton
                        color="red"
                        icon="i-heroicons-arrow-up-on-square"
                        variant="ghost"
                        size="sm"
                        label="Uncapture"
                        @click.prevent="uncaptureCharges(row.id)"
                      />
                    </div>
                  </template>
                </UTable>
          
            </UCard>

            <UCard>
                <div class="flex justify-between items-center">
                     <h3 class="text-lg font-semibold">Utilities</h3>
                     <div>
                      
                     </div>
                </div>
                <!-- rooms table list -->
                <UTable class="text-nowrap" loading-animation="carousel" :rows="loading ? [] : utilities_data" :columns="readingsColumns">
                  <template #actions-data="{ row, index }">
                    <div class="flex space-x-2">
                     <UButton
                        color="red"
                        icon="i-heroicons-arrow-up-on-square"
                        variant="ghost"
                        size="sm"
                        label="Uncapture"
                        @click.prevent="uncaptureCharges(row.id)"
                      />
                    </div>
                  </template>
                </UTable>
          
            </UCard>
           
            <UCard>
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Miscellaneous</h3>
                    <div>
                      
                    </div>
                </div>
                <!-- rooms table list -->
                <UTable class="text-nowrap" loading-animation="carousel" :rows="loading ? [] : misc_data" :columns="miscColumns">
                  <template #actions-data="{ row, index }">
                    <div class="flex space-x-2">
                      <UButton
                        color="red"
                        icon="i-heroicons-arrow-up-on-square"
                        variant="ghost"
                        size="sm"
                        label="Uncapture"
                        @click.prevent="uncaptureCharges(row.id)"
                      />
                    </div>
                  </template>
                </UTable>      
            </UCard>
            <UCard>
              <div class="flex justify-end">
                  <UButton
                      color="lime"
                      icon="i-heroicons-arrow-up-circle"
                      variant="solid"
                      size="sm"
                      label="Create Bill"
                      @click="createBilling()"
                  />
              </div>
            </Ucard>
          </div>
        </UForm>
      </UCard>
    </Modalx>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";


const emits = defineEmits(["transaction_id"]);
const props = defineProps({
    data: Object, // Assuming data is passed as a prop
});
const isEditModalOpen = ref(false);
const showBalance = ref(true);
const roomtypes = ref([]); // To store company data
const buildings = ref([]); // To store company data
const condo_dues_data = ref([]);
const parkings_data = ref([]);
const penaltie_data = ref([]);
const readings_data = ref([]);
const misc_data = ref([]);

const parkings_dropdown = ref([]);
const dues_dropdown = ref([]);
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10, owner_id: 0 });

const form = ref({
  room_id: 0,
  room_num: "", 
  floor: 1, 
  building_id: 0, 
  roomtype_id: 0,
  previous_balance: 0, 
  payments: 0,
  total_amount_due: 0,
  charge_bill_misc_ids: [],
  charge_bill_parking_ids: [],
  charge_bill_condo_dues_ids: [], 
  charge_bill_readings_ids: [],
});
const coverageForm = ref({
  coverage_from: '',
  coverage_to: '',
  usage: 2,
  amount: 0,
  charge_type: 0,
});
const errors = ref({}); // To store validation errors

const chargeColumns = [
  { key: "chargeSelect", label: "Charge Name", sortable: true, class: "px-2 px-2" },
  { key: "rate", label: "Rate", sortable: true, class: "px-2 px-2"  },
  { key: "usageInput", label: "Usage", sortable: true, class: "px-2 px-2"  },
  { key: "total", label: "Total", sortable: true, class: "px-2 px-2"  },
  { key: "remarks", label: "Remarks", sortable: true, class: "px-2 px-2"  },
  { key: "actions", label: "Actions", sortable: true, class: "px-2 px-2"  },
]

const parkingColumns = [
  { key: "chargeName", label: "Utility Name", sortable: true, class: "px-2 px-2"  },
  { key: "parkingName", label: "Parking Name", sortable: true, class: "px-2 px-2"  },
  { key: "rate", label: "Rate", sortable: true, class: "px-2 px-2"  },
  { key: "total", label: "Total", sortable: true, class: "px-2 px-2"  },
  { key: "remarks", label: "Remarks", sortable: true, class: "px-2 px-2"  },
  { key: "actions", label: "Actions", sortable: true, class: "px-2 px-2"  },
]

const readingsColumns = [
  { key: "chargeName", label: "Utility Name", sortable: true, class: "px-2 px-2"  },
  { key: "prevReading", label: "Previous", sortable: true, class: "px-2 px-2"  },
  { key: "presReading", label: "Present", sortable: true, class: "px-2 px-2"  },
  { key: "consumption", label: "Consumption", sortable: true, class: "px-2 px-2"  },
  { key: "rate", label: "Rate", sortable: true, class: "px-2 px-2"  },
  { key: "total", label: "Total", sortable: true, class: "px-2 px-2"  },
  { key: "remarks", label: "Remarks", sortable: true, class: "px-2 px-2"  },
  { key: "actions", label: "Actions", sortable: true, class: "px-2 px-2"  },
]

const miscColumns = [
  { key: "chargeName", label: "Utility Name", sortable: true, class: "px-2 px-2"  },
  { key: "rate", label: "Rate", sortable: true, class: "px-2 px-2"  },
  { key: "usage", label: "Usage", sortable: true, class: "px-2 px-2"  },
  { key: "total", label: "Total", sortable: true, class: "px-2 px-2"  },
  { key: "remarksText", label: "Remarks", sortable: true, class: "px-2 px-2"  },
  { key: "actions", label: "Actions", sortable: true, class: "px-2 px-2"  },
]

const openModal = () => {
  isEditModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
  fillForm(); // Fill the form with data if available
  getBuildingDropdown(); // Fetch building dropdown data
  getRoomTypesDrodown(); // Fetch room types dropdown data
  getBillingCharges();
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

const getBillingCharges = async () => {
  try {
    loading.value = true;

    const formData = FormDx({ room_id: form.value.room_id });
    const response = await axios.post(
      `${VUE_APP_API_URL}billings/get-charge-bills-for-create-main-bill`,
      formData, 
      BearToken()
    );

    // Store other data
    const { condoDuesChargeBill,readings,miscs,parkings,parkingDropdown,condoDuesDropdown,roomInfo  } = response.data;
    // Store other data
    condo_dues_data.value = condoDuesChargeBill;
    misc_data.value = miscs;
    parkings_data.value = parkings;
    readings_data.value = readings;
    parkings_dropdown.value = parkingDropdown;
    dues_dropdown.value = condoDuesDropdown;

    form.value.previous_balance = roomInfo.previouseBalance ?? 0;
    form.value.payments = response.data.payments ?? 0;
    form.value.total_amount_due = response.data.totalAmountDue ?? 0;

    form.value.room_dues = roomInfo.roomDues ?? 0;
    form.value.service_dues = roomInfo.serviceDues ?? 0;
    form.value.balcony_dues = roomInfo.balconyDues ?? 0;
    form.value.condo_dues = roomInfo.condoDues ?? 0;
    form.value.advances = roomInfo.advanceCondoDues ?? 0;


    form.value.charge_bill_misc_ids = misc_data.value.map(item => item.id);
    form.value.charge_bill_parking_ids = parkings_data.value.map(item => item.id);
    form.value.charge_bill_condo_dues_ids = condo_dues_data.value.map(item => item.id);
    form.value.charge_bill_readings_ids = readings_data.value.map(item => item.id);

    form.value.previous_balance = response.data.previousBalance ?? 0;
    form.value.payments = response.data.payments ?? 0;
    form.value.total_amount_due = response.data.totalAmountDue ?? 0;

    loading.value = false;
  } catch (error) {
    handleApiError(error);
  }
};

const createBilling = async () => {
  const prompt = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, create it!",
  });

  if (prompt.isConfirmed) {
    try {
      const formData = FormDx(form.value);

      const response = await axios.post(`${VUE_APP_API_URL}billings/create-bill`, formData, BearToken());
      Alerto("success", "Success", response.data.message);
      getBillingCharges();
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  }
};

const captureAllCharges = async () => {
  const prompt = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, capture it!",
  });

  if (prompt.isConfirmed) {
    try {
      const formData = FormDx({ room_id: form.value.room_id });

      const response = await axios.post(`${VUE_APP_API_URL}billings/capture-charge-bills`, formData, BearToken());
      Alerto("success", "Success", response.data.message);
      getBillingCharges();
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  }
};

const uncaptureCharges = async (charge_id) => {
  const prompt = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, uncapture it!",
  });

  if (prompt.isConfirmed) {
    try {
      const formData = FormDx({ charge_bill_id: charge_id });

      const response = await axios.post(`${VUE_APP_API_URL}billings/uncapture-charge-bill`, formData, BearToken());
      Alerto("success", "Success", response.data.message);
      getBillingCharges();
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  }
};

const handleTransactions = (data) => {

  getBillingCharges();
}
const fillForm = () => {
  const data = props.data;

  form.value.room_id = data.id,
  form.value.room_num = data.room_num, 
  form.value.floor = data.floor, 
  form.value.building_id = data.building_id, 
  form.value.roomtype_id = data.roomtype_id,
  form.value.owner_account = data.ownerAccountNumber,
  form.value.owner_name = data.ownerName,
  form.value.owner_id = data.ownerId,
  form.value.owner_email = data.ownerEmail,

  search.value.owner_id = data.ownerId;
  errors.value = {};
};

// Add a function to clear the form
const clearForm = () => {

 form.value = {
    room_id: 0,
    room_num: "", 
    floor: 1, 
    building_id: 0, 
    roomtype_id: 0,
    previous_balance: 0, 
    payments: 0,
    total_amount_due: 0,
    charge_bill_misc_ids: [],
    charge_bill_parking_ids: [],
    charge_bill_condo_dues_ids: [], 
    charge_bill_readings_ids: [],
  };

  search.value.owner_id = 0;
  errors.value = {};
};

// Add these functions
const addChargeRow = () => {
  form.value.charges.push({
    charge_bill_id: 0,
    charge_id: "",
    charge_name: '',
    usage: 0,
    rate: 0,
    total: 0,
    remarks: '',
    is_capture: false,
  });
};

const removeChargeRow = (index) => {
  form.value.charges.splice(index, 1);
};

const addParkingRow = () => {
  form.value.parkings.push({
    charge_bill_id: 0,
    charge_id: "",
    charge_name: '',
    usage: 0,
    rate: 0,
    total: 0,
    remarks: '',
    is_capture: false,
  });
};

const removeParkingRow = (index) => {
  form.value.parkings.splice(index, 1);
};
</script>
