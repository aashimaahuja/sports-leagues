<script setup lang="ts">

interface SportBadgeProps {
  sport: string
}

defineProps<SportBadgeProps>()
</script>

<template>
  <span class="shrink-0 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-md">
    {{ sport }}
  </span>
</template>

