<script setup lang="ts">
import { ALL_SPORTS } from 'src/constants/constants';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

interface SportFilterSelectProps {
  options: string[];
}

defineProps<SportFilterSelectProps>();
const selectedOption = defineModel<string>({ default: ALL_SPORTS });
</script>

<template>
  <div class="relative" data-testid="sport-filter-container">
    <select
      v-model="selectedOption"
      data-testid="sport-filter-select"
      class="cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#1e1e1e] py-2.5 pr-9 pl-4 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
    >
      <option :value="ALL_SPORTS">{{ ALL_SPORTS }}</option>
      <option v-for="sport in options" :key="sport" :value="sport">{{ sport }}</option>
    </select>
    <span data-testid="chevron-icon">
      <ChevronDownIcon
        class="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
    </span>
  </div>
</template>
