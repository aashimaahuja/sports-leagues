import { createRouter, createWebHistory } from 'vue-router';
import LeaguesView from 'src/views/LeaguesView.vue';
import LeagueDetailView from 'src/views/LeagueDetailView.vue';
import { RouteNames } from 'src/router/routeNames';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.Leagues,
      component: LeaguesView,
    },
    {
      path: '/leagues/:id',
      name: RouteNames.LeagueDetail,
      component: LeagueDetailView,
    },
  ],
});

export default router;
