import { App, Plugin } from 'vue';

import { ALERTS_HOST_TOKEN, createAlertsConnector } from '@/ui/tokens';

const install = (app: App) => {
  const connector = createAlertsConnector();

  app.provide(ALERTS_HOST_TOKEN, connector);
};

export const AlertsPlugin: Plugin = {
  install,
};
