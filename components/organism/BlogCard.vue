<script setup lang="ts">
import type { ArticleOutputAPI } from '~/server/trpc/trpc';

defineProps<{
  blog: ArticleOutputAPI['article'][0],
  override?: {
    to?: string
  }
}>()
</script>

<template>
  <UCard
    class="flex-1"
  >
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex items-center md:items-start gap-4">
      <div class="bg-gray-700 w-16 h-16 md:w-32 md:h-32">
        <NuxtImg class="object-cover h-16 md:h-32" provider="localEnhance" :src="`cover/${blog.thumbnail}`" />
      </div>
      <div class="block md:hidden">
        <div class="text-xs">{{ blog.createdAt }}</div>
        <NuxtLink :to="override?.to ? override?.to : `/blog/${blog.slug}`">
          <h2 class="text-xl font-bold">{{ blog.title }}</h2>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col flex-1">
      <div class="text-sm hidden md:block">{{ blog.createdAt }}</div>
      <NuxtLink :to="override?.to ? override?.to : `/blog/${blog.slug}`">
        <h2 class="text-2xl hidden md:block font-bold">
          {{ blog.title }}
        </h2>
      </NuxtLink>
      <div v-if="blog.published === false" class="flex gap-2">
        <UBadge v-if="blog.published === false" color="red" class="self-start">
          Belum Dipublikasi
        </UBadge>
        <UButton size="2xs">Lanjutkan Tulisan</UButton>
      </div>
      <p class="text-justify">
        {{ blog.description }}
      </p>
    </div>
    </div>
  </UCard>
</template>