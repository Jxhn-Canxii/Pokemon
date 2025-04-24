<template>
  <div>
    <UButton icon="i-heroicons-building-office" color="blue" @click.prevent="openModal()">
      Select Room
    </UButton>

    <Modalx v-model:show="isAddModalOpen" title="Select Room" @close="isAddModalOpen = false" :maxWidth="'4xl'">
      <UCard>
        <UTable class="text-wrap text-xs" :rows="loading ? [] : data.rooms" :columns="columns">
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
          <template #status-data="{ row }">
          <div class="flex justify-start items-center">
                <span class="px-2 rounded-full text-sm text-white" :class="row.isVacant ? 'bg-lime-500' : 'bg-gray-500'">{{ row.isVacant ? 'Vacant' : 'Occupied'}}</span>
          </div>
          </template>
          <template #actions-data="{ row }">
            <div class="flex space-x-2">
              <UButton icon="i-heroicons-check" :disabled="!row.isVacant" :color="row.isVacant ? 'lime' : 'gray'" @click="selectRoom(row)">
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
  { key: "room_num", label: "Name", },
  { key: "building", label: "Building" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const selectRoom = (data) => {
  isAddModalOpen.value = false;
  emits('result',data);
}
const openModal = () => {
  isAddModalOpen.value = true;
  getRooms(); // Clear the form when opening the modal
};

// Fetch Permissions
const getRooms = async () => {
  try {
    loading.value = true;
    const response = await axios.post(
      `${VUE_APP_API_URL}rooms/get-vacant`,
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
