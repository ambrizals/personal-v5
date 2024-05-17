
<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { ExposeParam } from 'md-editor-v3';
import type { BlogReadOutputAPI } from '~/server/trpc/trpc';

const router = useRouter()
const colorMode = useColorMode();
const toast = useToast()

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

const articleEntry = ref<BlogReadOutputAPI>()
const content = ref('')
const title = ref('')
const description = ref('')
const isPublished = ref(false)
const editorRef = ref<ExposeParam>();

const autoSave = ref(false)

useAsyncData(`editor`, () => onLoad())

async function onLoad() {
  const slug = params.slug.toString()

  if (slug !== 'create') {
    const data = await $client.blog.read.query(params.slug.toString())
    content.value = data.content ?? ''
    title.value = data.title
    description.value = data.description ?? ''
    isPublished.value = data.published

    articleEntry.value = data

    if (editorRef.value) {
      editorRef.value.resetHistory()
    }
  }
}

function save() {
  if (articleEntry.value) {
    $client.blog.update.mutate({
      id: articleEntry.value.id,
      title: title.value,
      description: description.value,
      isPublished: isPublished.value,
    }).then(res => res ? toast.add({
      title: 'Sukses diperbarui',
      description: 'Artikel telah berhasil di perbarui'
    }) : '')
  } else {
    $client.blog.create.mutate({
      title: title.value,
      content: content.value,
      description: description.value,
      isPublished: isPublished.value,
    }).then(res => {
      articleEntry.value = res
      toast.add({
        title: 'Artikel berhasil dibuat',
        description: 'Artikel telah berhasil tersimpan di database.'
      })
      router.replace({ params: {
        slug: res.slug
      } })
    })
  }
}
</script>

<template>
  <div class="h-screen flex flex-col gap-2 px-4 py-2">
    <div class="flex gap-2 items-center">
      <UInput v-model="title" class="flex-1" placeholder="Silakan masukkan judul artikel" size="lg" />
      <div class="flex gap-2 w-fit">
        <UButton @click="save()">Simpan</UButton>
        <UButton color='red'>Reset</UButton>
      </div>
    </div>
    <div class="flex flex-1 h-full">
      <MdEditor
        class="!h-[92%]" ref="editorRef" v-model="content" language="en-US" :theme="isDark ? 'dark': 'light'"
        :on-save="() => save()"
      />
      <div class="w-3/12 px-2">
        <UButton block variant="outline" :to="`/blog/${articleEntry?.slug}`" target="blank">Preview Article</UButton>
        <div class="h-2" />
        <UButton icon="i-heroicons-trash" block color="red" variant="outline">Delete Article</UButton>

        <div class="h-4" />

        <UCard>
          <template #header>
            <CompTitle label="Access Panel" size="base" />
          </template>          
          <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-center">
              <UToggle v-model="autoSave" disabled />
              <div>Auto Save <b v-if="autoSave">Enabled</b> <span v-else>Disabled</span></div>
            </div>
            <div class="flex gap-2 items-center">
              <UToggle v-model="isPublished" />
              <div>Article <b v-if="isPublished">Published</b> <span v-else>Unpublished</span></div>
            </div>
          </div>
        </UCard>

        <div class="h-4" />

        <UCard>
          <template #header>
            <CompTitle label="Deskripsi" size="base" />
          </template>          
          <UTextarea v-model="description" variant="outline" color="primary" size="lg" :rows="7" />
        </UCard>

        <div class="h-4" />

        <UCard :ui="{
          body: {
            base: '',
            background: '',
            padding: ''
          }
        }">
          <template #header>
            <CompTitle label="Cover" size="base" />
          </template>
          <div class="relative group">
            <div class="bg-gray-500 justify-center items-center text-center p-4 cursor-pointer text-white bg-opacity-80 w-full h-full absolute top-0 group-hover:flex hidden">
              Click or drop an image to change cover
            </div>
            <NuxtImg class="w-full" provider="localEnhance" :src="`cover/${articleEntry?.thumbnail}`" />
          </div>
        </UCard>        
      </div>
    </div>
  </div>
</template>