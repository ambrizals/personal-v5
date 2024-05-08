<!-- For login to admin access module -->
<script setup lang="ts">
definePageMeta({
  layout: 'dap-full-width',
  middleware: 'login-admin',
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>