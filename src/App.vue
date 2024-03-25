<template>
  <root>
    <back-button v-if="showBackButton" @on-click="onBackButton" />

    <router-view />
  </root>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BackButton } from '@/telegram/BackButton';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { useTheme } from '@/telegram/use/theme';
import { Root } from '@/ui/Root';
import { noop } from '@/ui/utility/noop';

import { SUBMIT_STATE } from './tokens';

const tg = useTelegramSdk();

const router = useRouter();
const route = useRoute();
const theme = useTheme();

const submitState = ref({});

provide(SUBMIT_STATE, submitState);

onMounted(() => {
  document.body.onclick = noop;

  tg.expand();
  tg.ready();
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
    router.replace('/');
  }
};

const setThemeAttribute = (theme: 'dark' | 'light') => {
  document.documentElement.setAttribute('data-theme', theme);
};

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
    }
  },
  { immediate: true }
);
</script>
