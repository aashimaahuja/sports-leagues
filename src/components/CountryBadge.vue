<script setup lang="ts">

interface CountryBadgeProps {
  code: string
}

defineProps<CountryBadgeProps>()
</script>

<template>
  <div
    class="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-900 text-emerald-400 text-xs font-bold tracking-widest shrink-0 select-none"
  >
    {{ code.toUpperCase() }}
  </div>
</template>

