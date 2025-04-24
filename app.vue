<template>
  <ClientOnly>
    <NuxtLayout>
      <UContainer :ui="{ padding: 'px-0 py-0', constrained: 'max-w-screen overflow-hidden' }">
        <NuxtLoadingIndicator />
        <NuxtPage />
      </UContainer>
    </NuxtLayout>
  </ClientOnly>
</template>
