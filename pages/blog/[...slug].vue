<script setup lang="ts">
  const path = useRoute()
  const pathContent = path.params.slug ? `/blog/${path.params.slug[0]}` : `/blog`

  const { data } = await useAsyncData(pathContent, () => queryContent(pathContent).findOne())
  console.log(data)
</script>

<template>
  <main>
    <ContentRenderer :value="data ?? undefined">
      <template #empty>
        <p>No content found.</p>
      </template>
    </ContentRenderer> 
  </main>
</template>
