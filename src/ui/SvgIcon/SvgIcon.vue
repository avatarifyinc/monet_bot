<template>
  <span
    :class="[$style.icon, rotate && $style.icon_rotate]"
    :data-name="name"
    :style="style"
  >
    <component
      :is="icon"
      tabindex="-1"
      focusable="false"
      aria-hidden="true"
      width="100%"
      height="100%"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, toRefs } from 'vue';

import { SvgIconProps } from './SvgIcon.props';

const props = defineProps<SvgIconProps>();

const { name, size } = toRefs(props);

const icon = computed(() => {
  const value = name.value;

  return defineAsyncComponent(() => import(`./icons/${value}.svg`));
});

const px = (value: number): string => {
  return `${value}px`;
};

const style = computed(() => {
  const value = size?.value;

  const [width, height] = !value
    ? ['1.5em', '1.5em']
    : typeof value === 'number'
    ? [px(value), px(value)]
    : [px(value[0]), px(value[1])];

  return {
    '--tok-svg-icon-width': width,
    '--tok-svg-icon-height': height,
  };
});
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

.icon {
  @include size(
    var(--tok-svg-icon-width, 1rem),
    var(--tok-svg-icon-height, 1rem)
  );
  @include transition(transform);

  display: inline-flex;
  align-items: center;

  &_rotate {
    transform: rotate(180deg);
  }

  &[data-name='spinner'] {
    animation: tokSpinnerRotate 4s linear infinite;
  }
}

@keyframes tokSpinnerRotate {
  $initial-shift: rotate(-90deg);

  0% {
    transform: $initial-shift;
  }

  100% {
    transform: $initial-shift rotate(4turn);
  }
}
</style>
