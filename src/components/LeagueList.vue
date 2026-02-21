<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import LeagueListItem from 'src/components/LeagueListItem.vue';
import SportFilterSelect from 'src/components/SportFilterSelect.vue';
import SearchInput from 'src/components/SearchInput.vue';
import SpinnerLoader from 'src/components/SpinnerLoader.vue';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';

const leaguesStore = useLeaguesStore();

onMounted(() => {
  if (!leaguesStore.leagues) {
    leaguesStore.fetchLeagues();
  }
});

const searchQuery = ref('');
const selectedSport = ref('All Sports');

const filteredLeagues = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  return leaguesStore.leagues?.filter((league) => {
    const matchesSport =
      selectedSport.value === 'All Sports' || league.strSport === selectedSport.value;

    const matchesSearch =
      !query ||
      league.strLeague.toLowerCase().includes(query) ||
      league.strLeagueAlternate?.toLowerCase().includes(query) ||
      league.strLeague.slice(0, 2).toLowerCase().includes(query);

    return matchesSport && matchesSearch;
  });
});
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6">
    <div class="mb-5 flex gap-3">
      <SearchInput v-model="searchQuery" />
      <SportFilterSelect v-model="selectedSport" :options="leaguesStore.sports" />
    </div>

    <!-- Results count -->
    <p v-if="filteredLeagues" class="mb-3 text-sm text-gray-500">
      {{ filteredLeagues.length }} league{{ filteredLeagues.length !== 1 ? 's' : '' }} found
    </p>

    <!-- Loader -->
    <SpinnerLoader v-if="leaguesStore.isLoading" />

    <!-- List -->
    <div v-else class="overflow-hidden rounded-xl border border-white/8 bg-[#1a1a1a]">
      <LeagueListItem v-for="league in filteredLeagues" :key="league.idLeague" :league="league" />
      <div
        v-if="filteredLeagues && filteredLeagues.length === 0"
        class="py-12 text-center text-sm text-gray-500"
      >
        No leagues match your search.
      </div>
    </div>
  </div>
</template>
