import { test, expect } from 'playwright/test';
import {
  fakeLeague,
  fakeSeason,
  mockLeaguesApi,
  mockSeasonBadgeApi,
  mockSeasonBadgeApiError,
  delaySeasonBadgeApi,
} from './fixtures';

const LEAGUE_ID = '4328';

test.describe('League detail page', () => {
  test('renders the league name, country badge and sport badge in the header', async ({ page }) => {
    const league = fakeLeague({
      idLeague: LEAGUE_ID,
      strLeague: 'English Premier League',
      strSport: 'Soccer',
    });
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApi(page, LEAGUE_ID, [fakeSeason()]);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page.getByRole('heading', { name: 'English Premier League' })).toBeVisible();
    await expect(page.getByText('EN', { exact: true })).toBeVisible();
    await expect(page.getByText('Soccer')).toBeVisible();
  });

  test('shows a spinner while the season badge is loading', async ({ page }) => {
    const league = fakeLeague({ idLeague: LEAGUE_ID });
    await mockLeaguesApi(page, [league]);
    const releaseGate = await delaySeasonBadgeApi(page, LEAGUE_ID, [fakeSeason()]);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page.locator('.animate-spin').first()).toBeVisible();

    releaseGate();

    await expect(page.locator('.animate-spin').first()).not.toBeVisible();
  });

  test('renders the season badge image and season label when the API returns a badge', async ({
    page,
  }) => {
    const league = fakeLeague({ idLeague: LEAGUE_ID, strLeague: 'English Premier League' });
    const season = fakeSeason({ strSeason: '2023-24', strBadge: 'https://example.com/badge.png' });
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApi(page, LEAGUE_ID, [season]);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    const badgeImg = page.getByAltText('English Premier League – 2023-24 badge');
    await expect(badgeImg).toBeVisible();
    await expect(badgeImg).toHaveAttribute('src', 'https://example.com/badge.png');
    await expect(page.getByText('2023-24')).toBeVisible();
  });

  test('shows "No season badge available" when the API returns no seasons with a badge', async ({
    page,
  }) => {
    const league = fakeLeague({ idLeague: LEAGUE_ID });
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApi(page, LEAGUE_ID, [
      fakeSeason({ strBadge: null }),
      fakeSeason({ strSeason: '2022-23', strBadge: null }),
    ]);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page.getByText('No season badge available for this league.')).toBeVisible();
  });

  test('shows "No season badge available" when the API returns an empty seasons array', async ({
    page,
  }) => {
    const league = fakeLeague({ idLeague: LEAGUE_ID });
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApi(page, LEAGUE_ID, []);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page.getByText('No season badge available for this league.')).toBeVisible();
  });

  test('shows an error message when the season badge API fails', async ({ page }) => {
    const league = fakeLeague({ idLeague: LEAGUE_ID });
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApiError(page, LEAGUE_ID);

    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page.getByText('Failed to fetch seasons: Internal Server Error')).toBeVisible();
  });

  test('shows "League not found" when navigating to a non-existent league ID', async ({ page }) => {
    await mockLeaguesApi(page, [fakeLeague({ idLeague: '9999' })]);
    await mockSeasonBadgeApi(page, 'UNKNOWN', []);

    await page.goto('/leagues/UNKNOWN');

    await expect(page.getByText('League not found.')).toBeVisible();
  });
});

