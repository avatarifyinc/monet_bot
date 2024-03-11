<template>
  <label
    v-hovered="hoveredProps"
    :for="id"
    :class="$style.label"
    :data-state="computedState"
  >
    <div :class="[$style.scroller, expandable && $style.scroller_expandable]">
      <div :class="$style.wrapper">
        <div :class="$style.ghost" aria-hidden="true">
          <span>{{ modelValue }}</span>
          <span :class="$style.carret"></span>
        </div>

        <textarea
          :id="id"
          ref="maskitoNative"
          :value="modelValue || ''"
          :class="$style.native"
          :placeholder="placeholder"
          @input="onUpdate"
        />
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

import { HoveredDirective as vHovered } from '@/ui/directives/hovered';
import { useFocused } from '@/ui/use/focused';

import { getElementId } from '../utility/getElementId';
import {
  InputTextareaDefaultProps,
  InputTextareaProps,
} from './InputTextarea.props';

const props = withDefaults(
  defineProps<InputTextareaProps>(),
  InputTextareaDefaultProps
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const { pseudoFocused, rows } = toRefs(props);
const hovered = ref(false);

const maskitoNative = ref<HTMLElement | null>(null);
const focused = useFocused(maskitoNative);
const id = getElementId();

const computedFocused = computed(() => pseudoFocused.value || focused.value);

const onHover = (value: boolean) => {
  hovered.value = value;
};

const hoveredProps = { onEvent: onHover };

const computedState = computed(() => {
  if (computedFocused.value) {
    return 'focus';
  }

  if (hovered.value) {
    return 'hover';
  }

  return undefined;
});

const onUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  emit('update:modelValue', value);
};
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

.label {
  @include transition(outline-color);

  display: inline-block;

  width: 100%;

  box-sizing: border-box;

  min-height: 160px;

  padding-left: 0.5rem;
  border-radius: var(--tok-radius-m);
  background-color: var(--tok-background-color);
  outline: 1px solid var(--tok-text-color-16);

  cursor: text;

  &[data-state='hover'] {
    outline-color: var(--tok-text-color-32);
    outline-width: 2px;
  }

  &[data-state='focus'] {
    outline-color: var(--tok-primary);
    outline-width: 2px;
  }

  &[data-state='invalid'] {
    outline-color: var(--tok-error-fill);
    outline-width: 2px;
  }
}

.scroller {
  padding-top: 0.25rem;

  box-sizing: border-box;

  min-height: calc(100% - 0.25rem);

  overflow: auto;

  &_expandable {
    max-height: calc(v-bind(rows) * 1em + 0.25em + 1px);
  }
}

.carret {
  display: inline-block;
  height: 1em;
  width: 0;
}

.wrapper {
  position: relative;
  width: calc(100% - 1.5rem);
}

.ghost {
  white-space: pre-wrap;
  word-wrap: break-word;
  pointer-events: none;
  color: transparent;
  overflow: hidden;
}

.native {
  @include clearinput;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  overflow: hidden;
  outline: none;
}
</style>
