
<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { ExposeParam } from 'md-editor-v3';
import type { BlogReadOutputAPI } from '~/server/trpc/trpc';

const headers = useRequestHeaders();

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
const fileInput = ref<HTMLInputElement | null>(null);
const content = ref('')
const title = ref('')
const description = ref('')
const isPublished = ref(false)
const editorRef = ref<ExposeParam>();
const fileCover = ref<File | null>(null)
const filePreview = ref<string | null>(null)

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
      content: content.value,
    }).then(res => res ? toast.add({
      title: 'Sukses diperbarui',
      description: 'Artikel telah berhasil di perbarui'
    }) : '')
  } else {
    const formData = new FormData()
    formData.set('title', title.value)
    formData.set('content', content.value)
    formData.set('description', description.value)
    formData.set('isPublished', isPublished.value.toString())
    if (fileCover.value) {
      formData.set('cover', fileCover.value)
    }    


    $fetch('/api/admin/article', {
      body: formData,
      method: 'POST',
      headers
    }).then(res => {
      if (res) {
        articleEntry.value = res
        toast.add({
          title: 'Artikel berhasil dibuat',
          description: 'Artikel telah berhasil tersimpan di database.'
        })
        router.replace({ params: {
          slug: res.slug
        } })      
      }
    })
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
};

function onDragLeave(event: DragEvent) {
  event.preventDefault();
};

function validateFile(file: File) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
  return validTypes.includes(file.type);
};

function onDrop(event: DragEvent) {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    const droppedFile = droppedFiles[0];
    if (validateFile(droppedFile)) {
      previewImage(droppedFile)
      fileCover.value = droppedFile;
    } else {
      toast.add({
        color: 'red',
        title: 'Error validation',
        description: 'Hanya menerima file gambar'
      })
    }
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    const selectedFile = selectedFiles[0];
    if (validateFile(selectedFile)) {
      previewImage(selectedFile)
      fileCover.value = selectedFile;
    } else {
      toast.add({
        color: 'red',
        title: 'Error validation',
        description: 'Hanya menerima file gambar'
      })
    }
  }
};

function onDragClick() {
  fileInput.value?.click();
};

function previewImage(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    filePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};
</script>

<template>
  <div class="h-screen flex flex-col gap-2 px-4 py-2">
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      class="hidden"
      accept="image/*"
    />
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
        <UButton block variant="outline" :to="`/blog/${articleEntry?.slug}`" target="_blank">Preview Article</UButton>
        <div class="h-2" />
        <UButton icon="i-heroicons-trash" block color="red" variant="outline">Delete Article</UButton>

        <div class="h-4" />

        <div class="relative group">
          <div v-if="articleEntry?.thumbnail && filePreview === null" class="relative"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="onDragClick()"          
          >
            <PrompDragDrop
              @click="onDragClick()"
              class="absolute top-0 h-full bg-opacity-90 group-hover:block hidden"
            />   
            <NuxtImg class="w-full rounded-md" provider="localEnhance" :src="`cover/${articleEntry?.thumbnail}`" />
          </div>
          <!-- <div v-if="articleEntry?.thumbnail" class="rounded-md bg-gray-500 flex-col justify-center items-center text-center p-4 cursor-pointer text-white bg-opacity-80 w-full h-full absolute top-0 group-hover:flex hidden">
            <UIcon name="i-heroicons-cloud-arrow-down-solid" class="text-[48px]" />
            <div>Click or drop an image to change cover</div>
          </div> -->
          <!-- Upload drag & drop -->
          <PrompDragDrop
            v-else-if="(articleEntry?.thumbnail === undefined || articleEntry?.thumbnail === null) && filePreview === null"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="onDragClick()"
          />

          <div v-else-if="filePreview !== null"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"          
            class="rounded-md overflow-hidden group relative"
          >
            <PrompDragDrop
              @click="onDragClick()"
              class="absolute top-0 h-full bg-opacity-90 group-hover:block hidden"
            />            
            <img :src="filePreview" alt="cover" />
          </div>
        </div>

        <div class="h-4" />

        <UCard :ui="{
          body: {
            base: '',
            background: '',
            padding: 'px-4 py-2',
          },          
        }">
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

        <UCard :ui="{
          body: {
            base: '',
            background: '',
            padding: 'px-4 py-2',
          },
        }">
          <template #header>
            <CompTitle label="Deskripsi" size="base" />
          </template>          
          <UTextarea v-model="description" variant="outline" color="primary" size="lg" :rows="7" />
        </UCard>   
      </div>
    </div>
  </div>
</template>