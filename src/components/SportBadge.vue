<script setup lang="ts">
interface SportBadgeProps {
  sport: string
}

defineProps<SportBadgeProps>()
</script>

<template>
  <span class="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-xs text-gray-300">
    {{ sport }}
  </span>
</template>
