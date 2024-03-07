import { RouteRecordRaw } from 'vue-router';

export const drawRoute: RouteRecordRaw = {
  path: '/canvas/draw',
  component: () => import('./Draw.vue'),
};
