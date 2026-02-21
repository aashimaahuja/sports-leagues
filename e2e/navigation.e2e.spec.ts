import { test, expect } from 'playwright/test';
import { fakeLeague, fakeSeason, mockLeaguesApi, mockSeasonBadgeApi } from './fixtures';

const LEAGUE_ID = '4328';

const league = fakeLeague({ idLeague: LEAGUE_ID, strLeague: 'English Premier League' });

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockLeaguesApi(page, [league]);
    await mockSeasonBadgeApi(page, LEAGUE_ID, [fakeSeason()]);
  });

  test('clicking a league row navigates to the league detail page', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('league-name').first().click();

    await expect(page).toHaveURL(`/leagues/${LEAGUE_ID}`);
    await expect(page.getByRole('heading', { name: 'English Premier League' })).toBeVisible();
  });

  test('the "Back to leagues" link returns to the leagues list', async ({ page }) => {
    await page.goto(`/leagues/${LEAGUE_ID}`);

    await page.getByRole('link', { name: /Back to leagues/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('league-name').first()).toBeVisible();
  });

  test('visiting a league detail URL directly renders the detail page', async ({ page }) => {
    await page.goto(`/leagues/${LEAGUE_ID}`);

    await expect(page).toHaveURL(`/leagues/${LEAGUE_ID}`);
    await expect(page.getByRole('heading', { name: 'English Premier League' })).toBeVisible();
  });
});

