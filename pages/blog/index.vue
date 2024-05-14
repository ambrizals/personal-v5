<script setup lang="ts">
const { $client } = useNuxtApp()
const { query } = useRoute()
const { replace } = useRouter()

const page = useState('page', () => Number(query.page?.toString() ?? '1'))

const { data, status } = await $client.blog.article.useQuery({ page: Number(query.page?.toString() ?? '1'), perPage: 10 })
const { data: comments, status: commentStatus } = await $client.blog.comments.useQuery()

watch(page, (value) => {
  replace({ query: {
    page: value
  } })
  $client.blog.article.useQuery({ page: value, perPage: 10 }).then(res => {
    data.value = res.data.value
  })
})

</script>

<template>
  <div class="flex md:flex-row flex-col gap-2">
    <div class="w-full md:w-9/12 px-8 py-4">
      <div id="search">
        <UInput placeholder="Silakan masukan keyword judul yang ingin dicari..." />
      </div>

      <div v-if="data?.article.length === 0" class="bg-gray-200 border-gray-400 dark:bg-gray-800 dark:border-gray-600 border p-4 rounded-md my-4">
        <div class="text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-[120px] my-12 text-red-500" />
        </div>
        <div class="text-center text-lg">Artikel yang anda cari tidak ada atau tidak ketemu atau memang sudah habis, coba melakukan pencarian menggunakan keyword yang lain atau kembali ke halaman sebelumnya</div>
      </div>
      <BlogCard v-for="blog in data?.article" :key="blog.id" :blog="blog" class="my-4" />

      <div class="flex justify-center">
        <UPagination v-if="status === 'success'" v-model="page" :page-count="data?.pagination.per_page" :total="data?.pagination.total_item" show-last show-first />
      </div>
    </div>
    <div class="md:w-3/12 py-4 mr-8">
      <div class="bg-gray-300 h-64">
        IKLAN DISINI
      </div>
      <div class="h-2" />
      <div class="sticky top-1">
        <CompTitle label="Komentar Terakhir" />
        <div class="border rounded-md">
          <div class="px-4 py-2 border-b" v-for="comment in comments" :key="comment.id">
            <div class="font-semibold">{{ comment.name }}</div>
            <div>{{ comment.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>