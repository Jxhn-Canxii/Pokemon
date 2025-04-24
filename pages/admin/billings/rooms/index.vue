<template>
  <div v-if="hasPermission('Transfer_Owners_Tab')">
    <div class="flex flex-col space-y-6 p-1 min-h-screen">

      <!-- Search & Add Permission -->
      <UCard>
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <UInput
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Owner..."
            :trailing="true"
            class="w-full md:w-1/3"
          />
          <AddRoomOwner @transaction_id="handleTransactions" />
        </div>

        <!-- Responsive Table Wrapper -->
        <div class="overflow-x-auto">
          <UCard>
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
              <template #room_type-data="{ row }">
                <p class="text-wrap" :title="`Room Type: ${row.roomtypeName}`">{{ row.roomtypeName }} ({{ row.roomtypeAbbre }})</p>
              </template>
              <template #owner-data="{ row }">
                <p class="text-wrap">{{ row.ownerName }}</p>
              </template>
              <template #actions-data="{ row }">
                <div class="flex space-x-2">
                  <CreateBill :key="row.id" :data="row" @transaction_id="handleTransactions" />
                  <Charges :key="row.id" :data="row" @transaction_id="handleTransactions" />
                  <TransferOwner :key="row.id" :data="row" @transaction_id="handleTransactions" />
                  <RoomsOwned :key="row.id" :data="row" @transaction_id="handleTransactions" />
                  <ParkingsOwned :key="row.id" :data="row" @transaction_id="handleTransactions" />
                </div>
              </template>
            </UTable>
          </UCard>
        </div>

        <!-- Pagination -->
        <UPagination
          v-if="!loading && data.totalrows > 0"
          v-model="search.page_num"
          :total="data.totalrows"
          :items-per-page="search.itemsperpage"
          @update:modelValue="handlePagination"
          class="justify-center"
        />
      </UCard>
    </div>
  </div>

  <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Alerto,
  BearToken,
  handleApiError,
  replaceUnderScore,
  useDebounce,
} from "@/utility/Helper.js";
import { VUE_APP_API_URL } from "@/utility/Global.js";
import { hasPermission } from "@/utility/Permissions.js";

import Loader from "@/components/Loader.vue";
import Error403 from "@/error/Error403.vue";

// Modules
import TransferOwner from "./module/TransferOwner.vue";
import RoomsOwned from "./module/RoomsOwned.vue";
import ParkingsOwned from "./module/ParkingsOwned.vue";
import Charges from "./module/Charges.vue";
import CreateBill from "./module/CreateBill.vue";
// Data & States
const data = ref({ permissions: [], totalrows: 0 });
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10, building_id: 0 });

const columns = [
  { key: "room_num", label: "Room", },
  { key: "room_type", label: "Type", },
  { key: "owner", label: "Owner" },
  { key: "condoDues", label: "Condo Dues" },
  { key: "unpaid", label: "Balance" },
  { key: "actions", label: "Actions" },
];

// Fetch Permissions
const getBillings = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}billings/list`,
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

// Pagination Handler
const handlePagination = (page_num) => {
  search.value.page_num = page_num ?? 1;
  getBillings();
};

// Search Handler with Debounce
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getBillings();
}, 500);

// Handle Transactions (reload list)
const handleTransactions = () => getBillings();

// Load permissions on mount
onMounted(getBillings);
</script>
