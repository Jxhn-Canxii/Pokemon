<template>
  <div>
    <UButton icon="i-heroicons-home-modern" color="blue" @click="openModal()">
      Rooms
    </UButton>

    <Modalx v-model:show="isEditModalOpen" title="Room's Owned" @close="isEditModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UForm>
          <div class="space-y-6 p-4 overflow-auto">
            <h3 class="text-lg font-semibold mb-4">Owner Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup label="Account">
                <UInput
                  v-model="form.owner_account"
                  placeholder="Enter Room Name"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.owner_account }"
                />
                <p v-if="errors.owner_account" class="text-red-500 text-sm mt-1">
                  {{ errors.owner_account[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Name">
                <UInput
                  v-model="form.owner_name"
                  type="text"
                  placeholder="Owner Name"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.owner_name }"
                />
                <p v-if="errors.owner_name" class="text-red-500 text-sm mt-1">
                  {{ errors.owner_name[0] }}
                </p>
              </UFormGroup>

              <UFormGroup label="Email">
                <UInput
                  v-model="form.owner_email"
                  type="text"
                  placeholder="Owner Email"
                  disabled
                  class="bg-gray-200"
                  :class="{ 'border-red-500': errors.owner_email }"
                />
                <p v-if="errors.owner_email" class="text-red-500 text-sm mt-1">
                  {{ errors.owner_email[0] }}
                </p>
              </UFormGroup>
            </div>

            <!-- Rates Section -->
            <div>
                <h3 class="text-lg font-semibold mb-4">Rooms List</h3>
                <!-- rooms table list -->
                <UTable class="text-nowrap" loading loading-color="primary" loading-animation="carousel" :rows="loading ? [] : data.rooms" :columns="columns">
                  <!-- Loader inside the table -->
                  <template #body>
                    <tr v-if="loading">
                      <td colspan="100%" class="text-center py-4">
                        <Loader />
                      </td>
                    </tr>
                    <tr v-else-if="data.rooms.length === 0">
                      <td colspan="100%" class="text-center py-4 text-gray-500">
                        No data found.
                      </td>
                    </tr>
                  </template>

                  <template #roomName-data="{ row }">
                    {{ row.room_num }} ({{ row.roomtypeAbbre }})
                  </template>
                  <template #actions-data="{ row }">
                    <div class="flex space-x-2">
                      <EditRoom :key="row.id" :data="row" @transaction_id="handleTransactions" />
                      <DeleteRoom :key="row.id" :data="row" @transaction_id="handleTransactions" />
                    </div>
                  </template>
                </UTable>
                <!-- Pagination -->
                <UPagination
                  v-if="!loading && data.totalrows > 0"
                  v-model="search.page_num"
                  :total="data.totalrows"
                  :items-per-page="search.itemsperpage"
                  @update:modelValue="handlePagination"
                  class="justify-center"
                />
            </div>
            <!-- Submit Button -->
            <!-- <div class="flex justify-end">
              <UButton type="submit" color="blue">
                Save
              </UButton>
            </div> -->
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
    data: Object, // Assuming data is passed as a prop
});
const isEditModalOpen = ref(false);
const roomtypes = ref([]); // To store company data
const buildings = ref([]); // To store company data
const data = ref({ permissions: [], totalrows: 0 });
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10, owner_id: 0 });

const form = ref({
  room_id: 0,
  room_num: "", 
  floor: 1, 
  building_id: 0, 
  roomtype_id: 0,
});

const errors = ref({}); // To store validation errors

const columns = [
  { key: "roomName", label: "Name", sortable: true },
  { key: "roomArea", label: "Room Area", sortable: true  },
  { key: "balconyArea", label: "Balcony Area", sortable: true },
  { key: "serviceArea", label: "Service Area", sortable: true },
  // { key: "actions", label: "Actions" },
];

const openModal = () => {
  isEditModalOpen.value = true;
  clearForm(); // Clear the form when opening the modal
  fillForm(); // Fill the form with data if available
  getBuildingDropdown(); // Fetch building dropdown data
  getRoomTypesDrodown(); // Fetch room types dropdown data
  getRoomsPerOwner();
};

const getRoomsPerOwner = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}owners/get-rooms-per-owner`,
      search.value,
      BearToken()
    );
    data.value = response.data;
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
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
  console.log(data);
  form.value = {
    room_id: data.id,
    room_num: data.room_num, 
    floor: data.floor, 
    building_id: data.building_id, 
    roomtype_id: data.roomtype_id,
    owner_account: data.ownerAccountNumber,
    owner_name: data.ownerName,
    owner_id: data.ownerId,
    owner_email: data.ownerEmail,
  };

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
    owner_account: '',
    owner_name: '',
    owner_id: 0,
    owner_email: '',
  };
  search.value.owner_id = 0;
  errors.value = {};
};

</script>
