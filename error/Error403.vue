<template>
  <div class="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
    <UCard class="text-center p-6 max-w-md">
      <h1 class="text-4xl font-bold mb-3 animate-pulse">403 - Access Denied!</h1>
      <p class="text-lg mb-4">Oops! You don’t have permission to access this area.</p>
      <UImage 
        src="https://media.giphy.com/media/3o6ZsUlgVabHNYrF3S/giphy.gif" 
        alt="Access Denied GIF" 
        class="mx-auto w-48 h-auto mb-4"
      />
      <p class="text-sm text-gray-600 mb-4">Looks like this section is off-limits!</p>
      <UButton to="/" color="yellow">Go Back</UButton>
    </UCard>
  </div>
</template>
