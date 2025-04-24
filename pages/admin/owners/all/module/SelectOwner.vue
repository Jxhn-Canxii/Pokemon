<template>
  <div>
    <UButton icon="i-heroicons-users" color="blue" @click.prevent="openModal()">
      Add Owner
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Select Owner" @close="isAddModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UTable class="text-wrap text-xs" :rows="loading ? [] : data.owners" :columns="columns">
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
          <template #fullName-data="{ row }">
            <p class="text-wrap">{{ row.fullname }}</p>
          </template>
          <template #actions-data="{ row }">
            <div class="flex space-x-2">
              <UButton icon="i-heroicons-check" color="lime" @click="selectOwner(row)">
                Select
              </UButton>
            </div>
          </template>
        </UTable>
        <UPagination
          v-if="!loading && data.totalrows > 0"
          v-model="search.page_num"
          :total="data.totalrows"
          :items-per-page="search.itemsperpage"
          @update:modelValue="handlePagination"
          class="justify-center"
        />
      </UCard>
    </Modalx>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { BearToken, handleApiError, Alerto, FormDx } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";
import nationalitiesData from '@/data/nationalities.json';

const emits = defineEmits(["result"]);
const isAddModalOpen = ref(false);
const loading = ref(false);
const search = ref({ search: "", page_num: 1, itemsperpage: 10, building_id: 0 });
const data = ref([]);

const errors = ref({}); // To store validation errors

const columns = [
  { key: "account_num", label: "Account", },
  { key: "fullName", label: "Fullname" },
  { key: "contactinfo", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "actions", label: "Actions" },
];

const selectOwner = (data) => {
  isAddModalOpen.value = false;
  emits('result',data);
}
const openModal = () => {
  isAddModalOpen.value = true;
  getOwners(); // Clear the form when opening the modal
};

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
    console.log(error);
    handleApiError(error);
  } finally {
    loading.value = false;
  }
};
</script>
