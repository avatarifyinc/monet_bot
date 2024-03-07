import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import { addreplaceRoute } from './pages/Addreplace/routes';
import { homeRoute } from './pages/routes';
import { uncropRoute } from './pages/Uncrop/routes';

const pages: RouteRecordRaw[] = ([] as RouteRecordRaw[])
  .concat(homeRoute)
  .concat(addreplaceRoute)
  .concat(uncropRoute);

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: ([] as RouteRecordRaw[]).concat(pages).concat({
    path: '/not-found',
    alias: '/:catchAll(.*)*',
    redirect: '/',
  }),
});

router.afterEach((to: RouteLocationNormalized) => {
  if (to.params.savedPosition) {
    return;
  }

  window.scrollTo({ top: 0 });
});

router.onError((error, to) => {
  const dynamicallyImportsError =
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed');

  if (error.name === 'ChunkLoadError' || dynamicallyImportsError) {
    location.href = to.fullPath;
  }
});
