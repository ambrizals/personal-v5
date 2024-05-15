<script setup lang="ts">
import type { ArticleOutputAPI } from '~/server/trpc/trpc';

const { $client } = useNuxtApp()

const { public: runtimeConfig } = useRuntimeConfig()

// const blogs = useState<ArticleOutputAPI>('blogs')

// useAsyncData(async () => {
//   if (import.meta.server) {
//     blogs.value = await $client.blog.article.query({ page: 1, perPage: 2 })
//   }
// })

const { data: blogs } = await $client.blog.article.useQuery({ page: 1, perPage: 2 })


useHead({
  title: 'Beranda',
  meta: [
    {
      hid: "description",
      name: "description",
      content:
        "Situs ini adalah situs pribadi milik Ambrizal Suryadinata yang memuat konten mengenai teknologi ataupun pengalaman menarik.",
    },
    {
      hid: "og:title",
      name: "og:title",
      property: "og:title",
      content: "Beranda",
    },
    {
      hid: "og:description",
      name: "og:description",
      property: "og:description",
      content:
        "Situs ini adalah situs pribadi milik Ambrizal Suryadinata yang memuat konten mengenai teknologi ataupun pengalaman menarik.",
    },
    {
      hid: "og:url",
      name: "og:url",
      property: "og:url",
      content: runtimeConfig.appUrl,
    },
  ],
  link: [
    {
      rel: "canonical",
      href: runtimeConfig.appUrl,
    },
  ],
})
</script>

<template>
  <div>
    <div class="h-52 md:h-72 w-full bg-gray-900 relative overflow-hidden">
      <img src="~/assets/image/home.jpg" class="object-cover object-center w-full h-full" />
      <div class="absolute bottom-0 px-4 py-8 w-full text-white text-center">
        <h1 class="text-4xl">Ambrizal Suryadinata</h1>
        <p>
          Software Engineer
        </p>
      </div>
    </div>
    <div class="h-4" />
    <div class="px-4">
      <!-- <div v-if="pending">
        Loading...
      </div> -->
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
