import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { ApiLeague, ApiSeason } from 'src/types/league';
import { useFetch } from 'src/composables/useFetch';

export const useLeaguesStore = defineStore('leagues', () => {
  const {
    isLoading: isLeaguesLoading,
    error: leaguesError,
    getJson: fetchLeagues,
  } = useFetch<{ leagues: ApiLeague[] }>(`/all_leagues.php`);

  const {
    isLoading: isBadgeLoading,
    error: badgeError,
    getJson: fetchSeasonBadge,
  } = useFetch<{ seasons: ApiSeason[] | null }>(`/search_all_seasons.php`);

  const leaguesData = ref<ApiLeague[] | undefined>(undefined);
  const sportsList = computed(() => [
    ...new Set(leaguesData?.value?.map((league) => league.strSport)),
  ]);
  const seasonBadgeCache = ref<Record<string, ApiSeason | null>>({});

  const getLeagues = async () => {
    if (leaguesData.value) return leaguesData.value;
    const leagues = await fetchLeagues();
    if (leagues) {
      leaguesData.value = leagues.leagues;
      return leagues;
    }
    return null;
  };

  const getSeasonBadge = async (leagueId: string) => {
    if (leagueId in seasonBadgeCache.value) return seasonBadgeCache.value[leagueId];
    const seasonBadge = await fetchSeasonBadge({ queryParams: { badge: '1', id: leagueId } });
    if (seasonBadge) {
      seasonBadgeCache.value[leagueId] =
        seasonBadge.seasons?.find((s) => s.strBadge !== null) ?? null;
      return seasonBadge;
    }
    return null;
  };

  return {
    leagues: leaguesData,
    isLeaguesLoading,
    leaguesError,
    sportsList,
    getLeagues,
    isBadgeLoading,
    badgeError,
    getSeasonBadge,
    seasonBadgeCache,
  };
});
