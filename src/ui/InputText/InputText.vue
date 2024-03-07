<template>
  <label
    ref="nativeRef"
    :for="id"
    class="tok-input"
    :data-size="size"
    :data-state="state"
  >
    <slot name="left" />

    <div class="wrapper">
      <input
        :id="id"
        class="native"
        :placeholder="placeholder"
        :type="type"
        :name="name"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :value="modelValue"
        :disabled="!!disabled"
        @input="onUpdate"
      />
    </div>

    <button
      v-if="hasCleaner && modelValue && !disabled"
      tabindex="-1"
      type="button"
      class="icon"
      title="Clear input"
      @click.stop.prevent="onClear"
    >
      <svg-icon name="close" />
    </button>
  </label>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, toRefs, watch } from 'vue';

import { SvgIcon } from '@/ui/SvgIcon';
import { useFocused } from '@/ui/use/focused';
// import { useControlAccess } from '@/ui/use/useControlAccess';
// import { useControlInvalid } from '@/ui/use/useControlInvalid';
import { getElementId } from '@/ui/utility/getElementId';

import {
  InputTextDefaultProps,
  InputTextEmits,
  InputTextProps,
} from './InputText.props';

const props = withDefaults(
  defineProps<InputTextProps<T>>(),
  InputTextDefaultProps
);

const emit = defineEmits<InputTextEmits>();

const { invalid, disabled } = toRefs(props);

const nativeRef = ref<HTMLInputElement | null>(null);

// const controlAccess = useControlAccess();
// const computedInvalid = useControlInvalid(invalid);
const focused = useFocused(nativeRef);
const id = getElementId();

const state = computed(() => {
  if (disabled.value) {
    return 'disabled';
  }

  if (invalid.value) {
    return 'invalid';
  }

  if (focused.value) {
    return 'focused';
  }

  return undefined;
});

// watch(
//   focused,
//   (value, prev) => {
//     if (!!prev && !value) {
//       controlAccess?.markAsTouch();
//     }
//   },
//   { immediate: true }
// );

const onUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  emit('update:modelValue', value || '');
};

const onClear = () => {
  emit('update:modelValue', null);

  focus();
};

const focus = () => {
  nativeRef.value?.focus();
};

// let timeout: ReturnType<typeof setTimeout>;

// The default scroll behavior in the browser isn't enough.
// We must maintain scrolling to this element because
// there seems to be an issue with the layout inside Telegram,
// particularly when the MainButton is visible.
// watch([focused, nativeRef], ([_focused, _native], _, onCleanup) => {
//   onCleanup(() => {
//     timeout && clearTimeout(timeout);
//   });

//   if (_focused && _native) {
//     timeout = setTimeout(() => {
//       _native?.scrollIntoView({
//         behavior: 'smooth',
//       });
//     }, 200);
//   }
// });

watch(
  focused,
  (value) => {
    emit('focus-changed', value);
  },
  { immediate: true }
);

defineExpose({
  focus,
});
</script>

<style lang="scss" scoped>
@import '@/styles/local.scss';

.native {
  @include clearinput;

  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  font-size: inherit;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 0;

  &:readonly {
    text-overflow: ellipsis;
    cursor: pointer;
  }

  &::placeholder {
    color: var(--tok-text-color-48);
  }
}

.tok-input {
  @include transition(all);

  display: flex;
  align-items: center;

  outline: 1px solid var(--tok-text-color-16);
  background: var(--tok-background-color);
  cursor: text;

  // &[data-size='s'] {
  //   height: var(--tok-height-s);
  //   min-height: var(--tok-height-s);
  //   border-radius: var(--tok-radius-s);

  //   font: var(--tok-font-m);

  //   padding-left: var(--tok-padding-s);
  // }

  &[data-size='m'] {
    height: var(--tok-height-m);
    min-height: var(--tok-height-m);
    border-radius: var(--tok-radius-m);

    font: var(--tok-font-m);

    padding-left: var(--tok-padding-m);
  }

  // &[data-size='l'] {
  //   height: var(--tok-height-l);
  //   min-height: var(--tok-height-l);
  //   border-radius: var(--tok-radius-l);

  //   font: var(--tok-font-m);

  //   padding-left: var(--tok-padding-l);
  // }

  &[data-state='focused'] {
    outline-color: var(--tok-primary);
    outline-width: 2px;
    box-shadow: 0px 4px 8px 0px #f6e5640a;
  }

  &[data-state='invalid'] {
    outline-color: var(--tok-error-fill);
    outline-width: 2px;
  }

  &[data-state='disabled'] {
    opacity: var(--tok-disabled-opacity);
    pointer-events: none;
  }
}

.wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  color: var(--tok-text-color);
  border-radius: inherit;
}

.icon {
  @include clearbutton;
  @include transition(all);

  transition-property: color opacity;
  display: flex;
  align-items: center;
  height: inherit;
  padding-left: 0.5em;
  color: var(--tok-text-color-48);
  cursor: pointer;

  @include hover {
    opacity: var(--tok-hover-opacity);
  }

  &:last-child {
    .tok-input[data-size='s'] & {
      padding-right: var(--tok-padding-s);
    }

    .tok-input[data-size='m'] & {
      padding-right: var(--tok-padding-m);
    }

    .tok-input[data-size='l'] & {
      padding-right: var(--tok-padding-l);
    }
  }
}
</style>
