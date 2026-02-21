<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const modelValue = defineModel<string>();
</script>

<template>
  <div class="relative flex-1">
    <MagnifyingGlassIcon
      class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500"
    />
    <input
      v-model="modelValue"
      type="text"
      placeholder="Search leagues..."
      class="w-full rounded-lg border border-white/10 bg-[#1e1e1e] py-2.5 pr-4 pl-9 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
    />
  </div>
</template>

