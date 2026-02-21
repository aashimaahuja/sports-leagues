<script setup lang="ts">
import { TrophyIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <header class="flex items-center justify-between px-6 py-3 bg-[#111111] border-b border-white/10">
    <div class="flex items-center gap-2.5">
      <div class="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-500">
        <TrophyIcon class="w-5 h-5 text-white" />
      </div>
      <span class="text-white font-semibold text-lg tracking-tight">LeagueExplorer</span>
    </div>

    <span class="text-gray-400 text-sm">Sports Leagues Directory</span>
  </header>
</template>

