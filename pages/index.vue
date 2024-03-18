<template>
  <div>
    <div class="h-72 w-full bg-gray-900 relative">
      <div class="absolute bottom-0 px-4 py-8 w-full md:w-6/12 text-white">
        <h1 class="text-4xl">Ambrizal Suryadinata</h1>
        <p>
          Saya adalah seorang fullstack developer yang pernah menangani Web
          Development, disini anda dapat melihat beberapa artikel yang membahas
          mengenai teknologi yang saya gunakan dan cerita pengalaman.
        </p>
      </div>
    </div>
    <div class="h-4" />
    <div class="px-4">
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <UCard
          v-for="number in 2"
          :key="number"
          class="flex-1"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex items-center md:items-start gap-4">
            <div class="bg-gray-700 w-16 h-16 md:w-32 md:h-32"></div>
            <div class="block md:hidden">
              <div class="text-xs">Category / 12-12-2012</div>
              <h2 class="text-xl font-bold">Ex ipsum ex cupidatat dolor.</h2>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="text-sm hidden md:block">Category / 12-12-2012</div>
            <h2 class="text-2xl hidden md:block font-bold">
              Ex ipsum ex cupidatat dolor.
            </h2>
            <p class="text-justify">
              Duis nisi in exercitation Lorem sunt ullamco aliqua mollit laboris
              incididunt dolore qui id ad. Tempor consectetur labore voluptate
              adipisicing deserunt aute eiusmod proident consequat veniam anim.
              Duis eiusmod magna eiusmod do do sunt in minim pariatur enim et
              exercitation.
            </p>
          </div>
          </div>

        </UCard>
      </div>
      <div class="flex justify-center pt-4">
        <UButton to="/blog" variant="outline" color="gray" trailing icon="i-heroicons-arrow-right">
          Lihat Semua Postingan
        </UButton>
      </div>
    </div>
    <div class="h-4" />
    <UDivider class="h-4" />
  </div>
</template>
