<script setup lang="ts">
import { ref, computed } from 'vue'
import LeagueListItem from 'src/components/LeagueListItem.vue'
import type { League } from 'src/types/league'

const LEAGUES: League[] = [
  { id: '1',  name: 'English Premier League',    aliases: ['Premier League', 'EPL', 'England'], sport: 'Soccer', countryCode: 'EN' },
  { id: '2',  name: 'English League Championship', aliases: ['Championship'],                   sport: 'Soccer', countryCode: 'EN' },
  { id: '3',  name: 'Scottish Premier League',    aliases: ['Scottish Premiership', 'SPFL'],    sport: 'Soccer', countryCode: 'SC' },
  { id: '4',  name: 'German Bundesliga',          aliases: ['Bundesliga', 'Fußball-Bundesliga'], sport: 'Soccer', countryCode: 'GE' },
  { id: '5',  name: 'Italian Serie A',            aliases: ['Serie A'],                         sport: 'Soccer', countryCode: 'IT' },
  { id: '6',  name: 'French Ligue 1',             aliases: ['Ligue 1 Conforama France'],         sport: 'Soccer', countryCode: 'FR' },
  { id: '7',  name: 'Spanish La Liga',            aliases: ['LaLiga Santander', 'La Liga'],      sport: 'Soccer', countryCode: 'SP' },
  { id: '8',  name: 'Greek Superleague Greece',   aliases: [],                                   sport: 'Soccer', countryCode: 'GR' },
  { id: '9',  name: 'Dutch Eredivisie',           aliases: ['Eredivisie'],                       sport: 'Soccer', countryCode: 'DU' },
  { id: '10', name: 'Belgian Pro League',         aliases: ['Belgium Jupiler Pro League'],       sport: 'Soccer', countryCode: 'BE' },
]

const allSports = computed(() => {
  const sports = [...new Set(LEAGUES.map((l) => l.sport))]
  return sports
})

const searchQuery = ref('')
const selectedSport = ref('All Sports')

const filteredLeagues = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return LEAGUES.filter((league) => {
    const matchesSport =
      selectedSport.value === 'All Sports' || league.sport === selectedSport.value

    const matchesSearch =
      !q ||
      league.name.toLowerCase().includes(q) ||
      league.aliases.some((a) => a.toLowerCase().includes(q)) ||
      league.countryCode.toLowerCase().includes(q)

    return matchesSport && matchesSearch
  })
})
</script>

<template>
  <div class="w-full max-w-3xl mx-auto px-4 py-6">
    <!-- Search + Filter bar -->
    <div class="flex gap-3 mb-5">
      <!-- Search input -->
      <div class="relative flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search leagues..."
          class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#1e1e1e] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <!-- Sport filter dropdown -->
      <div class="relative">
        <select
          v-model="selectedSport"
          class="appearance-none pl-4 pr-9 py-2.5 rounded-lg bg-[#1e1e1e] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="All Sports">All Sports</option>
          <option v-for="sport in allSports" :key="sport" :value="sport">{{ sport }}</option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-gray-500 text-sm mb-3">
      {{ filteredLeagues.length }} league{{ filteredLeagues.length !== 1 ? 's' : '' }} found
    </p>

    <!-- List -->
    <div class="rounded-xl border border-white/8 overflow-hidden bg-[#1a1a1a]">
      <LeagueListItem
        v-for="league in filteredLeagues"
        :key="league.id"
        :league="league"
      />
      <div
        v-if="filteredLeagues.length === 0"
        class="py-12 text-center text-gray-500 text-sm"
      >
        No leagues match your search.
      </div>
    </div>
  </div>
</template>

