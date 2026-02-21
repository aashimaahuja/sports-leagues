<script setup lang="ts">
import { ref } from 'vue';
import CountryBadge from 'src/components/CountryBadge.vue';
import SportBadge from 'src/components/SportBadge.vue';
import SeasonBadgeModal from 'src/components/SeasonBadgeModal.vue';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import type { ApiLeague } from 'src/types/league';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';
import { storeToRefs } from 'pinia';

interface LeagueListItemProps {
  league: ApiLeague;
}

const props = defineProps<LeagueListItemProps>();

const leagueStore = useLeaguesStore();
const { isBadgeLoading, badgeError, seasonBadge, leagueBadgeMap } = storeToRefs(leagueStore);

const isModalOpen = ref(false);

async function handleClick() {
  isModalOpen.value = true;
  const leagueId = props.league.idLeague;
  if (!leagueBadgeMap.value[leagueId]) {
    await leagueStore.fetchSeasonBadge(leagueId);
  }
}
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-4 border-b border-white/8 px-5 py-4 transition-colors hover:bg-white/5"
    @click="handleClick"
  >
    <CountryBadge :code="league.strLeague.slice(0, 2).toUpperCase()" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm leading-snug font-medium text-white">{{ league.strLeague }}</p>
      <p v-if="league.strLeagueAlternate" class="mt-0.5 truncate text-xs text-gray-500">
        {{ league.strLeagueAlternate }}
      </p>
    </div>
    <SportBadge :sport="league.strSport" />
    <ChevronRightIcon class="h-4 w-4 shrink-0 text-gray-600" />
  </div>

  <SeasonBadgeModal
    v-if="isModalOpen"
    :league="league"
    :is-loading="isBadgeLoading"
    :error="badgeError"
    :season-badge="seasonBadge"
    @close="isModalOpen = false"
  />
</template>
