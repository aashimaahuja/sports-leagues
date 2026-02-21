<script setup lang="ts">
import CountryBadge from 'src/components/shared/CountryBadge.vue';
import SportBadge from 'src/components/shared/SportBadge.vue';
import type { ApiLeague } from 'src/types/league';

interface LeagueDetailHeaderProps {
  league: ApiLeague;
}

defineProps<LeagueDetailHeaderProps>();
</script>

<template>
  <div class="mb-8 flex items-center gap-4">
    <CountryBadge data-testid="country-badge" :code="league.strLeague.slice(0, 2).toUpperCase()" />
    <div class="min-w-0 flex-1">
      <h1 data-testid="league-name" class="text-xl font-semibold text-white">{{ league.strLeague }}</h1>
      <p
        v-if="league.strLeagueAlternate"
        data-testid="league-alternate-name"
        class="mt-0.5 truncate text-sm text-gray-500"
      >
        {{ league.strLeagueAlternate }}
      </p>
    </div>
    <SportBadge data-testid="sport-badge" :sport="league.strSport" />
  </div>
</template>

