import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { useLeaguesStore } from 'src/stores/useLeaguesStore';
import { SPORTS_DB_BASE_URL } from 'src/constants/api';
import type { ApiLeague } from 'src/types/league';

const fakeLeague = (overrides: Partial<ApiLeague> = {}): ApiLeague => ({
  idLeague: '1',
  strLeague: 'Premier League',
  strSport: 'Soccer',
  strLeagueAlternate: 'EPL',
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
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.sports).toEqual([]);
  });

  it('fetches leagues successfully', async () => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League', strSport: 'Soccer' }),
      fakeLeague({ idLeague: '2', strLeague: 'NBA', strSport: 'Basketball' }),
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ leagues }), { status: 200 }),
    );

    const store = useLeaguesStore();
    await store.fetchLeagues();

    expect(store.leagues).toEqual(leagues);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('calls the correct API endpoint', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ leagues: [] }), { status: 200 }));

    const store = useLeaguesStore();
    await store.fetchLeagues();

    expect(fetchSpy).toHaveBeenCalledWith(`${SPORTS_DB_BASE_URL}/all_leagues.php`);
  });

  it('sets isLoading to true while fetching and false after', async () => {
    let resolveResponse!: (value: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });

    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingResponse);

    const store = useLeaguesStore();
    const fetchPromise = store.fetchLeagues();

    expect(store.isLoading).toBe(true);

    resolveResponse(new Response(JSON.stringify({ leagues: [] }), { status: 200 }));
    await fetchPromise;

    expect(store.isLoading).toBe(false);
  });

  it('sets error when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: 'Internal Server Error' }),
    );

    const store = useLeaguesStore();
    await store.fetchLeagues();

    expect(store.leagues).toBeUndefined();
    expect(store.error).toBe('Failed to fetch leagues: Internal Server Error');
    expect(store.isLoading).toBe(false);
  });

  it('sets error when fetch throws a network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

    const store = useLeaguesStore();
    await store.fetchLeagues();

    expect(store.leagues).toBeUndefined();
    expect(store.error).toBe('Network failure');
    expect(store.isLoading).toBe(false);
  });

  it('sets a generic error message for non-Error throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('unexpected string error');

    const store = useLeaguesStore();
    await store.fetchLeagues();

    expect(store.error).toBe('An unknown error occurred');
  });

  it('clears a previous error before a new fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('First error'));

    const store = useLeaguesStore();
    await store.fetchLeagues();
    expect(store.error).toBe('First error');

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ leagues: [] }), { status: 200 }),
    );
    await store.fetchLeagues();

    expect(store.error).toBeNull();
  });

  describe('sports computed', () => {
    it('returns a unique list of sports from leagues', async () => {
      const leagues = [
        fakeLeague({ strSport: 'Soccer' }),
        fakeLeague({ idLeague: '2', strSport: 'Basketball' }),
        fakeLeague({ idLeague: '3', strSport: 'Soccer' }), // duplicate
      ];

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ leagues }), { status: 200 }),
      );

      const store = useLeaguesStore();
      await store.fetchLeagues();

      expect(store.sports).toEqual(['Soccer', 'Basketball']);
    });

    it('returns an empty array before leagues are loaded', () => {
      const store = useLeaguesStore();

      expect(store.sports).toEqual([]);
    });
  });
});
