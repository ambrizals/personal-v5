<script setup lang="ts">
import { env } from '~/env';
const { $client } = useNuxtApp()

const { data: blogs, status } = await $client.blog.article.useQuery({ page: 1, perPage: 2 })

</script>

<template>
  <div>
    <div class="h-72 w-full bg-gray-900 relative">
      <div class="absolute bottom-0 px-4 py-8 w-full md:w-6/12 text-white">
        <h1 class="text-4xl">Ambrizal Suryadinata</h1>
        <p>
          Software Engineer
        </p>
      </div>
    </div>
    <div class="h-4" />
    <div v-if="status === 'success'" class="px-4">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <BlogCard
          v-for="blog in blogs?.article"
          :key="blog.id"
          :blog="blog"
        >
        </BlogCard>
      </div>
      <div class="flex justify-center pt-4">
        <UButton to="/blog" variant="outline" color="gray" trailing icon="i-heroicons-arrow-right">
          Lihat Semua Postingan
        </UButton>
      </div>
    </div>
    <div class="h-4" />
    <UDivider class="h-4" />
    <div class="flex">
      <div class="w-9/12 px-4">
        <CompTitle label="My Project" to="/project" />

        <div class="h-2" />

        <UCard v-for="item in 4" :key="item" class="mb-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold">Ea aliqua ut nostrud laboris ea voluptate eu mollit.</h3>
              <p>Mollit anim reprehenderit cupidatat sint mollit incididunt duis commodo incididunt labore fugiat Lorem laboris qui.</p>
            </div>
            <div class="bg-gray-900 w-16 h-16"></div>
          </div>
        </UCard>
      </div>
      <div class="w-3/12 pr-4 flex flex-col gap-2">
        <CompTitle label="Quick Links" />
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-link-solid">
          My Github Snippet
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-document-check-16-solid

">
          My Curriculum Vitae
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-link-solid">
          My Glints Account
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-envelope">
          Send Me An Email
        </UButton>
      </div>
    </div>
  </div>
</template>
