<!-- For admin access -->
<script setup lang="ts">
definePageMeta({
  layout: 'dap-default',
  middleware: 'admin'
})
</script>

<template>
  <NuxtPage />
</template>