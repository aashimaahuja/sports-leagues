import { test, expect } from '@playwright/experimental-ct-vue';
import SportFilterSelect from './SportFilterSelect.vue';
import { ALL_SPORTS } from 'src/constants/constants';

const SPORTS = ['Soccer', 'Basketball', 'Tennis'];

test.describe('SportFilterSelect', () => {
  test('renders the default option', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    const select = component.getByTestId('sport-filter-select');
    await expect(select.locator(`option[value="${ALL_SPORTS}"]`)).toHaveText(ALL_SPORTS);
  });

  test('renders all provided sport options', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    const select = component.getByTestId('sport-filter-select');
    for (const sport of SPORTS) {
      await expect(select.locator(`option[value="${sport}"]`)).toHaveText(sport);
    }
  });

  test('renders no extra options beyond "All Sports" when options prop is empty', async ({
    mount,
  }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: [] },
    });

    const options = component.getByTestId('sport-filter-select').locator('option');
    await expect(options).toHaveCount(1);
  });

  test('renders correct total option count including "All Sports"', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    const options = component.getByTestId('sport-filter-select').locator('option');
    await expect(options).toHaveCount(SPORTS.length + 1);
  });

  test('defaults to "All Sports" when no modelValue is provided', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    await expect(component.getByTestId('sport-filter-select')).toHaveValue(ALL_SPORTS);
  });

  test('reflects the provided modelValue as the selected option', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS, modelValue: 'Basketball' },
    });

    await expect(component.getByTestId('sport-filter-select')).toHaveValue('Basketball');
  });

  test('emits update:modelValue with the selected sport when the user changes the selection', async ({
    mount,
  }) => {
    const emittedValues: string[] = [];

    const component = await mount(SportFilterSelect, {
      props: {
        options: SPORTS,
        modelValue: ALL_SPORTS,
        'onUpdate:modelValue': (val: string | undefined) => emittedValues.push(val ?? ''),
      },
    });

    await component.getByTestId('sport-filter-select').selectOption('Soccer');
    expect(emittedValues).toContain('Soccer');
  });

  test('emits update:modelValue with "All Sports" when the user resets the selection', async ({
    mount,
  }) => {
    const emittedValues: string[] = [];

    const component = await mount(SportFilterSelect, {
      props: {
        options: SPORTS,
        modelValue: 'Tennis',
        'onUpdate:modelValue': (val: string | undefined) => emittedValues.push(val ?? ''),
      },
    });

    await component.getByTestId('sport-filter-select').selectOption(ALL_SPORTS);
    expect(emittedValues).toContain(ALL_SPORTS);
  });

  test('renders the chevron icon', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    await expect(component.getByTestId('chevron-icon')).toBeAttached();
  });

  test('applies appearance-none and cursor-pointer styles to the select', async ({ mount }) => {
    const component = await mount(SportFilterSelect, {
      props: { options: SPORTS },
    });

    const select = component.getByTestId('sport-filter-select');
    await expect(select).toHaveClass(/appearance-none/);
    await expect(select).toHaveClass(/cursor-pointer/);
  });
});
