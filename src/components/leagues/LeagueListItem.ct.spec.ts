import { test, expect } from '@playwright/experimental-ct-vue';
import LeagueListItem from './LeagueListItem.vue';
import type { ApiLeague } from 'src/types/league';

const fakeLeague = (overrides: Partial<ApiLeague> = {}): ApiLeague => ({
  idLeague: '4328',
  strLeague: 'English Premier League',
  strSport: 'Soccer',
  strLeagueAlternate: 'EPL',
  ...overrides,
});

test.describe('LeagueListItem', () => {
  test('renders the league name', async ({ mount }) => {
    const league = fakeLeague();
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('league-name')).toHaveText('English Premier League');
  });

  test('renders the alternate league name when present', async ({ mount }) => {
    const league = fakeLeague({ strLeagueAlternate: 'EPL' });
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('league-alternate-name')).toHaveText('EPL');
  });

  test('does not render the alternate league name when absent', async ({ mount }) => {
    const league = fakeLeague({ strLeagueAlternate: '' });
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('league-alternate-name')).not.toBeAttached();
  });

  test('renders the country badge with the first two characters of the league name uppercased', async ({
    mount,
  }) => {
    const league = fakeLeague({ strLeague: 'English Premier League' });
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('country-badge')).toHaveText('EN');
  });

  test('renders the sport badge with the sport name', async ({ mount }) => {
    const league = fakeLeague({ strSport: 'Basketball' });
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('sport-badge')).toHaveText('Basketball');
  });

  test('link navigates to the correct league detail route', async ({ mount }) => {
    const league = fakeLeague({ idLeague: '4328' });
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component).toHaveAttribute('href', '/leagues/4328');
  });

  test('renders a chevron icon', async ({ mount }) => {
    const league = fakeLeague();
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component.getByTestId('chevron-icon')).toBeVisible();
  });

  test('applies hover transition styles to the link', async ({ mount }) => {
    const league = fakeLeague();
    const component = await mount(LeagueListItem, { props: { league } });

    await expect(component).toHaveClass(/transition-colors/);
  });
});
