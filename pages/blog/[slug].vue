<script setup lang="ts">
import type { Article } from 'schema-dts'

import '~/assets/css/blog.css'
import 'medium-zoom/dist/style.css'

import tocbot from 'tocbot'
import mediumZoom from 'medium-zoom'

const { params, fullPath } = useRoute()
const { $client } = useNuxtApp()
const { public: runtimeConfig } = useRuntimeConfig()
const toast = useToast()

const markdownRef = ref<any>()
const isTocRendered = ref(false)

const { data, error, status } = await $client.blog.read.useQuery(params.slug.toString())

useAsyncData(`set-head-${params.slug.toString()}`, async () => {
  useServerSeoMeta({
    robots: 'index, follow'
  })

  if (error.value?.data) {
    throw showError({
      statusCode: error.value.data.httpStatus,
      message: error.value.message
    })
  }

  if (data.value) {
    defineArticle({
      headline: data.value.title,
      description: data.value.description,
      datePublished: data.value.createdAt,
      dateModified: data.value.updatedAt,
      author: {
        name: 'Ambrizal Suryadinata',
        url: 'https://ambrizal.net'
      },
      image: runtimeConfig.assetUrl + '/cover/' + data.value.cover,
    } as Article)

    useSeoMeta({
      title: data.value.title,
      ogTitle: data.value.title,
      description: data.value.description,
      ogDescription: data.value.description,
      ogType: 'article',
      ogUrl: runtimeConfig.appUrl + fullPath,
      ogImage: runtimeConfig.assetUrl + '/cover/' + data.value.cover,
      ogImageType: 'image/jpeg',
      articlePublishedTime: data.value.createdAt,
      articleAuthor: ["https://www.facebook.com/ambrizalsuryadinatasb"],
      publisher: "https://www.facebook.com/ambrizalsuryadinata",
    })

    useHead({
      link: [
        {
          rel: "canonical",
          href: runtimeConfig.appUrl + fullPath,
        },
      ],
    })    
  }  
})

// const { data, status } = useAsyncData(async () => {
//   const blog = await $client.blog.read.query(params.slug.toString())

//   return blog
// })

onMounted(() => {
  setTimeout(() => {
    tocbot.init({
    tocSelector: '#toc-blog',
    contentSelector: '#blog-content',
    headingSelector: "h1, h2, h3",
    hasInnerContainers: true
  })
  }, 100)
})

function renderToc() {
  if (isTocRendered.value === false) {
    setTimeout(() => {
      tocbot.init({
        tocSelector: '#toc-blog',
        contentSelector: '#blog-content',
        headingSelector: "h1, h2, h3",
        hasInnerContainers: true
      })
    }, 100)  
    isTocRendered.value = true    
  }
}

onMounted(() => {
  renderToc()
  mediumZoom('[data-zoomable]')
})

function copyCurrentUrlToClipboard(): void {
  const tempInput = document.createElement('input'); // Create a temporary input element
  tempInput.value = runtimeConfig.appUrl + fullPath; // Set the value of the input to the current URL
  document.body.appendChild(tempInput); // Append the input to the document body
  tempInput.select(); // Select the input's value
  document.execCommand('copy'); // Execute the copy command
  document.body.removeChild(tempInput); // Remove the temporary input from the document

  toast.add({
    title: 'Link telah di salin !',
    description: 'Tempelkan atau paste link yang telah disalin ke tempat yang anda inginkan !',
  })
}

watch(status, (value) => {
  if (value === 'success') {
    renderToc()
  }
})
</script>

<template>
  <div itemscope itemtype="https://schema.org/Article">
    <div class="w-full bg-gray-600 h-56 md:h-72 overflow-hidden">
      <NuxtImg itemprop="image" class="object-cover object-center w-full h-auto md:h-[388px]" :src="`/cover/${data?.cover}`" />
    </div>
    <div class="py-4 px-8 border-b">
      <p>{{ data?.createdAt }}</p>
      <h1 class="text-4xl mb-2">{{ data?.title }}</h1>
      <p class="text-gray-600 dark:text-gray-300" itemprop="abstract">{{ data?.description }}</p>
    </div>
    <div class="flex md:flex-row flex-col gap-2">
      <div class="w-full md:w-9/12 md:order-1 order-2">
        <div v-if="status === 'success'" class="py-4 px-8 blog" itemprop="articleBody">
          <Markdown :ref="markdownRef" :source="data!.content!" class="text-justify" />
        </div>
      </div>
      <div class="flex-1 md:order-2 order-1 pr-2">
        <div class="flex flex-col my-2 gap-1 py-4 px-8 md:px-0">
          <div class="py-2 font-semibold">Share On</div>
          <NuxtLink :href="`https://www.facebook.com/sharer/sharer.php?u=${runtimeConfig.appUrl + fullPath}`">
            <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-mdi-facebook-box" dynamic class="text-lg"/> Facebook</div>
          </NuxtLink>
          <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2 cursor-pointer" @click="copyCurrentUrlToClipboard()"><UIcon name="i-heroicons-link-16-solid" dynamic class="text-lg"/> Copy Link</div>
        </div>

        <div class="py-4 px-8 md:px-0 sticky top-0">
          <div id="toc-blog"></div>
        </div>
      </div>
    </div>
    <div v-if="data" class="py-4 px-8">
      <DisqusComments :url="`https://ambrizal.net/blog/read/${data.slug}`" />
    </div>
  </div>
</template>
