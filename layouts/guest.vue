<template>
  <div class="flex flex-col galaxy-bg">
    
    <main class="flex-grow overflow-x-hidden">
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
