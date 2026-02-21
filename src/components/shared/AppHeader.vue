<script setup lang="ts">
import { TrophyIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <header class="flex items-center justify-between border-b border-white/10 bg-[#111111] px-6 py-3">
    <div class="flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500">
        <TrophyIcon class="h-5 w-5 text-white" />
      </div>
      <span class="text-lg font-semibold tracking-tight text-white">LeagueExplorer</span>
    </div>
  </header>
</template>
