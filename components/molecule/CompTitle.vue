<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  to?: string
  size?: 'base' | 'lg'
}>(), {
  size: 'lg'
})
</script>

<template>
  <div class="flex items-center gap-2">
    <h2 :class="['font-semibold',  props.size === 'lg' ? 'text-xl' : 'text-base']">{{ props.label }}</h2>
    <NuxtLink v-if="props.to" :to="props.to" class="leading-[0]">
      <UIcon name="i-heroicons-arrow-right" class="text-lg" />
    </NuxtLink>
  </div>
</template>