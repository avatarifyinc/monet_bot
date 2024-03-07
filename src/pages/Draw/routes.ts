import { RouteRecordRaw } from 'vue-router';

export const drawRoute: RouteRecordRaw = {
  path: '/draw',
  component: () => import('./Draw.vue'),
};
