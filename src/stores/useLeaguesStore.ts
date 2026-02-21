import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { League, ApiLeague } from 'src/types/league'
import { SPORTS_DB_BASE_URL } from 'src/constants/api'

function mapApiLeague(raw: ApiLeague): League {
  return {
    id: raw.idLeague,
    name: raw.strLeague,
    sport: raw.strSport,
    aliases: raw.strLeagueAlternate ? raw.strLeagueAlternate.split(', ') : [],
    countryCode: raw.strLeague.slice(0, 2).toUpperCase(),
  }
}

export const useLeaguesStore = defineStore('leagues', () => {
  const leagues = ref<League[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sports = computed(() => [...new Set(leagues.value.map((l) => l.sport))])

  async function fetchLeagues(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${SPORTS_DB_BASE_URL}/all_leagues.php`)

      if (!response.ok) {
        throw new Error(`Failed to fetch leagues: ${response.statusText}`)
      }

      const data: { leagues: ApiLeague[] } = await response.json()
      leagues.value = data.leagues.map(mapApiLeague)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return { leagues, isLoading, error, sports, fetchLeagues }
})
