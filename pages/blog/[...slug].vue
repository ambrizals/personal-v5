<script setup lang="ts">
const { params } = useRoute()
const { $client } = useNuxtApp()

const { data, pending } = await $client.blog.read.useQuery(params.slug.toString())
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
    <div class="py-4 px-8">
      <h2 class="text-4xl my-4 font-bold">Testing Heading 1</h2>
      <p class="leading-5 mb-2">Elit pariatur duis enim culpa sunt labore magna ad. Quis officia non in laborum culpa est culpa ad velit ut anim commodo. Ipsum proident aute labore tempor nulla cupidatat anim reprehenderit reprehenderit dolore. Minim quis aliqua commodo id cillum cillum deserunt minim eu consectetur nisi ut. Laboris consequat elit dolore aliquip laboris excepteur commodo consequat id id in labore tempor. Irure consequat sunt officia consequat fugiat eu consequat velit dolor enim excepteur proident.</p>
      <h2 class="text-4xl mb-4 font-semibold">Testing Heading 2</h2>
      <p class="leading-5 mb-2">Elit pariatur duis enim culpa sunt labore magna ad. Quis officia non in laborum culpa est culpa ad velit ut anim commodo. Ipsum proident aute labore tempor nulla cupidatat anim reprehenderit reprehenderit dolore. Minim quis aliqua commodo id cillum cillum deserunt minim eu consectetur nisi ut. Laboris consequat elit dolore aliquip laboris excepteur commodo consequat id id in labore tempor. Irure consequat sunt officia consequat fugiat eu consequat velit dolor enim excepteur proident.</p>
      <h3 class="text-3xl mb-4">Testing Heading 3</h3>
      <p class="leading-5 mb-2">Elit pariatur duis enim culpa sunt labore magna ad. Quis officia non in laborum culpa est culpa ad velit ut anim commodo. Ipsum proident aute labore tempor nulla cupidatat anim reprehenderit reprehenderit dolore. Minim quis aliqua commodo id cillum cillum deserunt minim eu consectetur nisi ut. Laboris consequat elit dolore aliquip laboris excepteur commodo consequat id id in labore tempor. Irure consequat sunt officia consequat fugiat eu consequat velit dolor enim excepteur proident.</p>
      <h3 class="text-2xl mb-2">Testing Heading 4</h3>
      <p class="leading-5 mb-2">Elit pariatur duis enim culpa sunt labore magna ad. Quis officia non in laborum culpa est culpa ad velit ut anim commodo. Ipsum proident aute labore tempor nulla cupidatat anim reprehenderit reprehenderit dolore. Minim quis aliqua commodo id cillum cillum deserunt minim eu consectetur nisi ut. Laboris consequat elit dolore aliquip laboris excepteur commodo consequat id id in labore tempor. Irure consequat sunt officia consequat fugiat eu consequat velit dolor enim excepteur proident.</p>
    </div>
  </div>
</template>
