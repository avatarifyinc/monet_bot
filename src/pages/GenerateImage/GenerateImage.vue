<template>
  <div :class="$style.wrapper">
    <h1 style="margin-bottom: 0.5rem">Let&rsquo;s imagine</h1>

    <p style="color: var(--tok-text-color-64); margin-bottom: 1rem">
      For example, &laquo;a&nbsp;modern artist controlling a&nbsp;floating
      paintbrush in&nbsp;a&nbsp;whimsical street scene&raquo;
    </p>

    <main-button
      color="#007aff"
      text-color="#ffffff"
      text="Generate"
      @on-click="onSubmit"
    >
      Generate
    </main-button>
  </div>
</template>

<script setup lang="ts">
import { MainButton } from '@/telegram/MainButton';

const onSubmit = () => {
  // todo
};
</script>

<style lang="scss" module>
.wrapper {
  padding: 0.5rem;
}
</style>
