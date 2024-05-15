<script setup lang="ts">
const { $client } = useNuxtApp()

const { data, status } = await $client.blog.article.useQuery({ page: 1, perPage: 15, showHidden: true })
const page = useState('page', () => 1)
</script>

<template>
  <div class="w-8/12 m-auto">
    <div class="flex justify-between items-center">
      <div class="font-semibold text-xl">Blog</div>
      <UButton to="/dap/blog/create">Create a new Article</UButton>
    </div>

    <div v-if="status === 'success'">
      <BlogCard v-for="item in data!.article" :key="item.id" :blog="item" class="my-4" :override="{
        to: `/dap/blog/${item.slug}`
      }" />
    </div>
    
    <div class="flex justify-center">
      <UPagination v-model="page" :page-count="data?.pagination.per_page" :total="data?.pagination.total_item" show-last show-first />
    </div>
  </div>
</template>