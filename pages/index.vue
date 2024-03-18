
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
    <div class="flex">
      <div class="w-9/12 px-4">
        <CompTitle label="My Project" to="/project" />

        <div class="h-2" />

        <UCard v-for="item in 4" :key="item" class="mb-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold">Ea aliqua ut nostrud laboris ea voluptate eu mollit.</h3>
              <p>Mollit anim reprehenderit cupidatat sint mollit incididunt duis commodo incididunt labore fugiat Lorem laboris qui.</p>
            </div>
            <div class="bg-gray-900 w-16 h-16"></div>
          </div>
        </UCard>
      </div>
      <div class="w-3/12 pr-4 flex flex-col gap-2">
        <CompTitle label="Quick Links" />
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-link-solid">
          My Github Snippet
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-document-check-16-solid

">
          My Curriculum Vitae
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-link-solid">
          My Glints Account
        </UButton>
        <UButton block color="gray" variant="outline" :trailing="false" icon="i-heroicons-envelope">
          Send Me An Email
        </UButton>
      </div>
    </div>
  </div>
</template>
