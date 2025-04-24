<template>
  <UModal
    v-model="isOpen"
    :ui="{ width: maxWidthClass }"
    :prevent-close="false"
    :fullscreen="maxWidthClass == 'fullscreen'"
    @close="close"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between bg-black p-4 border-b rounded-t">
      <h3 class="text-lg font-semibold text-white">
        {{ title }}
      </h3>
      <UButton
        color="red"
        variant="ghost"
        icon="heroicons:x-mark-20-solid"
        class="font-bold"
        @click="close"
      />
    </div>

    <!-- Modal Content -->
    <div class="p-0">
      <slot />
    </div>

    <!-- Modal Footer -->
    <template #footer>
      <div class="p-4 flex justify-end bg-gray-100 rounded-b-lg">
        <UButton
          v-if="closeable"
          color="gray"
          icon="heroicons:x-mark-20-solid"
          @click="close"
        >
          Close
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
  maxWidth: {
    type: String,
    default: "2xl",
  },
  title: {
    type: String,
    default: "Modal",
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close", "update:show"]);
const isOpen = ref(props.show);

watch(
  () => props.show,
  (val) => {
    isOpen.value = val;
  },
  { immediate: true }
);

const close = () => {
  if (props.closeable) {
    isOpen.value = false;
    emit("close");
    emit("update:show", false); // Update parent state
  }
};

const maxWidthClass = computed(() => ({
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "4xl": "sm:max-w-4xl",
  "6xl": "sm:max-w-6xl",
  "8xl": "sm:max-w-8xl",
  fullscreen: 'fullscreen',
}[props.maxWidth] || "sm:max-w-md"));
</script>
