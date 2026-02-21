import { test, expect } from 'playwright/test';
import {
  fakeLeague,
  mockLeaguesApi,
  mockLeaguesApiError,
  delayLeaguesApi,
} from './fixtures';

test.describe('Leagues list page', () => {
  test('shows a loading spinner while leagues are being fetched', async ({ page }) => {
    const releaseGate = await delayLeaguesApi(page, [fakeLeague()]);

    await page.goto('/');

    await expect(page.locator('.animate-spin').first()).toBeVisible();

    releaseGate();

    await expect(page.locator('.animate-spin').first()).not.toBeVisible();
    await expect(page.getByTestId('league-name').first()).toBeVisible();
  });

  test('renders a row for each league returned by the API', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League' }),
      fakeLeague({ idLeague: '2', strLeague: 'La Liga' }),
      fakeLeague({ idLeague: '3', strLeague: 'Bundesliga' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');

    const items = page.getByTestId('league-name');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveText('Premier League');
    await expect(items.nth(1)).toHaveText('La Liga');
    await expect(items.nth(2)).toHaveText('Bundesliga');
  });

  test('displays the correct league count label', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League' }),
      fakeLeague({ idLeague: '2', strLeague: 'La Liga' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');

    await expect(page.getByText('2 leagues found')).toBeVisible();
  });

  test('uses singular "league" in the count label when only one result', async ({ page }) => {
    await mockLeaguesApi(page, [fakeLeague({ idLeague: '1', strLeague: 'Premier League' })]);

    await page.goto('/');

    await expect(page.getByText('1 league found')).toBeVisible();
  });

  test('filters leagues by primary name as the user types', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League', strLeagueAlternate: '' }),
      fakeLeague({ idLeague: '2', strLeague: 'La Liga', strLeagueAlternate: '' }),
      fakeLeague({ idLeague: '3', strLeague: 'Bundesliga', strLeagueAlternate: '' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');
    await page.getByPlaceholder('Search leagues...').fill('liga');

    await expect(page.getByTestId('league-name')).toHaveCount(2);
    await expect(page.getByTestId('league-name').nth(0)).toHaveText('La Liga');
    await expect(page.getByTestId('league-name').nth(1)).toHaveText('Bundesliga');
  });

  test('filters leagues by alternate name as the user types', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'English Premier League', strLeagueAlternate: 'EPL' }),
      fakeLeague({ idLeague: '2', strLeague: 'La Liga', strLeagueAlternate: 'LL' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');
    await page.getByPlaceholder('Search leagues...').fill('EPL');

    await expect(page.getByTestId('league-name')).toHaveCount(1);
    await expect(page.getByTestId('league-name').first()).toHaveText('English Premier League');
  });

  test('filters leagues by sport using the sport dropdown', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League', strSport: 'Soccer' }),
      fakeLeague({ idLeague: '2', strLeague: 'NBA', strSport: 'Basketball' }),
      fakeLeague({ idLeague: '3', strLeague: 'La Liga', strSport: 'Soccer' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');
    await page.getByTestId('sport-filter-select').selectOption('Basketball');

    await expect(page.getByTestId('league-name')).toHaveCount(1);
    await expect(page.getByTestId('league-name').first()).toHaveText('NBA');
  });

  test('applies both search and sport filter simultaneously', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League', strSport: 'Soccer', strLeagueAlternate: '' }),
      fakeLeague({ idLeague: '2', strLeague: 'NBA', strSport: 'Basketball', strLeagueAlternate: '' }),
      fakeLeague({ idLeague: '3', strLeague: 'La Liga', strSport: 'Soccer', strLeagueAlternate: '' }),
      fakeLeague({ idLeague: '4', strLeague: 'NFL', strSport: 'American Football', strLeagueAlternate: '' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');
    await page.getByTestId('sport-filter-select').selectOption('Soccer');
    await page.getByPlaceholder('Search leagues...').fill('liga');

    await expect(page.getByTestId('league-name')).toHaveCount(1);
    await expect(page.getByTestId('league-name').first()).toHaveText('La Liga');
  });

  test('shows an empty state message when no leagues match the search', async ({ page }) => {
    const leagues = [
      fakeLeague({ idLeague: '1', strLeague: 'Premier League', strLeagueAlternate: '' }),
    ];
    await mockLeaguesApi(page, leagues);

    await page.goto('/');
    await page.getByPlaceholder('Search leagues...').fill('zzznomatch');

    await expect(page.getByText('No leagues match your search.')).toBeVisible();
    await expect(page.getByTestId('league-name')).toHaveCount(0);
  });

  test('shows no league rows and no count label when the API call fails', async ({ page }) => {
    await mockLeaguesApiError(page);

    await page.goto('/');

    await expect(page.getByTestId('league-name')).toHaveCount(0);
    await expect(page.getByText(/leagues? found/)).not.toBeVisible();
  });
});

