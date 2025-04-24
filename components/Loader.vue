<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-500 backdrop-blur">
    <!-- Loading Progress Bar -->
    <UProgress animation="carousel" color="emerald" class="w-full max-w-md" />

    <!-- Loading Message -->
    <p class="mt-4 text-lg font-medium text-gray-700 animate-fade-in">
      {{ loadingMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loadingMessages = [
  "Loading records...",
];

const loadingMessage = ref(loadingMessages[0]);

// Update message at random intervals
const updateLoadingMessage = () => {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  loadingMessage.value = loadingMessages[randomIndex];
};

// Set random message on mount
onMounted(updateLoadingMessage);
</script>
