<template>
  <slot v-if="!isDev" />
  <button v-else @click="onClick">{{ text }}</button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, toRefs, watch } from 'vue';

import { useTelegramSdk } from '@/telegram/use/sdk';

import { MainButtonEmits, MainButtonProps } from './MainButton.props';

const isDev = import.meta.env.DEV;

const props = defineProps<MainButtonProps>();

const emit = defineEmits<MainButtonEmits>();

const { text, color, textColor, disabled, progress, keepAlive, haptic } =
  toRefs(props);

const sdk = useTelegramSdk();

const TgMainButton = sdk.MainButton;

const onClick = () => {
  const _haptic = haptic?.value;

  if (_haptic) {
    sdk.HapticFeedback.impactOccurred(_haptic);
  }

  emit('onClick');
};

onMounted(() => {
  TgMainButton.onClick(onClick);
});

onBeforeUnmount(() => {
  TgMainButton.offClick(onClick);

  if (!keepAlive.value) {
    TgMainButton.hide();
  }
});

watch(
  [disabled, progress],
  ([_disabled, _progress]) => {
    _progress ? TgMainButton.showProgress() : TgMainButton.hideProgress();

    _disabled || _progress ? TgMainButton.disable() : TgMainButton.enable();
  },
  { immediate: true }
);

watch(
  [textColor, color],
  () => {
    TgMainButton.setParams({
      color: color?.value,
      text_color: textColor?.value,
    });
  },
  { immediate: true }
);

watch(
  text,
  (_text) => {
    if (!_text) {
      TgMainButton.isVisible && TgMainButton.hide();

      return;
    }

    TgMainButton.setText(_text);
    !TgMainButton.isVisible && TgMainButton.show();
  },
  { immediate: true }
);
</script>
