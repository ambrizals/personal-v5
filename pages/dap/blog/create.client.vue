
<script setup lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor from '@toast-ui/editor';

</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <UInput class="flex-1" placeholder="Silakan masukkan judul artikel" size="lg" />
      <div class="flex gap-2 w-fit">
        <UButton>Simpan</UButton>
        <UButton color='red'>Reset</UButton>
      </div>
    </div>
  </div>
</template>