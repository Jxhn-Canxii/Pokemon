<template>
    <div class="flex justify-center w-full h-full">
      <!-- Thumbnail Image -->
      <!-- Modal for Gallery -->
      <div
        class="flex w-full bg-opacity-75 flex items-center justify-center"
      >
        <div class="relative w-full h-full flex flex-col max-w-screen-md max-h-screen overflow-auto">
          <!-- Close Button -->
          <!-- <button
            @click.prevent="closeGallery"
            class="absolute top-4 right-4 p-2 text-white font-bold bg-red-700 rounded-full z-10"
            title="Close Gallery"
          >
            <font-awesome :icon="faTimes" class="dark:text-widia-lime" />
          </button> -->
          
          <!-- Selected Image (Main Large Image) -->
          <div class="selected-image-container p-2 flex justify-center mb-4">
            <img
              v-if="images?.length > 0"
              :src="images[currentIndex]"
              alt="Selected Image"
              class="w-full max-w-full h-auto object-contain rounded-lg"
            />
            <img v-else :src="defaultImage" alt="Default Selected Image" />
          </div>
    
          <!-- Gallery Thumbnails (Smaller Images) -->
          <div
            class="absolute bottom-0 w-full bg-gray-800 p-2 flex overflow-x-auto space-x-2"
          >
            <div
              v-if="props.images?.length > 0"
              v-for="(img, index) in props.images"
              :key="index"
              class="relative hover:scale-110"
            >
              <!-- Thumbnail Image -->
              <img
                :src="img"
                class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform transform"
                @click="currentIndex = index"
                alt="Gallery Image"
              />
            </div>
            
            <!-- Default Thumbnail Image (If no images) -->
            <div v-else class="relative hover:scale-110">
              <img
                :src="defaultImage"
                class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform transform"
                @click="openGallery"
                alt="Default Thumbnail Image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
  import { ref, defineProps, onMounted } from 'vue';
  
  const defaultImage = '/images/careers/main.jpg'; // Default image URL
  const props = defineProps({
    images: {
      type: Array,
      required: true,
    },
  });
  const showGallery = ref(false);
  const currentIndex = ref(0);
  const thumbnailSrc = ref(defaultImage); // Default thumbnail
  
  // Open gallery and set the first image if there are images
  const openGallery = () => {
    showGallery.value = true;
    currentIndex.value = 0; // Show the first image initially
  };
  
  // Close gallery modal
  const closeGallery = () => {
    showGallery.value = false;
  };
  
  // Show thumbnail based on the passed prop
  const showThumbNail = () => {
    thumbnailSrc.value = props.images?.length > 0 ? props.images[0].image : defaultImage;
  };
  
  // Initialize thumbnail when component is mounted
  onMounted(() => {
    showThumbNail();
  });
  </script>
  
  <style scoped>
  /* Full-screen modal styling */
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Make the modal content responsive */
  .relative {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    max-height: 90vh; /* Adjust to ensure modal content doesn't overflow */
    overflow-y: auto; /* Allow scrolling if content exceeds the max height */
  }
  
  /* Ensure the modal content doesn't overflow horizontally */
  .flex-grow {
    flex-grow: 1;
    overflow: hidden;
  }
  
  /* Ensure the gallery thumbnails are properly styled */
  .bg-gray-800 {
    background-color: #2d2d2d;
  }
  
  /* Center the selected image */
  .selected-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem; /* Space between image and thumbnails */
  }
  
  /* Responsive image class */
  .selected-image-container img {
    max-width: 100%;
    max-height: 80vh; /* Ensure the image doesn't exceed 80% of viewport height */
    object-fit: contain; /* Maintain aspect ratio */
    display: block;
    margin: 0 auto; /* Center image horizontally */
  }
  
  /* Styling for the gallery thumbnails below */
  .mt-4 {
    margin-top: 1rem;
  }
  
  .overflow-x-auto {
    overflow-x: auto;
  }
  
  /* Thumbnail style */
  .w-24 {
    width: 6rem;
  }
  
  .h-24 {
    height: 6rem;
  }
  
  /* Ensure thumbnail images are responsive */
  .object-cover {
    object-fit: cover;
  }
  
  /* Thumbnail hover effect */
  .relative:hover {
    transform: scale(1.1);
  }
  </style>
  