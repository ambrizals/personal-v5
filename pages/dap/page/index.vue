<script setup lang="ts">
const { $client } = useNuxtApp()
const columns = [{
  key: 'title',
  label: 'Title',
  class: 'w-9/12',
}, {
  key: 'createdAt',
  label: 'Tanggal Terbit',
  class: 'w-2/12',
}, {
  key: 'action',
  class: 'w-1/12'
}]

const { data, pending } = await $client.page.list.useQuery({})

</script>

<template>
  <div class="w-8/12 mx-auto min-h-svh">
    <div class="py-2 flex justify-between items-center">
      <div class="text-xl font-semibold">Pages</div>
      <UButton to="/dap/page/create">Tambah Halaman</UButton>
    </div>

    <div class="bg-white dark:bg-gray-800 my-4 border border-gray-200 dark:border-gray-600 rounded-md">
      <UTable
        :columns="columns"
        :rows="data?.pages"
        :loading="pending"
      >
        <template #action-data="{ row }">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square" :to="`/dap/page/${row.uuid}`" />
        </template>      
      </UTable>
    </div>
  </div>
</template>