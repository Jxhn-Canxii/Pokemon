<template>
    <div>
      <input ref="dateRangeInput" v-model="dateTimeRange" class="mt-1 p-2 border rounded-md w-full flatpickr" />
    </div>
  </template>
  
  <script setup>
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.min.css';
  import { ref, onMounted, defineEmits } from 'vue';
  
  // Define emits to allow the component to emit the selected date
  const emits = defineEmits(['dateSelected']);
  
  // Create a ref for the date input element
  const dateRangeInput = ref(null);
  const dateTimeRange = ref(null); // Binding for v-model
  
  // Initialize Flatpickr when the component is mounted
  const initFlatpickr = () => {
    flatpickr(dateRangeInput.value, {
      mode: 'single', // Single date selection
      altInput: true,
      enableTime: true, // Enable time picker
      altFormat: 'F j, Y h:i:s', // Display the date in a readable format
      dateFormat: 'Y-m-d h:i:s', // Store the date in this format
      defaultDate: new Date(),
      onChange(selectedDates, dateStr) {
        console.log(dateStr); // Log the selected date (for debugging)
        emits('dateSelected', dateStr); // Emit the selected date to the parent
      },
    });
  };
  
  // Call initFlatpickr when the component is mounted
  onMounted(() => {
    initFlatpickr();
  });
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  