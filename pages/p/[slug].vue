<script setup lang="ts">
import '~/assets/css/blog.css'
import 'medium-zoom/dist/style.css'

import tocbot from 'tocbot'
import mediumZoom from 'medium-zoom'

const { $client } = useNuxtApp()
const { public: runtimeConfig } = useRuntimeConfig()
const { params, fullPath } = useRoute()
const { data, error, status } = await $client.page.entry.useQuery(params.slug.toString())
const isTocRendered = ref(false)

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

  // defineOgImageComponent('NuxtSeo', {
  //   title: data.value?.title,
  //   description: data.value?.description,
  //   theme: '#808080',
  //   siteName: 'Ambrizal Personal Site',
  //   siteLogo: runtimeConfig.appUrl + '/_nuxt/assets/image/logo-light.png',
  // })      

  useHead({
    link: [
      {
        rel: "canonical",
        href: runtimeConfig.appUrl + fullPath,
      },
    ],
  })   
})

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

watch(status, (value) => {
  if (value === 'success') {
    renderToc()
  }
})
</script>

<template>
  <div class="px-8 py-4">
    <div class="flex flex-col border-b py-4">
      <h1 class="text-3xl font-semibold">{{ data?.title }}</h1>
      <p v-if="data?.description && data?.description.length > 0">{{ data.description }}</p>
    </div>
    <div class="flex md:flex-row flex-col gap-4 justify-between py-4">
      <div class="md:order-1 order-2 w-full md:w-9/12 blog" id="page-content">
        <Markdown :source="data?.content" />
      </div>
      <div class="md:order-2 order-1 w-full md:w-3/12">
        <ClientOnly>
          <Adsbygoogle
            ad-slot="6710381184"
            ad-format="auto"
            data-full-width-responsive="true"
            style="display: block;"
          />
        </ClientOnly>
        <div class="h-4" />
        <div class="md:py-4 md:px-8 px-0 sticky top-0">
          <div id="toc-blog"></div>
        </div>        
      </div>
    </div>
  </div>
</template>