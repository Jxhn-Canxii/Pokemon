<template>
  <div class="flex flex-col items-center w-full">
    <!-- Pagination Component -->
    <UPagination
      v-model="currentPage"
      :page-count="itemsPerPage"
      :total="totalRows"
      show-first
      show-last
      :prev-button="prevButton"
      :next-button="nextButton"
      :first-button="firstButton"
      :last-button="lastButton"
      class="mt-5"
    />

    <!-- Page Info -->
    <p v-if="totalRows > 0" class="text-bold text-center mt-5">
      {{ pageInfo(currentPage, totalRows, itemsPerPage) }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";
import { pageInfo } from "@/utility/Pagination";

// Props & Emits
const emits = defineEmits(["page_num"]);
const props = defineProps({
  page_number: { type: Number, default: 1 },
  total_rows: { type: Number, default: 0 },
  itemsperpage: { type: Number, default: 10 },
});

// Local State
const currentPage = ref(props.page_number);
const totalRows = computed(() => props.total_rows);
const itemsPerPage = computed(() => props.itemsperpage);

// Watch for Changes & Emit
watch(currentPage, (newPage) => {
  emits("page_num", newPage);
});

// Icons for Buttons
const firstButton = { icon: faAngleDoubleLeft };
const lastButton = { icon: faAngleDoubleRight };
const prevButton = { icon: faChevronLeft };
const nextButton = { icon: faChevronRight };

// Sync with Props
watch(
  () => props.page_number,
  (newVal) => {
    currentPage.value = newVal;
  }
);
</script>
