<template>
  <div class="relative w-full">
    <div class="flex items-center">
      <UInput
        :id="inputId"
        :placeholder="placeholder"
        v-model="searchQuery"
        :title="searchQuery"
        @input="onInput"
        @keydown="handleKeyDown"
        autocomplete="off"
        class="w-full"
      />
      <UButton
        icon="i-heroicons-chevron-down"
        color="gray"
        variant="ghost"
        class="absolute right-2"
        @click.prevent="viewItems()"
      />
    </div>

    <div
      v-if="filteredItems.length > 0"
      class="absolute bg-white shadow-lg w-full mt-1 rounded-md border border-gray-200 z-50"
      @scroll="handleScroll"
      style="max-height: 200px; overflow-y: auto;"
    >
      <ul>
        <li
          v-for="(item, index) in filteredItems"
          :key="item[itemId]"
          :class="[
            'px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100',
            { 'bg-gray-200': selectedIndex === index }
          ]"
          @click="selectItem(item)"
          @mouseover="selectedIndex = index"
        >
          {{ labelFormatter(item) }}
        </li>
        <li v-if="loadingMore" class="text-center py-2 text-gray-500">Loading more...</li>
        <li v-if="!loadingMore && !hasMoreItems" class="text-center py-2 text-gray-500">No more items</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from "vue";
import axios from "axios";
import { useDebounce, convertStringToArray, BearToken } from "@/utility/Helper";
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
  defaultValue: String,
  formatLabel: { type: String, default: 'none' }
});

const keyName = ref(convertStringToArray(props.returnName));
const emit = defineEmits(["item-selected"]);

const searchQuery = ref("");
const filteredItems = ref([]);
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

    const response = await axios.post(`${VUE_APP_API_URL}${props.apiEndpoint}`, {
      ...props.searchModel,
      page_num: page.value,
    }, BearToken(token));

    const newItems = props.dataKey && response.data[props.dataKey] ? response.data[props.dataKey] :
      Array.isArray(response.data) ? response.data :
      Object.values(response.data).find(val => Array.isArray(val)) || [];

    hasMoreItems.value = newItems.length > 0;
    loadMore ? filteredItems.value.push(...newItems) : (filteredItems.value = newItems);
    loadingMore.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingMore.value && hasMoreItems.value) {
    page.value += 1;
    loadingMore.value = true;
    fetchItems(true);
  }
};

const labelFormatter = (item) => {
  const key = keyName.value;
  if (key.length > 3) return "Maximum Allowed key is 3 only!";

  const third_value = key?.length >= 2 && item[key[2]]?.length > 0 ? ` (${item[key[2]] ?? ""})` : "";
  switch (props.formatLabel) {
    case "dashed":
      return key?.length > 0 ? `${item[key[0]] ?? ""} - ${item[key[1]] ?? ""} ${third_value}` : item[key[0]] ?? "";
    case "dashed_and_parenthesis":
      return key?.length > 0 ? `${item[key[0]] ?? ""} - ${item[key[1]] ?? ""}${third_value}` : item[key[0]] ?? "";
    case "parenthesis":
      return key?.length == 2 ? `${item[key[0]] ?? ""} (${item[key[1]] ?? ")"}` : item[key[0]] ?? "";
    case "third_parenthesis":
      return key?.length > 0 ? `${item[key[0]] ?? ""} ${item[key[1]] ?? ""}${third_value}` : item[key[0]] ?? "";
    default:
      return key?.length > 0 ? `${item[key[0]] ?? ""} ${item[key[1]] ?? ""} ${item[key[2]] ?? ""}` : item[key[0]] ?? "";
  }
};

const debouncedFetchItems = useDebounce(fetchItems, 500);

const onInput = () => {
  props.searchModel.search = searchQuery.value;
  debouncedFetchItems();
};

const handleKeyDown = (event) => {
  if (event.key === "ArrowDown" && selectedIndex.value < filteredItems.value.length - 1) selectedIndex.value++;
  else if (event.key === "ArrowUp" && selectedIndex.value > 0) selectedIndex.value--;
  else if (event.key === "Enter" && selectedIndex.value >= 0) selectItem(filteredItems.value[selectedIndex.value]);
};

const selectItem = (item) => {
  searchQuery.value = labelFormatter(item);
  filteredItems.value = [];
  selectedIndex.value = -1;
  emit("item-selected", item);
};

onMounted(() => {
  searchQuery.value = props.defaultValue;
});
</script>
