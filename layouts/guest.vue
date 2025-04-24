<template>
  <div class="flex flex-col">
    
    <main class="flex-grow overflow-x-hidden pb-3">
      <slot />
    </main>
    
  </div>
</template>

<script setup>

</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100vw;
  overflow-x: hidden;
}
</style>
