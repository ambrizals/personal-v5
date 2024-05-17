<!-- For admin access -->
<script setup lang="ts">
const router = useRouter()
const colorMode = useColorMode();
const { clearAuth } = useAuth()

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
const logoutConfirm = ref(false)

definePageMeta({
  layout: 'dap-default',
  middleware: 'admin'
})

function switchLogoutConfirm() {
  logoutConfirm.value = !logoutConfirm.value
}

function doLogout() {
  clearAuth()
  router.replace('/')
}

const menus = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  onClick: () => {
    router.push('/dap')
  }
}, {
  label: 'Blog',
  icon: 'i-heroicons-list-bullet',
  onClick: () => {
    router.push('/dap/blog')
  }
}, {
  label: 'Account',
  icon: 'i-heroicons-user',
  sub: [[{
    label: 'Logout',
    click: () => {
      logoutConfirm.value = true
    }
  }, {
    label: 'Change Password',
    click: () => {
      router.push('/dap/password')
    }
  }]]
}]

useHead({
  titleTemplate: () => 'Admin Dashboard'
})
</script>

<template>
  <div class="flex">
    <div class="fixed h-full border-r flex flex-col max-h-screen justify-between bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
      <div class="flex flex-col">
        <UTooltip v-for="menu in menus" :key="menu.label" :text="menu.label">
          <UDropdown :items="menu.sub" :popper="{ offsetDistance: 12, placement: 'right-start' }">
            <div class="text-2xl py-2 px-3 hover:bg-gray-100 border-b cursor-pointer dark:border-gray-600 dark:hover:bg-gray-800" @click="menu.onClick">
              <UIcon :name="menu.icon" />
            </div>
          </UDropdown>
        </UTooltip>        
      </div>
      <UTooltip text="Light / Night Mode">
        <div class="text-2xl py-2 px-3 border-t cursor-pointer hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800" @click="isDark = !isDark">
          <UIcon name="i-heroicons-moon" />
        </div>
      </UTooltip>
    </div>
    <div class="w-[48px]" />
    <div class="flex-1 bg-gray-50 dark:bg-gray-800">
      <NuxtPage />
    </div>
  </div>
  <UNotifications />
  <UModal v-model="logoutConfirm">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h2 class="font-semibold">Ingin logout ?</h2>
        </template>

        <p>Apakah anda yakin untuk keluar dari aplikasi manajemen ini ?</p>

        <template #footer>
          <div class="flex gap-2">
            <UButton @click="doLogout()">Logout</UButton>
            <UButton color="red" variant="outline" @click="switchLogoutConfirm()">Batal</UButton>
          </div>
        </template>
      </UCard>
  </UModal>
</template>