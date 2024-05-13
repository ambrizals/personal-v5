<script setup lang="ts">
import '~/assets/blog.css'
import tocbot from 'tocbot'

const { params } = useRoute()
const { $client } = useNuxtApp()

const markdownRef = ref<any>()
const isTocRendered = ref(false)

const { data, status } = await $client.blog.read.useQuery(params.slug.toString())

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
})

watch(status, (value) => {
  if (value === 'success') {
    renderToc()
  }
})
</script>

<template>
  <div>
    <div class="w-full bg-gray-600 h-56 md:h-72 overflow-hidden">
      <NuxtImg class="object-cover object-center w-full h-auto md:h-[388px]" :src="`/cover/${data?.cover}`" />
    </div>
    <div class="py-4 px-8 border-b">
      <p>{{ data?.createdAt }}</p>
      <h1 class="text-4xl mb-2">{{ data?.title }}</h1>
      <p class="text-gray-600 dark:text-gray-300">{{ data?.description }}</p>
    </div>
    <div class="flex md:flex-row flex-col gap-2">
      <div class="w-full md:w-9/12 md:order-1 order-2">
        <div v-if="status === 'success'" class="py-4 px-8 blog">
          <Markdown :ref="markdownRef" :source="data!.content!" class="text-justify" />
        </div>
      </div>
      <div class="flex-1 md:order-2 order-1">
        <div class="flex flex-col my-2 gap-1 py-4 px-8 md:px-0">
          <div class="py-2 font-semibold">Share On</div>
          <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-mdi-facebook-box" dynamic class="text-lg"/> Facebook</div>
          <div class="bg-gray-200 dark:bg-gray-800 px-4 py-2"><UIcon name="i-heroicons-link-16-solid" dynamic class="text-lg"/> Copy Link</div>
        </div>

        <div class="py-4 px-8 md:px-0 sticky top-0">
          <div id="toc-blog"></div>
        </div>
      </div>
    </div>
    <div v-if="data" class="py-4 px-8">
      <DisqusComments :identifier="`/blog/${data.slug}`" />
    </div>
  </div>
</template>
