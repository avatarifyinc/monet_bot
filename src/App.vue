<template>
  <root>
    <back-button v-if="showBackButton" @on-click="onBackButton" />

    <div style="isolation: isolate">
      <router-view />
    </div>
  </root>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { MissUrlErrorAlert } from '@/components/MissUrlErrorAlert';
import { BackButton } from '@/telegram/BackButton';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { useTheme } from '@/telegram/use/theme';
import { Root } from '@/ui/Root';
import { noop } from '@/ui/utility/noop';

import { SUBMIT_STATE } from './tokens';
import { useAlerts } from './ui/use/alerts';
import { useApi } from './use/useApi';

const sdk = useTelegramSdk();

const api = useApi();
const alertsService = useAlerts();
const router = useRouter();
const route = useRoute();
const theme = useTheme();

const submitState = ref({});

provide(SUBMIT_STATE, submitState);

onMounted(() => {
  document.body.onclick = noop;

  sdk.expand();
  sdk.ready();
});

const showBackButton = computed(() => {
  const value = router.currentRoute.value;

  if (value.path === '/') {
    return false;
  }

  return true;
});

const onBackButton = () => {
  const hasHistory = window.history.length > 2;

  if (hasHistory) {
    router.back();
  } else {
    router.replace({ path: '/', query: route.query });
  }
};

const setThemeAttribute = (theme: 'dark' | 'light') => {
  document.documentElement.setAttribute('data-theme', theme);
};

let urlMissTimeout: ReturnType<typeof setTimeout> | null = null;
let missUrlAlert: string | null = null;
let autocloseTimeout: ReturnType<typeof setTimeout> | null = null;

onBeforeUnmount(() => {
  if (urlMissTimeout) {
    clearTimeout(urlMissTimeout);
    urlMissTimeout = null;
  }

  if (autocloseTimeout) {
    clearTimeout(autocloseTimeout);
    autocloseTimeout = null;
  }
});

watch(theme, setThemeAttribute, { immediate: true });
watch(
  () => route.query,
  (value) => {
    if (typeof value.generation_id === 'string') {
      submitState.value = {
        ...submitState.value,
        generation_id: value.generation_id,
      };
    }

    if (typeof value.mask_generation_id === 'string') {
      submitState.value = {
        ...submitState.value,
        mask_generation_id: value.mask_generation_id,
      };
    }

    if (typeof value.url === 'string') {
      const f = value.url;
      const q = new URLSearchParams();

      Object.keys(value).forEach((item) => {
        if (item.startsWith('X-Amz')) {
          q.set(item, (value as any)[item]);
        }
      });

      submitState.value = {
        ...submitState.value,
        url: `${f}&${q.toString()}`,
      };

      if (urlMissTimeout) {
        clearTimeout(urlMissTimeout);
        urlMissTimeout = null;

        if (missUrlAlert) {
          alertsService.close(missUrlAlert);
        }
      }
    } else {
      if (urlMissTimeout) {
        clearTimeout(urlMissTimeout);
        urlMissTimeout = null;

        if (missUrlAlert) {
          alertsService.close(missUrlAlert);
        }
      }

      if (!import.meta.env.PROD) {
        return;
      }

      urlMissTimeout = setTimeout(() => {
        missUrlAlert = alertsService.show(MissUrlErrorAlert, {
          type: 'error',
          autoClose: 5000,
          onClose: () => {
            if (autocloseTimeout) {
              clearTimeout(autocloseTimeout);
              autocloseTimeout = null;
            }

            api.askForImage
              .execute()
              .catch(() => null)
              .finally(() => {
                sdk.close();
              });
          },
        });

        autocloseTimeout = setTimeout(() => {
          api.askForImage
            .execute()
            .catch(() => null)
            .finally(() => {
              sdk.close();
            });
        }, 5000);
      }, 1000);
    }
  },
  { immediate: true }
);
</script>
