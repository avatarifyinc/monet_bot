import { createApp } from 'vue';

import './styles/styles.scss';

import { AlertsPlugin } from '@/ui/plugins/alerts';

import App from './App.vue';
import { router } from './router';
import { store } from './store';

createApp(App).use(store).use(router).use(AlertsPlugin).mount('#app');
