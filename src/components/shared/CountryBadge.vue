<script setup lang="ts">
interface CountryBadgeProps {
  code: string;
}

defineProps<CountryBadgeProps>();
</script>

<template>
  <div
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-900 text-xs font-bold tracking-widest text-emerald-400 select-none"
  >
    {{ code.toUpperCase() }}
  </div>
</template>

