<script setup lang="ts">
import '~/assets/css/blog.css'


const { $client } = useNuxtApp()
const { public: runtimeConfig } = useRuntimeConfig()
const { params, fullPath } = useRoute()
const { data, pending, error } = await $client.page.entry.useQuery(params.slug.toString())

useAsyncData(`page-${params.slug.toString()}`, async () => {
  if (error.value) {
    throw showError({
      statusCode: error.value.data?.httpStatus,
      message: error.value.message,
    })
  }

  useSeoMeta({
    title: data.value?.title,
    description: data.value?.description,
    ogTitle: data.value?.title,
    ogDescription: data.value?.description,
    ogUrl: runtimeConfig.appUrl + fullPath,
  })

  useHead({
    link: [
      {
        rel: "canonical",
        href: runtimeConfig.appUrl + fullPath,
      },
    ],
  })   
})
</script>

<template>
  <div class="px-8 py-4">
    <div class="flex flex-col border-b py-4">
      <h1 class="text-3xl font-semibold">{{ data?.title }}</h1>
      <p v-if="data?.description && data?.description.length > 0">{{ data.description }}</p>
    </div>
    <div class="flex gap-4 justify-between py-4">
      <div class="w-9/12 blog">
        <Markdown :source="data?.content" />
      </div>
      <div class="w-3/12">Konten</div>
    </div>
  </div>
</template>