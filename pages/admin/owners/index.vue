<template>
  <div v-if="hasPermission('Navigation_Owners')">
    <div class="flex flex-col space-y-6 p-1 min-h-screen">
      <div class="flex items-center justify-between">
        <BreadCrumbs page="Owners" />
      </div>

      <UCard>
        <UTabs 
          v-model="activeTab"
          :items="items" 
          variant="link" 
          class="gap-4 w-full" 
          :ui="{ trigger: 'flex-1' }"
          @change="handleTabChange"
        >
          <template #all>
            <AllOwner />
          </template>
          <template #transfer>
            <TransferOwner />
          </template>
        </UTabs>
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

import BreadCrumbs from "@/components/BreadCrumbs.vue";
import Loader from "@/components/Loader.vue";
import Error403 from "@/error/Error403.vue";

// Modules
import TransferOwner from "./transfer/index.vue";
import AllOwner from "./all/index.vue";

import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();

// Initialize activeTab from route query or default to 'all'
const activeTab = ref(route.query.tab || 'all');

// Handle tab changes
const handleTabChange = (tab) => {
  router.replace({ query: { ...route.query, tab } });
};

const items = [
  {
    label: 'All Owners',
    icon: 'i-heroicons-users',
    slot: 'all'
  },
  {
    label: 'Transfer Owners',
    icon: 'i-heroicons-arrows-right-left',
    slot: 'transfer'
  },
];


</script>
