<script setup lang="ts">
import { computed } from '#imports'

/**
 * @credits UnJS <https://unjs.io/>
 */

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  subPage?: string
  siteLogo?: string
  image?: string
}>(), {
  description: ''
})


const description = computed(() => (props.description || '').slice(0, 200))
</script>

<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="pt-[96px] pb-[70px] px-[6.75rem] h-full flex flex-col justify-between">
      <div>
        <div v-if="subPage">
          <div class="font-bold text-3xl">{{ subPage }}</div>
        </div>
        <div class="flex flex-row justify-between gap-28">
          <div class="max-w-[700px]">
            <h1 class="mb-[30px] max-w-[700px] text-[36px] text-gray-900 font-normal flex flex-row">
              <span>{{ title }}</span>
            </h1>
            <div v-if="description.length > 0" class="h-1 bg-gray-700 w-full"></div>
            <p class="text-gray-500 max-w-[700px] text-[24px]">
              {{ description }}
            </p>
          </div>
          <div v-if="image" class="flex-1 flex flex-col justify-center items-center">
            <img :src="image" class="object-cover w-42 h-42" />
          </div>
        </div>        
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="text-xl font-semibold">By Ambrizal Suryadinata</div>
        <div v-if="siteLogo">
          <img :src="siteLogo" class="w-[36px]" />
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 w-full h-8 bg-[#ababab]" />
  </div>
</template>