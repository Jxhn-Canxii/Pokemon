<template>
  <div class="flex items-center w-screen justify-center h-screen bg-gray-200 text-gray-800">
    <div class="text-center p-8 bg-yellow-100 rounded-lg shadow-lg">
      <h1 class="text-6xl font-bold mb-4 animate-pulse">404 - Warehouse Mishap!</h1>
      <p class="text-2xl mb-4">Oops! Looks like we misplaced this page in the inventory.</p>
      <div class="mb-4">
        <img 
          src="https://media.giphy.com/media/26FPtwDhszNxlwP4U/giphy.gif" 
          alt="Funny Warehouse GIF" 
          class="mx-auto w-64 h-auto"
        />
      </div>
      <p class="text-lg mb-4">Don’t worry, our team of expert warehouse workers is on it!</p>
      <router-link 
        to="/transactions" 
        class="text-lg underline mt-4 hover:text-yellow-600 transition-colors"
      >
        Click here to get back to the dashboard and avoid more warehouse mishaps
      </router-link>
      <p class="text-sm mt-6 text-gray-600">Or just hit the back button and pretend nothing happened.</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional scoped styles here */
</style>
