import { test, expect } from '@playwright/experimental-ct-vue';
import LeagueDetailHeader from './LeagueDetailHeader.vue';
import type { ApiLeague } from 'src/types/league';

const fakeLeague = (overrides: Partial<ApiLeague> = {}): ApiLeague => ({
  idLeague: '4328',
  strLeague: 'English Premier League',
  strSport: 'Soccer',
  strLeagueAlternate: 'EPL',
  ...overrides,
});

test.describe('LeagueDetailHeader', () => {
  test('renders the league name', async ({ mount }) => {
    const component = await mount(LeagueDetailHeader, { props: { league: fakeLeague() } });

    await expect(component.getByTestId('league-name')).toHaveText('English Premier League');
  });

  test('renders the alternate league name when present', async ({ mount }) => {
    const component = await mount(LeagueDetailHeader, {
      props: { league: fakeLeague({ strLeagueAlternate: 'EPL' }) },
    });

    await expect(component.getByTestId('league-alternate-name')).toHaveText('EPL');
  });

  test('does not render the alternate league name when absent', async ({ mount }) => {
    const component = await mount(LeagueDetailHeader, {
      props: { league: fakeLeague({ strLeagueAlternate: '' }) },
    });

    await expect(component.getByTestId('league-alternate-name')).not.toBeAttached();
  });

  test('renders the country badge with the first two characters of the league name uppercased', async ({
    mount,
  }) => {
    const component = await mount(LeagueDetailHeader, {
      props: { league: fakeLeague({ strLeague: 'English Premier League' }) },
    });

    await expect(component.getByTestId('country-badge')).toHaveText('EN');
  });

  test('renders the sport badge with the sport name', async ({ mount }) => {
    const component = await mount(LeagueDetailHeader, {
      props: { league: fakeLeague({ strSport: 'Basketball' }) },
    });

    await expect(component.getByTestId('sport-badge')).toHaveText('Basketball');
  });
});

