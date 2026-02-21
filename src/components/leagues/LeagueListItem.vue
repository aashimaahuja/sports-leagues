<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import CountryBadge from 'src/components/shared/CountryBadge.vue';
import SportBadge from 'src/components/shared/SportBadge.vue';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import type { ApiLeague } from 'src/types/league';
import { RouteNames } from 'src/router/routeNames';

interface LeagueListItemProps {
  league: ApiLeague;
}

const props = defineProps<LeagueListItemProps>();

const leagueDetailRoute = computed(() => ({
  name: RouteNames.LeagueDetail,
  params: { id: props.league.idLeague },
}));
</script>

<template>
  <RouterLink
    :to="leagueDetailRoute"
    class="flex items-center gap-4 border-b border-white/8 px-5 py-4 transition-colors hover:bg-white/5"
  >
    <CountryBadge data-testid="country-badge" :code="league.strLeague.slice(0, 2).toUpperCase()" />
    <div class="min-w-0 flex-1">
      <p data-testid="league-name" class="truncate text-sm leading-snug font-medium text-white">
        {{ league.strLeague }}
      </p>
      <p
        v-if="league.strLeagueAlternate"
        data-testid="league-alternate-name"
        class="mt-0.5 truncate text-xs text-gray-500"
      >
        {{ league.strLeagueAlternate }}
      </p>
    </div>
    <SportBadge data-testid="sport-badge" :sport="league.strSport" />
    <span data-testid="chevron-icon">
      <ChevronRightIcon class="h-4 w-4 shrink-0 text-gray-600" />
    </span>
  </RouterLink>
</template>
