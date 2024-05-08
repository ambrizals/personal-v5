<script setup lang="ts">
const colorMode = useColorMode();
const { doLogin, formState, schema } = useLogin()

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <UForm
      class="w-10/12 md:w-4/12"
      :schema="schema"
      :state="formState"
      @submit="doLogin"
    >
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div>Login</div>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              variant="outline"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
          </div>
        </template>
        <div class="flex flex-col gap-2">
          <UFormGroup label="Username" name="identity">
            <UInput v-model="formState.identity" placeholder="Username / Email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" placeholder="Password" />
          </UFormGroup>
        </div>
        <template #footer>
          <UButton type="submit">Login</UButton>
        </template>
      </UCard>
    </UForm>
  </div>
</template>
