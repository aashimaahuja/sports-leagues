import type { Page, Route } from 'playwright/test';
import type { ApiLeague, ApiSeason } from 'src/types/league';

// ─── Data factories ────────────────────────────────────────────────────────────

export const fakeLeague = (overrides: Partial<ApiLeague> = {}): ApiLeague => ({
  idLeague: '4328',
  strLeague: 'English Premier League',
  strSport: 'Soccer',
  strLeagueAlternate: 'EPL',
  ...overrides,
});

export const fakeSeason = (overrides: Partial<ApiSeason> = {}): ApiSeason => ({
  strSeason: '2023-24',
  strBadge: 'https://example.com/badge.png',
  ...overrides,
});

// ─── Route helpers ─────────────────────────────────────────────────────────────

/**
 * Intercept the leagues list API and respond with the provided leagues.
 */
export async function mockLeaguesApi(page: Page, leagues: ApiLeague[]): Promise<void> {
  await page.route('**/all_leagues.php', (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ leagues }),
    }),
  );
}

/**
 * Intercept the leagues list API and respond with a server error.
 */
export async function mockLeaguesApiError(page: Page): Promise<void> {
  await page.route('**/all_leagues.php', (route: Route) =>
    route.fulfill({ status: 500, body: 'Internal Server Error' }),
  );
}

/**
 * Intercept the season badge API for a specific league and respond with
 * the provided seasons. Pass an empty array to simulate "no badge".
 */
export async function mockSeasonBadgeApi(
  page: Page,
  leagueId: string,
  seasons: ApiSeason[],
): Promise<void> {
  await page.route(`**/search_all_seasons.php?badge=1&id=${leagueId}`, (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ seasons }),
    }),
  );
}

/**
 * Intercept the season badge API for a specific league and respond with
 * a server error.
 */
export async function mockSeasonBadgeApiError(page: Page, leagueId: string): Promise<void> {
  await page.route(`**/search_all_seasons.php?badge=1&id=${leagueId}`, (route: Route) =>
    route.fulfill({ status: 500, body: 'Internal Server Error' }),
  );
}

/**
 * Intercept the leagues list API and stall indefinitely so we can assert
 * on the loading spinner before fulfilling.
 */
export async function delayLeaguesApi(
  page: Page,
  leagues: ApiLeague[],
): Promise<() => void> {
  let resolve!: () => void;
  const gate = new Promise<void>((r) => (resolve = r));

  await page.route('**/all_leagues.php', async (route: Route) => {
    await gate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ leagues }),
    });
  });

  return resolve;
}

/**
 * Intercept the season badge API and stall indefinitely so we can assert
 * on the loading spinner before fulfilling.
 */
export async function delaySeasonBadgeApi(
  page: Page,
  leagueId: string,
  seasons: ApiSeason[],
): Promise<() => void> {
  let resolve!: () => void;
  const gate = new Promise<void>((r) => (resolve = r));

  await page.route(`**/search_all_seasons.php?badge=1&id=${leagueId}`, async (route: Route) => {
    await gate;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ seasons }),
    });
  });

  return resolve;
}

