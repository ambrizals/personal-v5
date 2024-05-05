<!-- For admin access -->
<script setup lang="ts">
const router = useRouter()
const { clearAuth } = useAuth()

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
    label: 'Change Password'
  }]]
}]
</script>

<template>
  <div class="flex">
    <div class="border-r flex flex-col min-h-screen">
      <UTooltip v-for="menu in menus" :key="menu.label" :text="menu.label">
        <UDropdown :items="menu.sub" :popper="{ offsetDistance: 12, placement: 'right-start' }">
          <div class="text-2xl py-2 px-3 hover:bg-gray-100 border-b cursor-pointer" @click="menu.onClick">
            <UIcon :name="menu.icon" />
          </div>
        </UDropdown>
      </UTooltip>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
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