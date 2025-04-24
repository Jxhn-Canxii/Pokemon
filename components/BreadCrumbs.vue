<template>
  <div class="flex justify-end mt-4">
    <UBreadcrumb :links="breadcrumbLinks" />
  </div>
</template>

<script setup>
const props = defineProps({
  page: {
    type: String,
    required: true
  }
});

const breadcrumbLinks = computed(() => {
  if (props.page === 'Dashboard') {
    return [{ label: 'Dashboard', to: '/admin/dashboard' }];
  }

  return [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: props.page, to: '', active: true }
  ];
});
</script>
