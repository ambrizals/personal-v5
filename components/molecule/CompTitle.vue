<script setup lang="ts">
const props = defineProps<{
  label: string
  to?: string
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <h2 class="text-xl font-semibold">{{ props.label }}</h2>
    <NuxtLink v-if="props.to" :to="props.to" class="leading-[0]">
      <UIcon name="i-heroicons-arrow-right" class="text-lg" />
    </NuxtLink>
  </div>
</template>