<script setup lang="ts">
import { useChangePassword } from '~/composables/admin/useChangePassword';

const { formState, schema, doChange } = useChangePassword()

</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <UForm class="w-10/12 md:w-4/12" :schema="schema" :state="formState" @submit="doChange">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div>Change Password</div>
          </div>
        </template>        
        <div class="flex flex-col gap-2">
          <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" placeholder="Input a new password" />
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput v-model="formState.confirmPassword" type="password" placeholder="Input again a new password" />
          </UFormGroup>
        </div>       
        <template #footer>
          <UButton type="submit">Change Password</UButton>
        </template>         
      </UCard>
    </UForm>
  </div>
</template>