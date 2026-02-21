<script setup lang="ts">
import Spinner from 'src/components/common/Spinner.vue';
import ErrorState from 'src/components/common/ErrorState.vue';
import type { ApiSeason } from 'src/types/league';

interface LeagueSeasonBadgeProps {
  leagueName: string;
  isLoading: boolean;
  error: Error | null;
  seasonBadge: ApiSeason | null | undefined;
}

defineProps<LeagueSeasonBadgeProps>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-[#1a1a1a] px-6 py-12"
  >
    <Spinner v-if="isLoading" data-testid="spinner" />
    <ErrorState
      v-else-if="error"
      data-testid="error-state"
      message="Failed to fetch season badge"
    />

    <div v-else-if="seasonBadge?.strBadge" class="flex flex-col items-center gap-4">
      <img
        data-testid="badge-image"
        :src="seasonBadge.strBadge"
        :alt="`${leagueName} – ${seasonBadge.strSeason} badge`"
        class="h-48 w-48 rounded-xl object-contain"
      />
      <span
        data-testid="season-label"
        class="rounded-md bg-white/10 px-3 py-1 text-sm text-gray-300"
      >
        {{ seasonBadge.strSeason }}
      </span>
    </div>

    <p v-else data-testid="no-badge-message" class="text-center text-sm text-gray-500">
      No season badge available for this league.
    </p>
  </div>
</template>
