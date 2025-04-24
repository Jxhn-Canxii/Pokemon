<template>
  <div class="relative w-full">
    <!-- Selected Items Display -->
    <div class="flex flex-wrap gap-2 mb-2">
      <UBadge
        v-for="(item, index) in selectedItems"
        :key="item[props.itemId]"
        class="bg-blue-200 text-sm p-1 rounded flex items-center space-x-1"
      >
        <span>{{ labelFormatter(item) }}</span>
        <UButton
          size="xs"
          color="red"
          variant="link"
          icon="i-heroicons-x-circle"
          @click="removeSelectedItem(index)"
        />
      </UBadge>
    </div>

    <!-- Input Field -->
    <UInput
      v-model="searchQuery"
      :placeholder="placeholder"
      @input="onInput"
      @keydown="handleKeyDown"
      autocomplete="off"
      :id="inputId"
      class="w-full"
    >
      <template #trailing>
        <UButton icon="i-heroicons-chevron-down" variant="link" @click.prevent="viewItems()" />
      </template>
    </UInput>

    <!-- Dropdown Menu -->
    <UCard
      v-if="filteredItems.length > 0 && searchQuery.length > 0"
      class="absolute bg-white shadow-lg w-full mt-1 overflow-auto"
      style="max-height: 200px;"
      @scroll="handleScroll"
    >
      <ul>
        <li
          v-for="(item, index) in filteredItems"
          :key="item[props.itemId]"
          class="p-2 flex items-center cursor-pointer hover:bg-gray-100"
          :class="{ 'bg-gray-200': selectedIndex === index }"
          @click="toggleSelectItem(item)"
          @mouseover="selectedIndex = index"
        >
          {{ labelFormatter(item) }}
          <span v-if="isSelected(item)" class="ml-auto text-green-500 font-bold">✓</span>
        </li>
        <li v-if="loadingMore" class="text-center py-2">Loading more...</li>
        <li v-if="!loadingMore && !hasMoreItems" class="text-center py-2 text-gray-500">No more items</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import axios from "axios";
import { BearToken } from "@/utility/Helper";
import { VUE_APP_API_URL } from "@/utility/Global";

const props = defineProps({
  apiEndpoint: String,
  searchModel: Object,
  placeholder: String,
  itemLabel: String,
  itemId: String,
  inputId: String,
  returnName: String,
  dataKey: String,
  defaultValue: Array,
  formatLabel: { type: String, default: 'none' },
});

const emit = defineEmits(["items-selected"]);
const searchQuery = ref("");
const filteredItems = ref([]);
const selectedItems = ref(props.defaultValue || []);
const selectedIndex = ref(-1);
const loadingMore = ref(false);
const hasMoreItems = ref(true);
const page = ref(1);
const token = localStorage.getItem("token");

const viewItems = () => {
  filteredItems.value.length > 0 ? (filteredItems.value = []) : fetchItems();
};

const fetchItems = async (loadMore = false) => {
  try {
    if (!loadMore) {
      filteredItems.value = [];
      page.value = 1;
      hasMoreItems.value = true;
    }
    const response = await axios.post(
      `${VUE_APP_API_URL}${props.apiEndpoint}`,
      { ...props.searchModel, page_num: page.value },
      BearToken(token)
    );
    const newItems = response.data[props.dataKey] || [];
    if (newItems.length === 0) hasMoreItems.value = false;
    loadMore ? filteredItems.value.push(...newItems) : (filteredItems.value = newItems);
    loadingMore.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleScroll = (event) => {
  if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 5 && !loadingMore.value && hasMoreItems.value) {
    page.value += 1;
    loadingMore.value = true;
    fetchItems(true);
  }
};

const labelFormatter = (item) => {
  return item[props.itemLabel] ?? "Unknown";
};

const onInput = () => {
  props.searchModel.search = searchQuery.value;
  fetchItems();
};

const handleKeyDown = (event) => {
  if (event.key === "ArrowDown" && selectedIndex.value < filteredItems.value.length - 1) selectedIndex.value += 1;
  if (event.key === "ArrowUp" && selectedIndex.value > 0) selectedIndex.value -= 1;
  if (event.key === "Enter" && selectedIndex.value >= 0) toggleSelectItem(filteredItems.value[selectedIndex.value]);
};

const toggleSelectItem = (item) => {
  const index = selectedItems.value.findIndex((selected) => selected[props.itemId] === item[props.itemId]);
  index >= 0 ? selectedItems.value.splice(index, 1) : selectedItems.value.push(item);
  emit("items-selected", selectedItems.value);
};

const isSelected = (item) => selectedItems.value.some((selected) => selected[props.itemId] === item[props.itemId]);

const removeSelectedItem = (index) => {
  selectedItems.value.splice(index, 1);
  emit("items-selected", selectedItems.value);
};

onMounted(() => {
  selectedItems.value = props.defaultValue || [];
});
</script>
