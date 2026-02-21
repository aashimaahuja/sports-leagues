import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';
import { SPORTS_DB_BASE_URL } from 'src/configs';
import type { ApiLeague, ApiSeason } from 'src/types/league';

const fakeLeague = (overrides: Partial<ApiLeague> = {}): ApiLeague => ({
  idLeague: '1',
  strLeague: 'Premier League',
  strSport: 'Soccer',
  strLeagueAlternate: 'EPL',
  ...overrides,
});

const fakeSeason = (overrides: Partial<ApiSeason> = {}): ApiSeason => ({
  strSeason: '2023-24',
  strBadge: 'https://example.com/badge.png',
  ...overrides,
});

describe('useLeaguesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has correct initial state', () => {
    const store = useLeaguesStore();

    expect(store.leagues).toBeUndefined();
    expect(store.isLeaguesLoading).toBe(false);
    expect(store.leaguesError).toBeNull();
    expect(store.sportsList).toEqual([]);
    expect(store.isBadgeLoading).toBe(false);
    expect(store.badgeError).toBeNull();
    expect(store.seasonBadgeCache).toEqual({});
  });

  describe('getLeagues', () => {
    it('fetches leagues successfully', async () => {
      const leagues = [
        fakeLeague({ idLeague: '1', strLeague: 'Premier League', strSport: 'Soccer' }),
        fakeLeague({ idLeague: '2', strLeague: 'NBA', strSport: 'Basketball' }),
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ leagues }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getLeagues();

      expect(store.leagues).toEqual(leagues);
      expect(store.isLeaguesLoading).toBe(false);
      expect(store.leaguesError).toBeNull();
    });

    it('calls the correct API endpoint', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ leagues: [] }), { status: 200 }));

      const store = useLeaguesStore();
      await store.getLeagues();

      expect(fetchSpy).toHaveBeenCalledWith(`${SPORTS_DB_BASE_URL}/all_leagues.php`);
    });

    it('sets isLoading to true while fetching and false after', async () => {
      let resolveResponse!: (value: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });

      vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingResponse);

      const store = useLeaguesStore();
      const fetchPromise = store.getLeagues();

      expect(store.isLeaguesLoading).toBe(true);

      resolveResponse(new Response(JSON.stringify({ leagues: [] }), { status: 200 }));
      await fetchPromise;

      expect(store.isLeaguesLoading).toBe(false);
    });

    it('sets error when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const store = useLeaguesStore();
      await store.getLeagues();

      expect(store.leagues).toBeUndefined();
      expect(store.leaguesError).toEqual(new Error('Failed to fetch data: /all_leagues.php'));
      expect(store.isLeaguesLoading).toBe(false);
    });

    it('propagates network errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

      const store = useLeaguesStore();
      await expect(store.getLeagues()).rejects.toThrow('Network failure');

      expect(store.isLeaguesLoading).toBe(false);
    });

    it('propagates non-Error throws', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('unexpected string error');

      const store = useLeaguesStore();
      await expect(store.getLeagues()).rejects.toBe('unexpected string error');
    });

    it('clears a previous error before a new fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const store = useLeaguesStore();
      await store.getLeagues();
      expect(store.leaguesError).toEqual(new Error('Failed to fetch data: /all_leagues.php'));

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ leagues: [] }), { status: 200 }),
      );
      await store.getLeagues();

      expect(store.leaguesError).toBeNull();
    });

    it('does not re-fetch if leagues are already loaded', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ leagues: [] }), { status: 200 }));

      const store = useLeaguesStore();
      await store.getLeagues();
      await store.getLeagues();

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sports computed', () => {
    it('returns a unique list of sports from leagues', async () => {
      const leagues = [
        fakeLeague({ strSport: 'Soccer' }),
        fakeLeague({ idLeague: '2', strSport: 'Basketball' }),
        fakeLeague({ idLeague: '3', strSport: 'Soccer' }),
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ leagues }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getLeagues();

      expect(store.sportsList).toEqual(['Soccer', 'Basketball']);
    });

    it('returns an empty array before leagues are loaded', () => {
      const store = useLeaguesStore();

      expect(store.sportsList).toEqual([]);
    });
  });

  describe('getSeasonBadge', () => {
    it('fetches and caches a season badge successfully', async () => {
      const season = fakeSeason();

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ seasons: [season] }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');

      expect(store.seasonBadgeCache['1']).toEqual(season);
      expect(store.isBadgeLoading).toBe(false);
      expect(store.badgeError).toBeNull();
    });

    it('calls the correct API endpoint', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ seasons: [] }), { status: 200 }));

      const store = useLeaguesStore();
      await store.getSeasonBadge('42');

      expect(fetchSpy).toHaveBeenCalledWith(
        `${SPORTS_DB_BASE_URL}/search_all_seasons.php?badge=1&id=42`,
      );
    });

    it('sets isBadgeLoading to true while fetching and false after', async () => {
      let resolveResponse!: (value: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });

      vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingResponse);

      const store = useLeaguesStore();
      const fetchPromise = store.getSeasonBadge('1');

      expect(store.isBadgeLoading).toBe(true);

      resolveResponse(new Response(JSON.stringify({ seasons: [] }), { status: 200 }));
      await fetchPromise;

      expect(store.isBadgeLoading).toBe(false);
    });

    it('sets badgeError when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');

      expect(store.badgeError).toEqual(new Error('Failed to fetch data: /search_all_seasons.php'));
      expect(store.isBadgeLoading).toBe(false);
    });

    it('propagates network errors', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

      const store = useLeaguesStore();
      await expect(store.getSeasonBadge('1')).rejects.toThrow('Network failure');

      expect(store.isBadgeLoading).toBe(false);
    });

    it('propagates non-Error throws', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('unexpected string error');

      const store = useLeaguesStore();
      await expect(store.getSeasonBadge('1')).rejects.toBe('unexpected string error');
    });

    it('clears a previous badgeError before a new fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');
      expect(store.badgeError).toEqual(new Error('Failed to fetch data: /search_all_seasons.php'));

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ seasons: [] }), { status: 200 }),
      );
      await store.getSeasonBadge('2');

      expect(store.badgeError).toBeNull();
    });

    it('does not re-fetch if league badge is already cached', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ seasons: [] }), { status: 200 }));

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');
      await store.getSeasonBadge('1');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('caches null when the API returns no seasons', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ seasons: null }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');

      expect(store.seasonBadgeCache['1']).toBeNull();
    });

    it('caches null when no season has a badge', async () => {
      const seasons = [
        fakeSeason({ strBadge: null }),
        fakeSeason({ strSeason: '2022-23', strBadge: null }),
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ seasons }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');

      expect(store.seasonBadgeCache['1']).toBeNull();
    });

    it('caches the first season that has a badge', async () => {
      const seasons = [
        fakeSeason({ strSeason: '2021-22', strBadge: null }),
        fakeSeason({ strSeason: '2022-23', strBadge: 'https://example.com/badge-2.png' }),
        fakeSeason({ strSeason: '2023-24', strBadge: 'https://example.com/badge-3.png' }),
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ seasons }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');

      expect(store.seasonBadgeCache['1']).toEqual(seasons[1]);
    });

    it('caches results independently per league', async () => {
      const season1 = fakeSeason({ strSeason: '2023-24', strBadge: 'https://example.com/1.png' });
      const season2 = fakeSeason({ strSeason: '2022-23', strBadge: 'https://example.com/2.png' });

      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ seasons: [season1] }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ seasons: [season2] }), { status: 200 }),
        );

      const store = useLeaguesStore();
      await store.getSeasonBadge('1');
      await store.getSeasonBadge('2');

      expect(store.seasonBadgeCache['1']).toEqual(season1);
      expect(store.seasonBadgeCache['2']).toEqual(season2);
    });
  });
});
