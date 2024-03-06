import { RouteRecordRaw } from 'vue-router';

export const drawRoute: RouteRecordRaw = {
  path: '/canvas/draw',
  component: () => import('@/pages/Canvas/views/Draw/views/Draw.vue'),
};
