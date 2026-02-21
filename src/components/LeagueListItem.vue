<script setup lang="ts">
import type { League } from 'src/types/league'
import CountryBadge from 'src/components/CountryBadge.vue'
import SportBadge from 'src/components/SportBadge.vue'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'

defineProps<{
  league: League
}>()
</script>

<template>
  <div
    class="flex items-center gap-4 px-5 py-4 border-b border-white/8 hover:bg-white/5 cursor-pointer transition-colors"
  >
    <CountryBadge :code="league.countryCode" />
    <div class="flex-1 min-w-0">
      <p class="text-white text-sm font-medium leading-snug truncate">{{ league.name }}</p>
      <p v-if="league.aliases.length" class="text-gray-500 text-xs mt-0.5 truncate">
        {{ league.aliases.join(', ') }}
      </p>
    </div>
    <SportBadge :sport="league.sport" />
    <ChevronRightIcon class="w-4 h-4 text-gray-600 shrink-0" />
  </div>
</template>

