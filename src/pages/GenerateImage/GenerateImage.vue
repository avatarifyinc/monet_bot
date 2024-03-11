<template>
  <div :class="$style.wrapper">
    <h1 style="margin-bottom: 0.5rem">Let&rsquo;s imagine</h1>

    <p style="color: var(--tok-text-color-64); margin-bottom: 1rem">
      For example, &laquo;a&nbsp;modern artist controlling a&nbsp;floating
      paintbrush in&nbsp;a&nbsp;whimsical street scene&raquo;
    </p>

    <input-textarea v-model="text" />
  </div>

  <div :class="$style.container">
    <flat-button
      v-for="item in items"
      :key="item.type"
      :appearance="active === item.type ? 'primary' : 'secondary'"
      size="s"
      shape="rounded"
      @click="active = item.type"
    >
      <span style="font-weight: 600">
        {{ item.type }}&nbsp;&bull;&nbsp;{{ item.ratio }}
      </span>
    </flat-button>
  </div>

  <main-button
    color="#007aff"
    text-color="#ffffff"
    text="Generate"
    @on-click="onSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { MainButton } from '@/telegram/MainButton';
import { FlatButton } from '@/ui/FlatButton';
import { InputTextarea } from '@/ui/InputTextarea';

const text = ref('');

const items = [
  {
    type: 'Widescreen',
    ratio: '16:9',
  },
  {
    type: 'Vertical',
    ratio: '9:16',
  },
  {
    type: 'Square',
    ratio: '1:1',
  },
  {
    type: 'Photo',
    ratio: '4:3',
  },
  {
    type: 'Portrait',
    ratio: '4:5',
  },
  {
    type: 'Landscape',
    ratio: '3:2',
  },
  {
    type: 'Cinematic',
    ratio: '21:9',
  },
];

const active = ref(items[0].type);

const onSubmit = () => {
  // todo
};
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

.wrapper {
  padding: 1rem;
  margin-top: 1rem;
}

.container {
  @include hidescroll;

  display: flex;
  flex-wrap: nowrap;

  overflow: auto;

  gap: 0.375rem;
  padding: 0 1rem;
}
</style>
