import { test, expect } from '@playwright/experimental-ct-vue';
import LeagueSeasonBadge from './LeagueSeasonBadge.vue';
import type { ApiSeason } from 'src/types/league';

const fakeSeason = (overrides: Partial<ApiSeason> = {}): ApiSeason => ({
  strSeason: '2023-24',
  strBadge: 'https://example.com/badge.png',
  ...overrides,
});

const baseProps = {
  leagueName: 'English Premier League',
  isLoading: false,
  error: null,
  seasonBadge: null,
};

test.describe('LeagueSeasonBadge', () => {
  test.describe('loading state', () => {
    test('renders the spinner when isLoading is true', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, isLoading: true },
      });

      await expect(component.getByTestId('spinner')).toBeAttached();
    });

    test('does not render the spinner when isLoading is false', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, isLoading: false },
      });

      await expect(component.getByTestId('spinner')).not.toBeAttached();
    });
  });

  test.describe('error state', () => {
    test('renders the error state when an error is provided', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, error: new Error('Failed to fetch season badge') },
      });

      await expect(component.getByTestId('error-state')).toBeAttached();
    });

    test('renders the error message text', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, error: new Error('Failed to fetch season badge') },
      });

      await expect(component.getByTestId('error-state')).toHaveText('Failed to fetch season badge');
    });

    test('does not render the error state when there is no error', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, error: null },
      });

      await expect(component.getByTestId('error-state')).not.toBeAttached();
    });
  });

  test.describe('badge state', () => {
    test('renders the badge image when a season with a badge is provided', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: fakeSeason() },
      });

      await expect(component.getByTestId('badge-image')).toBeVisible();
    });

    test('sets the correct src on the badge image', async ({ mount }) => {
      const season = fakeSeason({ strBadge: 'https://example.com/badge.png' });
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: season },
      });

      await expect(component.getByTestId('badge-image')).toHaveAttribute(
        'src',
        'https://example.com/badge.png',
      );
    });

    test('sets the correct alt text on the badge image', async ({ mount }) => {
      const season = fakeSeason({ strSeason: '2023-24' });
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, leagueName: 'English Premier League', seasonBadge: season },
      });

      await expect(component.getByTestId('badge-image')).toHaveAttribute(
        'alt',
        'English Premier League – 2023-24 badge',
      );
    });

    test('renders the season label', async ({ mount }) => {
      const season = fakeSeason({ strSeason: '2023-24' });
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: season },
      });

      await expect(component.getByTestId('season-label')).toHaveText('2023-24');
    });

    test('does not render the badge image when strBadge is null', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: fakeSeason({ strBadge: null }) },
      });

      await expect(component.getByTestId('badge-image')).not.toBeAttached();
    });
  });

  test.describe('empty state', () => {
    test('renders the no-badge message when seasonBadge is null', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: null },
      });

      await expect(component.getByTestId('no-badge-message')).toHaveText(
        'No season badge available for this league.',
      );
    });

    test('renders the no-badge message when seasonBadge is undefined', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: undefined },
      });

      await expect(component.getByTestId('no-badge-message')).toBeAttached();
    });

    test('does not render the no-badge message when a badge is present', async ({ mount }) => {
      const component = await mount(LeagueSeasonBadge, {
        props: { ...baseProps, seasonBadge: fakeSeason() },
      });

      await expect(component.getByTestId('no-badge-message')).not.toBeAttached();
    });
  });
});
