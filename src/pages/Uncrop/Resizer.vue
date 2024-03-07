<template>
  <div :class="$style.wrapper">
    <slot />

    <button v-drag="lt" :class="[$style.button, $style.button_lt]" />

    <button v-drag="rt" :class="[$style.button, $style.button_rt]" />

    <button v-drag="bl" :class="[$style.button, $style.button_bl]" />

    <button v-drag="br" :class="[$style.button, $style.button_br]" />
  </div>
</template>

<script setup lang="ts">
import { DragDirective as vDrag } from './Drag.directive';

const m = {
  lt: [-1, -1],
  rt: [1, -1],
  bl: [-1, 1],
  br: [1, 1],
} as const;

const emit = defineEmits<{
  (e: 'sizeChanged', type: keyof typeof m, diff: [number, number]): void;
}>();

const onResize = (type: keyof typeof m) => {
  const [sx, sy] = m[type];

  return ([x, y]: [number, number]) => {
    emit('sizeChanged', type, [x * sx, y * sy]);
  };
};

const lt = {
  onEvent: onResize('lt'),
};

const rt = {
  onEvent: onResize('rt'),
};

const bl = {
  onEvent: onResize('bl'),
};

const br = {
  onEvent: onResize('br'),
};
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

.wrapper {
  position: relative;
  display: inline-flex;
  outline: 4px solid var(--tok-background-color);
  user-select: none;
  touch-action: none;
}

.button {
  @include clearbutton;
  @include transition(opacity);

  position: absolute;
  padding: 1rem;

  &:before {
    position: absolute;
    content: '';
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    background: var(--tok-background-color);
  }

  &_lt {
    left: 0;
    top: 0;

    transform: translate(-50%, -50%);

    cursor: nwse-resize;
  }

  &_rt {
    right: 0;
    top: 0;

    transform: translate(50%, -50%);

    cursor: nesw-resize;
  }

  &_bl {
    left: 0;
    bottom: 0;

    transform: translate(-50%, 50%);

    cursor: nesw-resize;
  }

  &_br {
    right: 0;
    bottom: 0;

    transform: translate(50%, 50%);

    cursor: nwse-resize;
  }

  @include hover {
    opacity: var(--tok-hover-opacity);
  }
}
</style>
