<template>
  <root>
    <back-button v-if="showBackButton" @on-click="onBackButton" />

    <router-view />
  </root>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { BackButton } from '@/telegram/BackButton';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { useTheme } from '@/telegram/use/theme';
import { Root } from '@/ui/Root';
import { noop } from '@/ui/utility/noop';

const tg = useTelegramSdk();

const router = useRouter();
const theme = useTheme();

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
</script>
