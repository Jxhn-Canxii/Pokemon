<template>
  <div v-if="hasPermission('Navigation_Users')">
    <div class="flex flex-col space-y-6 p-1 min-h-screen">
      <!-- Breadcrumbs and Header -->
      <div class="flex items-center justify-between">
        <BreadCrumbs page="Users" />
      </div>

      <!-- Search & Add User -->
      <UCard>
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <UInput
            v-model="search.search"
            @input.prevent="searchInput()"
            placeholder="Search Users..."
            :trailing="true"
            class="w-full md:w-1/3"
          />
          <AddUser @transaction_id="handleTransactions" />
        </div>

        <!-- Responsive Table Wrapper -->
        <div class="overflow-x-auto">
          <UCard>
            <UTable class="text-nowrap" :rows="loading ? [] : data.users" :columns="columns">
              <!-- Loader inside the table -->
              <template #body>
                <tr v-if="loading">
                  <td colspan="100%" class="text-center py-4">
                    <Loader />
                  </td>
                </tr>
                <tr v-else-if="data.users.length === 0">
                  <td colspan="100%" class="text-center py-4 text-gray-500">
                    No data found.
                  </td>
                </tr>
              </template>

              <template #actions-data="{ row }">
                <div class="flex space-x-2">
                  <EditUser :data="row" :key="row.id" @transaction_id="handleTransactions" />
                  <ResetPassword :data="row" :key="row.id" @transaction_id="handleTransactions" />
                  <DeleteUser :data="row" :key="row.id" @transaction_id="handleTransactions" />
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
import AddUser from "./module/AddUser.vue";
import EditUser from "./module/EditUser.vue";
import DeleteUser from "./module/DeleteUser.vue";
import ResetPassword from "./module/ResetPassword.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

// Data & States
const data = ref({ users: [], totalrows: 0 });
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10 });

const columns = [
  { key: "username", label: "Username" },
  { key: "fullName", label: "Fullname" },
  { key: "email", label: "Email" },
  { key: "roleName", label: "Role" },
  { key: "actions", label: "Actions" },
];

// Fetch Users
const getUsersList = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}users/list`,
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
  getUsersList();
};

// Search Handler with Debounce
const searchInput = useDebounce(async () => {
  search.value.page_num = 1;
  await getUsersList();
}, 500);

// Handle Transactions (reload list)
const handleTransactions = () => getUsersList();

// Load users on mount
onMounted(getUsersList);
</script>
