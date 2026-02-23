import { beforeMount } from '@playwright/experimental-ct-vue/hooks';
import { createRouter, createMemoryHistory } from 'vue-router';
import { RouteNames } from 'src/router/routeNames';

beforeMount(async ({ app }) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: RouteNames.Leagues,
        component: { template: '<div />' },
      },
      {
        path: '/leagues/:id',
        name: RouteNames.LeagueDetail,
        component: { template: '<div />' },
      },
    ],
  });

  app.use(router);
  await router.isReady();
});

