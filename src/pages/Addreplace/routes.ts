import { RouteRecordRaw } from 'vue-router';

export const addreplaceRoute: RouteRecordRaw = {
  path: '/addreplace',
  component: () => import('./Addreplace.vue'),
};
