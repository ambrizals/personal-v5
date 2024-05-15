
<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { ExposeParam } from 'md-editor-v3';

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const { params } = useRoute()
const { $client } = useNuxtApp()

const content = ref('')
const title = ref('')
const editorRef = ref<ExposeParam>();

useAsyncData(`editor`, async () => {
  const slug = params.slug.toString()

  if (slug !== 'create') {
    const data = await $client.blog.read.query(params.slug.toString())
    content.value = data.content ?? ''
    title.value = data.title

    if (editorRef.value) {
      editorRef.value.resetHistory()
    }
  }
})
</script>

<template>
  <div class="h-screen flex flex-col gap-2 px-4 py-2">
    <div class="flex gap-2 items-center">
      <UInput v-model="title" class="flex-1" placeholder="Silakan masukkan judul artikel" size="lg" />
      <div class="flex gap-2 w-fit">
        <UButton>Simpan</UButton>
        <UButton color='red'>Reset</UButton>
      </div>
    </div>
    <MdEditor ref="editorRef" class="flex-1" v-model="content" language="en-US" :theme="isDark ? 'dark': 'light'" />
  </div>
</template>