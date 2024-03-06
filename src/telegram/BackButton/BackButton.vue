<template>
  <slot />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

import { useTelegramSdk } from '@/telegram/use/sdk';

import { BackButtonEmits } from './BackButton.props';

const emit = defineEmits<BackButtonEmits>();

const sdk = useTelegramSdk();

const tgBackButton = sdk.BackButton;

const onClick = () => {
  emit('onClick');
};

onMounted(() => {
  tgBackButton.show();
  tgBackButton.onClick(onClick);
});

onBeforeUnmount(() => {
  tgBackButton.hide();
  tgBackButton.offClick(onClick);
});
</script>
