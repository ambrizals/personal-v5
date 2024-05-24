
<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import MarkdownItVideo from 'markdown-it-video'

import { MdEditor, config } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { ExposeParam, UploadImgCallBack } from 'md-editor-v3';
import type { BlogReadOutputAPI } from '~/server/trpc/trpc';
import { z } from 'zod';

const headers = useRequestHeaders();
const { public: runtimeConfig } = useRuntimeConfig()

const router = useRouter()
const colorMode = useColorMode();
const toast = useToast()
const deleteModal = ref(false)
const loadingDelete = ref(false)

config({
  markdownItConfig(md, options) {
    md.use(MarkdownItVideo)
  },
})

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
const isNew = ref(true)

const autoSave = ref(false)

const deleteSchema = z.object({
  title: z.string().refine((value) => value === articleEntry.value?.title, {
    message: 'Confirmation input must same like prompt'
  })
});

type DeleteSchema = z.output<typeof deleteSchema>;

const formDeleteState = reactive<{
  title?: string;
}>({});


useAsyncData(`editor`, () => onLoad())

async function onLoad() {
  const slug = params.slug.toString()

  if (slug !== 'create') {
    isNew.value = false
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
    const formData = new FormData()
    formData.set('title', title.value)
    formData.set('content', content.value)
    formData.set('description', description.value)
    formData.set('isPublished', isPublished.value.toString())
    if (fileCover.value) {
      formData.set('cover', fileCover.value)
    }    

    $fetch(`/api/admin/article/${articleEntry?.value.id}`, {
      method: 'PUT',
      body: formData,
      headers
    }).then(res => {
      if (res) {
        articleEntry.value = res
        toast.add({
          title: 'Artikel berhasil diupdate',
          description: 'Artikel telah berhasil diperbarui, silakan di cek'
        })
        fileCover.value = null
        filePreview.value = null
      }
    })
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

function doDeleteArticle(event: FormSubmitEvent<DeleteSchema>) {
  if (event) {
    if (articleEntry.value) {
      $client.blog.destroy.mutate(articleEntry.value.id).then(res => {
        if (res) {
          router.replace('/dap/blog')
          toast.add({
            title: 'Berhasil dihapus',
            description: 'Artikel telah berhasil di hapus'
          })
        }
      }).finally(() => {
        loadingDelete.value = false
      })
    }
  }
}

function onUploadImg(files: File[], callback: UploadImgCallBack) {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(`file-${index}`, file))
  $fetch('/api/admin/image/posts', {
    method: 'POST',
    body: formData,
    headers
  }).then(res => {
    callback(res)
  })
}
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
      <div class="flex w-[81%] flex-col gap-2">
        <UInput size="xs" :model-value="runtimeConfig.appUrl+'/blog/'+articleEntry?.slug" disabled>
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">Link Artikel</span>
          </template>
        </UInput>
        <MdEditor
          @on-upload-img="onUploadImg"
          class="!h-[87%]" ref="editorRef" v-model="content" language="en-US" :theme="isDark ? 'dark': 'light'"
          :on-save="() => save()"
        />
      </div>
      <div class="flex-1 px-2">
        <UButton v-if="isNew === false" block variant="outline" :to="`/blog/${articleEntry?.slug}`" target="_blank">Preview Article</UButton>
        <div v-if="isNew === false" class="h-2" />
        <UButton v-if="isNew === false" icon="i-heroicons-trash" block color="red" variant="outline" @click="deleteModal = true">Delete Article</UButton>

        <div v-if="isNew === false" class="h-4" />

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
  <UModal v-model="deleteModal">
    <UForm
      :schema="deleteSchema"
      :state="formDeleteState"
      @submit="doDeleteArticle"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', body: {
        padding: ''
      } }">
        <template #header>
          <div>Konfirmasi Hapus</div>
        </template>

        <div class="relative">
          <div v-if="articleEntry?.published === true" class="absolute top-0 z-30 w-full h-full bg-black bg-opacity-70 dark:bg-opacity-85 text-white flex flex-col justify-center items-center gap-4">
            <UIcon name="i-heroicons-hand-raised-20-solid" class="text-[4rem]" />
            <div class="text-center">
              Tidak dapat menghapus artikel yang masih dipublikasikan, silakan ubah artikel tersebut menjadi tidak terpublish.
            </div>
          </div>
          <div class="flex flex-col gap-2 text-justify px-6 py-8">
            <div>Jika anda ingin menghapus artikel ini dengan mengetik <UBadge variant="outline" size="xs" color="red">{{ articleEntry?.title }}</UBadge> pada input dibawah</div>
            <UFormGroup name="title">
              <UInput v-model="formDeleteState.title" placeholder="Silakan ketik disini" />
            </UFormGroup>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton type="submit" color="red" :loading="loadingDelete" :disabled="articleEntry?.published">Konfirmasi</UButton>
            <UButton @click="deleteModal = false">Batal</UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>  
</template>