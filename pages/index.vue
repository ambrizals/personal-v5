<script setup lang="ts">
const { $client } = useNuxtApp()

const { public: runtimeConfig } = useRuntimeConfig()
const { data: blogs } = await $client.blog.article.useQuery({ page: 1, perPage: 2 })

useSeoMeta({
  title: 'Beranda',
  description:
  "Situs ini adalah situs pribadi milik Ambrizal Suryadinata yang memuat konten mengenai teknologi ataupun pengalaman menarik.",
  ogDescription:
  "Situs ini adalah situs pribadi milik Ambrizal Suryadinata yang memuat konten mengenai teknologi ataupun pengalaman menarik.",
  ogUrl: runtimeConfig.appUrl,
})

useSchemaOrg([
  defineWebPage({
    name: 'Beranda',
    abstract: 'Halaman beranda personal web ambrizal'
  })
])

defineOgImageComponent('OgDefault', {
  title: 'Hello',
  description: 'Selamat datang di personal web ambrizal',
  siteLogo: 'https://cbs.ambrizal.net/assets/Logo_Apps_White.png',
})


useHead({
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
    <div class="flex md:flex-row flex-col">
      <div class="w-full md:w-9/12 px-4">
        <CompTitle label="My Project" to="/p/project" />

        <div class="h-2" />

        <div class="bg-gray-50 dark:bg-gray-800 border-gray-400 border rounded-md p-8 flex justify-center flex-col items-center">
          <UIcon name="i-heroicons-information-circle" class="text-[4rem]" />
          <div class="text-xl text-center">Untuk sementara list project belum tersedia, silakan mampir ke github saya terlebih dahulu karena masih dipersiapkan listnya.</div>
        </div>
        <div class="h-4" />
      </div>
      <div class="w-full md:w-3/12 px-4 md:pr-4 flex flex-col gap-2">
        <CompTitle label="Quick Links" />
        <UButton block color="black" variant="outline" :trailing="false" icon="i-heroicons-link-solid" to="https://gist.github.com/ambrizals">
          My Github Snippet
        </UButton>
        <UButton block color="black" variant="outline" :trailing="false" icon="i-heroicons-document-check-16-solid">
          My Curriculum Vitae
        </UButton>
        <UButton block color="black" variant="outline" :trailing="false" icon="i-heroicons-link-solid" to="https://glints.com/id/profile/public/9031f1f5-ec3a-4902-a791-6ae38a7cd4f5">
          My Glints Account
        </UButton>
        <UButton block color="black" variant="outline" :trailing="false" icon="i-heroicons-envelope" to="mailto:pc@ambrizal.net">
          Send Me An Email
        </UButton>
      </div>
    </div>
  </div>
</template>
