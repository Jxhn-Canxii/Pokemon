<template>
  <div v-if="hasPermission('All_Owners_Tab')">
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
          <div class="flex justify-start gap-2">
              <!-- <AddOwner @transaction_id="handleTransactions" />
              <AddParkingOwner @transaction_id="handleTransactions" /> -->
              <AddRoomOwner @transaction_id="handleTransactions" />
          </div>
        </div>

        <!-- Responsive Table Wrapper -->
        <div class="overflow-x-auto">
          <UCard>
            <UTable class="text-nowrap" loading loading-color="primary" loading-animation="carousel" :rows="loading ? [] : data.owners" :columns="columns">
              <!-- Loader inside the table -->
              <template #body>
                <tr v-if="loading">
                  <td colspan="100%" class="text-center py-4">
                    <Loader />
                  </td>
                </tr>
                <tr v-else-if="data.owners.length === 0">
                  <td colspan="100%" class="text-center py-4 text-gray-500">
                    No data found.
                  </td>
                </tr>
              </template>
              <template #unitOwned-data="{ row }">
                <p class="text-wrap">{{ row.unitOwned }}</p>
              </template>
              <template #fullName-data="{ row }">
                <p class="text-wrap">{{ row.fullname }}</p>
              </template>
              <template #email-data="{ row }">
                <p class="text-wrap">{{ row.email }}</p>
              </template>
              <template #actions-data="{ row }">
                <div class="flex space-x-2">
                  <EditOwner :key="row.id" :data="row" @transaction_id="handleTransactions" />
                  <DeleteOwner :key="row.id" :data="row" @transaction_id="handleTransactions" />
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
import AddOwner from "./module/AddOwner.vue";
import AddRoomOwner from "./module/AddRoomOwner.vue";
import AddParkingOwner from "./module/AddParkingOwner.vue";
import EditOwner from "./module/EditOwner.vue";
import DeleteOwner from "./module/DeleteOwner.vue";

// Data & States
const data = ref([]);
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10, building_id: 0 });

const columns = [
  { key: "account_num", label: "Account", },
  { key: "fullName", label: "Fullname" },
  { key: "unitOwned", label: "Unit Owned" },
  { key: "contactinfo", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "actions", label: "Actions" },
];

// Fetch Permissions
const getOwners = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}owners/list`,
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
  getOwners();
};

// Search Handler with Debounce
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getOwners();
}, 500);

// Handle Transactions (reload list)
const handleTransactions = () => getOwners();

// Load permissions on mount
onMounted(getOwners);
</script>
