<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';
import { RouteNames } from 'src/router/routeNames';
import CountryBadge from 'src/components/CountryBadge.vue';
import SportBadge from 'src/components/SportBadge.vue';
import SpinnerLoader from 'src/components/SpinnerLoader.vue';
import ErrorState from 'src/components/ErrorState.vue';

const route = useRoute();
const router = useRouter();
const leagueId = route.params.id as string;

const leaguesStore = useLeaguesStore();
const { leagues, isLoading: isLeaguesLoading, isBadgeLoading, badgeError, leagueBadgeMap } =
  storeToRefs(leaguesStore);

const league = computed(() => leagues.value?.find((l) => l.idLeague === leagueId));
const seasonBadge = computed(() => leagueBadgeMap.value[leagueId]);

onMounted(async () => {
  if (!leagues.value) {
    await leaguesStore.fetchLeagues();
  }
  if (!(leagueId in leagueBadgeMap.value)) {
    await leaguesStore.fetchSeasonBadge(leagueId);
  }
});
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6">
   
    <button
      class="mb-6 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
      @click="router.push({ name: RouteNames.Leagues })"
    >
      <ArrowLeftIcon class="h-4 w-4" />
      Back to leagues
    </button>

    <!-- League header skeleton / content -->
    <div v-if="isLeaguesLoading" class="flex justify-center py-16">
      <SpinnerLoader />
    </div>

    <template v-else-if="league">
      <!-- League header -->
      <div class="mb-8 flex items-center gap-4">
        <CountryBadge :code="league.strLeague.slice(0, 2).toUpperCase()" />
        <div class="min-w-0 flex-1">
          <h1 class="text-xl font-semibold text-white">{{ league.strLeague }}</h1>
          <p v-if="league.strLeagueAlternate" class="mt-0.5 truncate text-sm text-gray-500">
            {{ league.strLeagueAlternate }}
          </p>
        </div>
        <SportBadge :sport="league.strSport" />
      </div>

      <!-- Season badge section -->
      <div
        class="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-[#1a1a1a] px-6 py-12"
      >
        <SpinnerLoader v-if="isBadgeLoading" />
        <ErrorState v-else-if="badgeError" :message="badgeError" />

        <!-- Badge found -->
        <div v-else-if="seasonBadge?.strBadge" class="flex flex-col items-center gap-4">
          <img
            :src="seasonBadge.strBadge"
            :alt="`${league.strLeague} – ${seasonBadge.strSeason} badge`"
            class="h-48 w-48 rounded-xl object-contain"
          />
          <span class="rounded-md bg-white/10 px-3 py-1 text-sm text-gray-300">
            {{ seasonBadge.strSeason }}
          </span>
        </div>

        <!-- No badge available -->
        <p v-else class="text-center text-sm text-gray-500">
          No season badge available for this league.
        </p>
      </div>
    </template>

    <!-- League not found -->
    <div v-else class="py-16 text-center text-sm text-gray-500">League not found.</div>
  </div>
</template>

