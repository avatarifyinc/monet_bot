<template>
  <button
    class="tok-button"
    :data-appearance="appearance"
    :data-size="size"
    :disabled="disabled"
  >
    <svg-icon v-if="icon" :name="icon" :size="iconSize" />

    <slot />
  </button>
</template>

<script setup lang="ts">
import { SvgIcon } from '@/ui/SvgIcon';

import { FlatButtonDefaultProps, FlatButtonProps } from './FlatButton.props';

withDefaults(defineProps<FlatButtonProps>(), FlatButtonDefaultProps);
</script>

<style lang="scss" scope>
@import '@/styles/local.scss';

.tok-button {
  @include clearbutton;
  @include transition(background-color);

  transition-property: background-color, opacity, color;

  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  box-sizing: border-box;

  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-decoration: none;
  outline: none;

  cursor: pointer;

  &[data-size='m'] {
    height: var(--tok-height-m);
    font: var(--tok-font-xs);
  }

  &[data-appearance='primary'] {
    background: transparent;
    color: var(--tok-primary);
  }

  &[data-appearance='flat'] {
    background: transparent;
    color: var(--tok-text-color-48);
  }

  @include hover {
    opacity: var(--tok-hover-opacity);
  }

  &:active {
    opacity: var(--tok-hover-opacity);
  }

  &:disabled {
    pointer-events: none;
    opacity: var(--tok-disabled-opacity);
  }
}
</style>
