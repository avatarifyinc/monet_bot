import { createApp } from 'vue';

import './styles/styles.scss';

import { AlertsPlugin } from '@/ui/plugins/alerts';

import App from './App.vue';
import { router } from './router';

createApp(App).use(router).use(AlertsPlugin).mount('#app');
