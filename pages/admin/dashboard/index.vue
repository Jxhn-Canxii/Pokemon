<template>
  <div class="space-y-6 p-4" v-if="hasPermission('Navigation_Dashboard')">
    <!-- Welcome Card -->
    <div class="grid grid-cols-1 gap-4 mt-4">
    <UCard>
      <template #header>
        <h1 class="font-bold text-lg">Welcome to the Dashboard</h1>
      </template>
      <p class="text-gray-600">
        Manage your system, view statistics, and track real-time data here.
      </p>
      <template #footer>
        <UButton icon="i-heroicons-arrow-right" color="primary">Get Started</UButton>
      </template>
    </UCard>
    </div>
    <!-- Dashboard Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <template #header>
          <h2 class="text-gray-600 font-semibold">Total Users</h2>
        </template>
        <p class="text-3xl font-bold">1,245</p>
        <p class="text-green-500 text-sm">+5.2% this month</p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-gray-600 font-semibold">Revenue</h2>
        </template>
        <p class="text-3xl font-bold">₱ 24,520</p>
        <p class="text-green-500 text-sm">+12.4% this month</p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-gray-600 font-semibold">Active Sessions</h2>
        </template>
        <p class="text-3xl font-bold">325</p>
        <p class="text-red-500 text-sm">-2.1% this week</p>
      </UCard>
    </div>

    <!-- Placeholder for Chart -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">User Activity</h2>
      </template>
      <div class="h-40 flex items-center justify-center bg-gray-100">
        <p class="text-gray-400">[ Chart Placeholder ]</p>
      </div>
    </UCard>

    <!-- Recent Transactions -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">Recent Transactions</h2>
      </template>
      <UTable :rows="transactions" :columns="columns" />
    </UCard>
  </div>
   <div v-else>
    <Error403 />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Error403 from "@/error/Error403.vue";
import { hasPermission } from "@/utility/Permissions.js";
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const transactions = ref([
  { id: "#001", user: "John Doe", amount: "₱ 120.00", status: "Completed" },
  { id: "#002", user: "Jane Smith", amount: "₱ 250.00", status: "Pending" },
  { id: "#003", user: "Mike Lee", amount: "₱ 320.00", status: "Completed" },
]);

const columns = ref([
  { key: "id", label: "Transaction ID" },
  { key: "user", label: "User" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
]);
</script>
