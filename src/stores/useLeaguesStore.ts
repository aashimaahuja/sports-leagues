import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ApiLeague } from 'src/types/league'
import { SPORTS_DB_BASE_URL } from 'src/constants/api'

export const useLeaguesStore = defineStore('leagues', () => {
  const leagues = ref<ApiLeague[]>()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sports = computed(() => [...new Set(leagues?.value?.map((l) => l.strSport))])

  const fetchLeagues = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${SPORTS_DB_BASE_URL}/all_leagues.php`)

      if (!response.ok) {
        throw new Error(`Failed to fetch leagues: ${response.statusText}`)
      }

      const data: { leagues: ApiLeague[] } = await response.json()
      leagues.value = data.leagues
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return { leagues, isLoading, error, sports, fetchLeagues }
})
