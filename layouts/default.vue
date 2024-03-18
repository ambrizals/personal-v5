<script setup lang="ts">
import LinkListItem from "~/components/molecule/LinkListItem.vue";
import { HEADER_SOCIAL_MENUS, HEADER_WEB_MENUS } from "~/constant/header";
const router = useRouter();
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const menuResponsive = ref(false);
function resizeEvent(_: UIEvent) {
  menuResponsive.value = false;
}

function toggleMenuResponsive() {
  menuResponsive.value = !menuResponsive.value;
}

onMounted(() => {
  window.addEventListener("resize", resizeEvent);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeEvent);
});

function openLink(to: string, target?: string) {
  menuResponsive.value = false;
  if (to.includes("http")) {
    window.open(to, target ?? "_blank");
  } else {
    router.replace(to);
  }
}
</script>

<template>
  <ColorScheme>
    <div
      class="flex md:hidden h-14 w-full items-center border-b dark:border-gray-600 border-gray-300 px-4 justify-between sticky top-0 dark:bg-gray-900 bg-gray-50"
    >
      <div class="dark:bg-gray-100 bg-gray-900 rounded-full w-10 h-10"></div>
      <div class="flex justify-center items-center gap-2">
        <UButton
          :icon="
            isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
          "
          color="gray"
          variant="outline"
          aria-label="Theme"
          @click="isDark = !isDark"
        />
        <UButton
          variant="outline"
          color="gray"
          :icon="
            menuResponsive
              ? 'i-heroicons-x-mark-20-solid'
              : 'i-heroicons-bars-3'
          "
          class="text-lg"
          @click="toggleMenuResponsive()"
        />
      </div>
    </div>

    <div class="flex min-h-screen">
      <div
        class="hidden md:flex flex-1 flex-col dark:bg-gray-900 bg-gray-50 px-4 py-2 gap-2"
      >
        <div class="sticky top-4 flex flex-col gap-2">
          <div class="flex justify-between items-center">
          <div
            class="dark:bg-gray-100 bg-gray-900 rounded-full w-10 h-10"
          ></div>

          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            color="gray"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </div>
        <UDivider />
        <LinkListItem
          v-for="menu in HEADER_WEB_MENUS"
          :key="menu.name"
          class="flex items-center gap-2"
          :label="menu.name"
          :icon="menu.icon"
          :link="menu.to"
        />

        <UDivider />
        <div class="font-bold">Social Media</div>
        <LinkListItem
          v-for="menu in HEADER_SOCIAL_MENUS"
          :key="menu.name"
          class="flex items-center gap-2"
          :label="menu.name"
          :icon="menu.icon"
          :link="menu.link"
        />
        </div>
      </div>
      <div class="w-full md:w-9/12 lg:w-10/12">
        <slot />
      </div>
    </div>

    <USlideover v-model="menuResponsive" side="left">
      <div
        class="p-4 flex-1 flex flex-col gap-4"
        @click="menuResponsive != menuResponsive"
      >
        <div class="flex justify-between items-center">
          <div class="bg-gray-100 rounded-full w-10 h-10"></div>
          <div class="flex gap-2">
            <UButton
              :icon="
                isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              variant="outline"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
            <UButton
              variant="outline"
              color="gray"
              :icon="
                menuResponsive
                  ? 'i-heroicons-x-mark-20-solid'
                  : 'i-heroicons-bars-3'
              "
              class="text-lg"
              @click="toggleMenuResponsive()"
            />
          </div>
        </div>
        <UDivider />
        <LinkListItem
          v-for="menu in HEADER_WEB_MENUS"
          :key="menu.name"
          class="flex items-center gap-2"
          :label="menu.name"
          :icon="menu.icon"
          :link="menu.to"
          :middleware="() => toggleMenuResponsive()"
        />

        <UDivider />
        <div class="font-bold">Social Media</div>
        <LinkListItem
          v-for="menu in HEADER_SOCIAL_MENUS"
          :key="menu.name"
          class="flex items-center gap-2"
          :label="menu.name"
          :icon="menu.icon"
          :link="menu.link"
          :middleware="() => toggleMenuResponsive()"
        />
      </div>
    </USlideover>    
  </ColorScheme>
</template>
