import { Component, inject } from 'vue';

import { AlertHostParams, ALERTS_HOST_TOKEN } from '@/ui/tokens';
import { getElementId } from '@/ui/utility/getElementId';
import { tryOnBeforeUnmount } from '@/ui/utility/tryOnBeforeUnmount';

type Config = {
  autoCloseOnUnmount: boolean;
};

export function useAlerts(config?: Config) {
  const instance = inject(ALERTS_HOST_TOKEN, null);

  if (instance === null) {
    console.warn('[useAlerts] You should add AlertsPlugin into your main.ts');
  }

  const showedIds: string[] = [];

  const show = <T>(
    content: string | Component,
    params?: AlertHostParams<T>
  ) => {
    const id = getElementId();

    instance?.show(id, content, params);

    if (config?.autoCloseOnUnmount) {
      showedIds.push(id);
    }

    return id;
  };

  const close = (id?: string) => {
    if (!id) {
      closeLast();

      return;
    }

    instance?.close(id);
  };

  const closeLast = () => {
    instance?.closeLast();
  };

  tryOnBeforeUnmount(() => {
    showedIds.forEach(close);
  });

  return {
    show,
    close,
    closeLast,
  };
}
