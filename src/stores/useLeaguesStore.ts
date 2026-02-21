import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiLeague, ApiSeason } from 'src/types/league';
import { SPORTS_DB_BASE_URL } from 'src/constants/api';

export const useLeaguesStore = defineStore('leagues', () => {
  const leagues = ref<ApiLeague[]>();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const sports = computed(() => [...new Set(leagues?.value?.map((l) => l.strSport))]);

  const fetchLeagues = async (): Promise<void> => {
    if (leagues.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${SPORTS_DB_BASE_URL}/all_leagues.php`);

      if (!response.ok) {
        throw new Error(`Failed to fetch leagues: ${response.statusText}`);
      }

      const data: { leagues: ApiLeague[] } = await response.json();
      leagues.value = data.leagues;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const isBadgeLoading = ref(false);
  const badgeError = ref<string | null>(null);
  const seasonBadge = ref<ApiSeason | null>(null);
  const seasonBadgeCache = ref<Record<string, ApiSeason | null>>({});

  const fetchSeasonBadge = async (leagueId: string): Promise<void> => {
    if (leagueId in seasonBadgeCache.value) return;

    isBadgeLoading.value = true;
    badgeError.value = null;
    seasonBadge.value = null;

    try {
      const response = await fetch(
        `${SPORTS_DB_BASE_URL}/search_all_seasons.php?badge=1&id=${leagueId}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch seasons: ${response.statusText}`);
      }

      const data: { seasons: ApiSeason[] | null } = await response.json();
      const seasons = data.seasons ?? [];
      seasonBadge.value = seasons.find((s) => s.strBadge !== null) ?? null;
      seasonBadgeCache.value[leagueId] = seasonBadge.value;
    } catch (err) {
      badgeError.value = err instanceof Error ? err.message : 'An unknown error occurred';
    } finally {
      isBadgeLoading.value = false;
    }
  };

  return {
    leagues,
    isLoading,
    error,
    sports,
    fetchLeagues,
    isBadgeLoading,
    badgeError,
    seasonBadge,
    fetchSeasonBadge,
    seasonBadgeCache,
  };
});
