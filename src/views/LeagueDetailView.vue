<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';
import { RouteNames } from 'src/router/routeNames';
import Spinner from 'src/components/common/Spinner.vue';
import LeagueDetailHeader from 'src/components/league-detail/LeagueDetailHeader.vue';
import LeagueSeasonBadge from 'src/components/league-detail/LeagueSeasonBadge.vue';

const route = useRoute();
const leagueId = route.params.id as string;

const leaguesStore = useLeaguesStore();
const { leagues, isLeaguesLoading, isBadgeLoading, badgeError, seasonBadgeCache } =
  storeToRefs(leaguesStore);

const league = computed(() => leagues.value?.find((l) => l.idLeague === leagueId));
const seasonBadge = computed(() => seasonBadgeCache.value[leagueId]);

onMounted(async () => {
  await leaguesStore.getLeagues();
  await leaguesStore.getSeasonBadge(leagueId);
});
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6">
    <RouterLink
      :to="{ name: RouteNames.Leagues }"
      class="mb-6 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
    >
      <ArrowLeftIcon class="h-4 w-4" />
      Back to leagues
    </RouterLink>

    <div v-if="isLeaguesLoading" class="flex justify-center py-16">
      <Spinner />
    </div>

    <template v-else-if="league">
      <LeagueDetailHeader :league="league" />
      <LeagueSeasonBadge
        :league-name="league.strLeague"
        :is-loading="isBadgeLoading"
        :error="badgeError"
        :season-badge="seasonBadge"
      />
    </template>

    <div v-else class="py-16 text-center text-sm text-gray-500">League not found.</div>
  </div>
</template>
