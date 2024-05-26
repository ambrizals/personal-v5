<script setup lang="ts">
import { MdEditor, config, type UploadImgCallBack } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { PageEntryOutputAPI } from '~/server/trpc/trpc';

const headers = useRequestHeaders();
const { params } = useRoute()
const router = useRouter()
const { $client } = useNuxtApp()
const toast = useToast()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const autoSave = ref(false)
const isNew = ref(true)
const pageEntry = ref<PageEntryOutputAPI>()

useAsyncData(`editor`, () => onLoad())

async function onLoad() {
  const slug = params.slug.toString()

  if (slug !== 'create') {
    const data = await $client.page.entry.query(params.slug.toString())
    if (data) {
      isNew.value = false
      content.value = data.content ?? ''
      title.value = data.title ?? ''
      description.value = data.description ?? ''
      isPublished.value = data.published ?? false
      pageEntry.value = data
    }
  }
}

const content = ref('')
const title = ref('')
const description = ref('')
const isPublished = ref(false)

function save() {
  if (isNew.value === true) {
    $client.page.create.mutate({
      content: content.value,
      isPublished: isPublished.value,
      title: title.value,
      description: description.value,
    }).then(res => {
      if (res) {
        toast.add({
          title: 'Halaman telah dibuat',
          description: 'Halaman telah berhasil dibuat dan anda dapat menggunakannya'
        })
        router.replace(`/dap/page/${res.uuid}`)
      }
    })
  } else {
    if (pageEntry.value && pageEntry.value.id) {
      $client.page.update.mutate({
        id: pageEntry.value.id,
        content: content.value,
        isPublished: isPublished.value,
        title: title.value,
        description: description.value,
      }).then(res => {
        if (res) {
          toast.add({
            title: 'Berhasil Diperbarui',
            description: 'Halaman berhasil diperbarui'
          })
        }
      })
    }
  }
}

function onUploadImg(files: File[], callback: UploadImgCallBack) {
  const formData = new FormData()
  files.forEach((file, index) => formData.append(`file-${index}`, file))
  $fetch('/api/admin/image/pages', {
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
    <div class="flex gap-2 items-center">
      <UInput v-model="title" class="flex-1" placeholder="Silakan masukkan judul halaman" size="lg" />
      <div class="flex gap-2 w-fit">
        <UButton @click="save()">Simpan</UButton>
        <UButton color='red'>Reset</UButton>
      </div>
    </div>
    <div class="flex flex-1 h-full">
      <div class="flex w-[81%] flex-col gap-2">
        <MdEditor
          @on-upload-img="onUploadImg"
          class="!h-[97%]" ref="editorRef" v-model="content" language="en-US" :theme="isDark ? 'dark': 'light'"
          :on-save="() => save()"
        />        
      </div>
      <div class="flex-1 px-2">
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
              <div>Page <b v-if="isPublished">Published</b> <span v-else>Unpublished</span></div>
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