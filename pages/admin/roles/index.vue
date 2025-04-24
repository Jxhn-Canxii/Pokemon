<template>
  <div v-if="hasPermission('Navigation_Roles')">
    <div class="flex flex-col space-y-6 p-1 min-h-screen">
      <!-- Breadcrumbs and Header -->
      <div class="flex items-center justify-between">
        <BreadCrumbs page="Roles" />
      </div>

      <!-- Search & Add Role -->
      <UCard>
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <UInput
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Roles..."
            :trailing="true"
            class="w-full md:w-1/3"
          />
          <AddRole @transaction_id="handleTransactions" />
        </div>

        <!-- Responsive Table Wrapper -->
        <div class="overflow-x-auto">
          <UCard>
            <UTable class="text-nowrap" :rows="loading ? [] : data.roles" :columns="columns">
              <!-- Loader inside the table -->
              <template #body>
                <tr v-if="loading">
                  <td colspan="100%" class="text-center py-4">
                    <Loader />
                  </td>
                </tr>
                <tr v-else-if="data.roles.length === 0">
                  <td colspan="100%" class="text-center py-4 text-gray-500">
                    No data found.
                  </td>
                </tr>
              </template>

              <template #name-data="{ row }">
                {{ row.name }}
              </template>
              <template #actions-data="{ row }">
                <div class="flex space-x-2">
                  <EditRole :data="row" :key="row.id" @transaction_id="handleTransactions" />
                  <DeleteRole :data="row" :key="row.id" @transaction_id="handleTransactions" />
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
  useDebounce,
} from "@/utility/Helper.js";
import { VUE_APP_API_URL } from "@/utility/Global.js";
import { hasPermission } from "@/utility/Permissions.js";

import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Loader from "@/components/Loader.vue";
import Error403 from "@/error/Error403.vue";

// Modules
import AddRole from "./module/AddRole.vue";
import EditRole from "./module/EditRole.vue";
import DeleteRole from "./module/DeleteRole.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

// Data & States
const data = ref({ roles: [], totalrows: 0 });
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10 });

const columns = [
  { key: "name", label: "Role Name" },
  { key: "actions", label: "Actions" },
];

// Fetch Roles
const getRolesList = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/list`,
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
  getRolesList();
};

// Search Handler with Debounce
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getRolesList();
}, 500);

// Handle Transactions (reload list)
const handleTransactions = () => getRolesList();

// Load roles on mount
onMounted(getRolesList);
</script>
