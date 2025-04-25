<template>
  <div class="p-6 min-h-screen">
    <!-- Stars Background -->
    <div class="stars" ref="starsContainer"></div>

    <!-- Search Section -->
    <div class="max-w-screen mx-auto mb-8">
      <div class="search-container p-4 rounded-lg">
        <div class="flex gap-4 flex-wrap">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search cards..." 
            class="flex-1 p-2 border rounded-md bg-opacity-20 bg-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            @change.prevent="handleSearch"
          />
          <select 
            v-model="selectedAttribute" 
            class="p-2 border rounded-md bg-opacity-20 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            @change.prevent="handleSearch"
          >
            <option value="">All Attributes</option>
            <option value="DARK">DARK</option>
            <option value="LIGHT">LIGHT</option>
            <option value="WATER">WATER</option>
            <option value="FIRE">FIRE</option>
            <option value="WIND">WIND</option>
            <option value="EARTH">EARTH</option>
            <option value="DIVINE">DIVINE</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="max-w-6xl mx-auto">
      <div v-if="loading" class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="card in data" :key="card.id" class="card-container rounded-lg h-[400px]">
          <div class="relative h-full w-full">
            <img 
              :src="card.card_images?.[0]?.image_url" 
              :alt="card.name"
              class="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div class="card-details absolute inset-0 w-full h-full bg-black/85 opacity-0 transition-all duration-300 ease-in-out hover:opacity-100 overflow-y-auto p-4">
              <h3 class="font-bold text-lg mb-3 detail-item text-white" style="animation-delay: 0.1s">{{ card.name }}</h3>
              <div class="text-sm space-y-2 text-white">
                <p class="detail-item" style="animation-delay: 0.2s">
                  <span class="font-semibold">Type:</span> {{ card.type }}
                </p>
                <p v-if="card.attribute" class="detail-item" style="animation-delay: 0.3s">
                  <span class="font-semibold">Attribute:</span> {{ card.attribute }}
                </p>
                <p v-if="card.level" class="detail-item" style="animation-delay: 0.4s">
                  <span class="font-semibold">Level:</span> {{ card.level }}
                </p>
                <p v-if="card.atk !== undefined" class="detail-item" style="animation-delay: 0.5s">
                  <span class="font-semibold">ATK:</span> {{ card.atk }}
                </p>
                <p v-if="card.def !== undefined" class="detail-item" style="animation-delay: 0.6s">
                  <span class="font-semibold">DEF:</span> {{ card.def }}
                </p>
                <p v-if="card.desc" class="detail-item mt-3 text-sm italic" style="animation-delay: 0.7s">
                  {{ card.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="!loading && data.length === 0" class="text-center py-10">
        <p class="text-white text-lg">No cards found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { FormDx, handleApiError } from "@/utility/Helper.js";
import { VUE_APP_API_URL } from "@/utility/Global.js";
import '../assets/css/galaxy.css';

definePageMeta({
  layout: "guest",
});

const data = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedAttribute = ref('');
const starsContainer = ref(null);
const stars = ref([]);

// Create stars
const createStars = () => {
  if (!starsContainer.value) return;
  
  const numberOfStars = 100;
  const container = starsContainer.value;
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 2 + 1;
    
    // Random duration
    const duration = Math.random() * 3 + 2;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--duration', `${duration}s`);
    
    container.appendChild(star);
    stars.value.push(star);
  }
};

// Clean up stars
const cleanupStars = () => {
  stars.value.forEach(star => star.remove());
  stars.value = [];
};

onMounted(() => {
  getList();
  createStars();
});

onUnmounted(() => {
  cleanupStars();
});

const handleSearch = () => {
  getList();
};

const getList = async () => {
  loading.value = true;
  try {
    let url = `${VUE_APP_API_URL}?`;
    
    if (searchQuery.value) {
      url += `fname=${encodeURIComponent(searchQuery.value)}`;
    }
    
    if (selectedAttribute.value) {
      url += `${searchQuery.value ? '&' : ''}attribute=${selectedAttribute.value}`;
    }

    const response = await axios.get(url);
    data.value = response.data.data ?? [];
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch cards. Please try again later.',
    });
  } finally {
    loading.value = false;
  }
};
</script>
