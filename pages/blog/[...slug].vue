<script setup lang="ts">
import '~/assets/blog.css'
const { params } = useRoute()
const { $client } = useNuxtApp()

const { data, status } = await $client.blog.read.useQuery(params.slug.toString())
</script>

<template>
  <div>
    <div class="w-full bg-gray-600 h-56 md:h-72 overflow-hidden">
      <NuxtImg class="object-cover object-center w-full h-auto md:h-[388px]" :src="`/cover/${data?.cover}`" />
    </div>
    <div class="py-4 px-8 border-b">
      <p>{{ data?.createdAt }}</p>
      <h1 class="text-4xl">{{ data?.title }}</h1>
      <div class="flex border dark:border-gray-600 w-fit items-center rounded my-2">
        <div class="px-4 py-2 font-semibold">Share On</div>
        <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-mdi-facebook-box" dynamic class="text-lg"/></div>
        <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-heroicons-envelope" dynamic class="text-lg"/></div>
        <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-heroicons-link-16-solid" dynamic class="text-lg"/></div>
      </div>
    </div>
    <div v-if="status === 'success'" class="py-4 px-8 blog">
      <Markdown :source="data!.content!" />
    </div>
  </div>
</template>
