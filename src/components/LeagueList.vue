<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LeagueListItem from 'src/components/LeagueListItem.vue'
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useLeaguesStore } from 'src/stores/useLeaguesStore'

const leaguesStore = useLeaguesStore()

onMounted(() => {
  if (!leaguesStore.leagues) {
    leaguesStore.fetchLeagues()
  }
})

const searchQuery = ref('')
const selectedSport = ref('All Sports')

const filteredLeagues = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return leaguesStore.leagues?.filter((league) => {
    const matchesSport =
      selectedSport.value === 'All Sports' || league.strSport === selectedSport.value

    const matchesSearch =
      !query ||
      league.strLeague.toLowerCase().includes(query) ||
      league.strLeagueAlternate?.toLowerCase().includes(query) ||
      league.strLeague.slice(0, 2).toUpperCase().includes(query)

    return matchesSport && matchesSearch
  })
})
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6">
    <!-- Search + Filter bar -->
    <div class="mb-5 flex gap-3">
      <div class="relative flex-1">
        <MagnifyingGlassIcon
          class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search leagues..."
          class="w-full rounded-lg border border-white/10 bg-[#1e1e1e] py-2.5 pr-4 pl-9 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <!-- Sport filter dropdown -->
      <div class="relative">
        <select
          v-model="selectedSport"
          class="cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#1e1e1e] py-2.5 pr-9 pl-4 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="All Sports">All Sports</option>
          <option v-for="sport in leaguesStore.sports" :key="sport" :value="sport">{{ sport }}</option>
        </select>
        <ChevronDownIcon
          class="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>

    <!-- Results count -->
    <p v-if="filteredLeagues" class="mb-3 text-sm text-gray-500">
      {{ filteredLeagues.length }} league{{ filteredLeagues.length !== 1 ? 's' : '' }} found
    </p>

    <!-- List -->
    <div class="overflow-hidden rounded-xl border border-white/8 bg-[#1a1a1a]">
      <LeagueListItem
        v-for="league in filteredLeagues"
        :key="league.idLeague"
        :league="league"
      />
      <div v-if="filteredLeagues && filteredLeagues.length === 0" class="py-12 text-center text-sm text-gray-500">
        No leagues match your search.
      </div>
    </div>
  </div>
</template>
