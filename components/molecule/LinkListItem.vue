<script setup lang="ts">
const router = useRouter();
const props = defineProps<{
  label: string;
  link: string;
  icon?: string;
  middleware?: () => void;
}>();

function openLink(to: string, target?: string) {
  if (props.middleware) {
    props.middleware();
  }

  if (to.includes("http")) {
    window.open(to, target ?? "_blank");
  } else {
    router.push(to);
  }
}
</script>

<template>
  <div
    class="flex items-center gap-2 cursor-pointer"
    target="_blank"
    @click="openLink(props.link, '_target')"
  >
    <UIcon :name="props.icon" class="text-xl" dynamic />
    <div>{{ props.label }}</div>
  </div>
</template>
