<template>
  <input
    ref="native"
    type="range"
    :value="modelValue"
    :style="style"
    :class="$style.slider"
    :min="min"
    :max="max"
    :step="step"
    @input="onChange"
  />
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    max?: number;
    min?: number;
    step?: number;
    segments?: number;
  }>(),
  {
    modelValue: 0,
    max: 5,
    min: 0,
    step: 1,
    segments: 5,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const { segments, min, max, modelValue } = toRefs(props);

const native = ref<HTMLInputElement | null>(null);

const style = computed(() => {
  const segs = segments.value;
  const _min = min.value;
  const _max = max.value;
  const value = modelValue.value;

  return {
    '--tok-slider-track-color': 'var(--tok-text-color-16)',
    '--tok-slider-fill-percentage': `${
      (100 * (value - _min)) / (_max - _min) || 0
    }%`,
    '--tok-slider-segment-width': `${100 / Math.max(1, segs)}%`,
  };
});

const onChange = (event: any) => {
  emit('update:modelValue', Number(event.target.value));
};
</script>

<style lang="scss" module>
@import '@/styles/local.scss';

$track-height: 0.3125rem;
$ticks-thickness: 0.4rem;

$track-color: var(--tok-slider-track-color);
$thumb-color: var(--tok-primary);

/* Vertically centers thumb on the track (webkit only) */
@mixin vertically-align-thumb($size) {
  margin-top: calc(($track-height / 2) - (1rem / 2));
}

@mixin customize-track($progress-filling, $thumb-width) {
  height: $track-height;
  border-radius: inherit;

  /*
    The most left point of the track is the most left point of the thumb (at the zero-position).
    The first tick should start at the center of thumb to set correct position for all other ticks.
    */
  $first-tick-offset: calc(($thumb-width - $ticks-thickness) / 2);
  $ticks-background-size: calc(100% - $thumb-width);

  $hide-first-tick: linear-gradient(
    to right,
    $thumb-color 0px ($first-tick-offset + $ticks-thickness),
    transparent $ticks-thickness
  );
  $ticks-gradient: repeating-linear-gradient(
    to right,
    var(--tok-text-color-16) 0 $ticks-thickness,
    transparent 0 var(--tok-slider-segment-width)
  );
  $filling-progress-gradient: linear-gradient(
    to right,
    $thumb-color var(--tok-slider-fill-percentage),
    transparent var(--tok-slider-fill-percentage)
  );
  background-repeat: no-repeat;
  background-color: $track-color;

  @if $progress-filling == fill {
    background-image: $hide-first-tick, $ticks-gradient,
      $filling-progress-gradient;
    background-position-x: 0, $first-tick-offset, 0;
    background-size: $ticks-background-size, $ticks-background-size, auto;
  }

  @if $progress-filling == notfill {
    background-image: $hide-first-tick, $ticks-gradient;
    background-position-x: 0, $first-tick-offset;
    background-size: $ticks-background-size;
  }
}

@mixin customize-thumb($size) {
  appearance: none;
  background-color: $thumb-color;
  border: none;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  transform: scale(1.4);
  box-shadow: 0px 9px 24px 0px #00000029;

  &:not(:disabled) {
    cursor: ew-resize;

    @include hover {
      opacity: var(--tok-hover-opacity);
    }
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px inset var(--tok-text-color);
  }
}

.slider {
  display: block;
  width: 100%;
  color: var(--tok-primary);
  cursor: pointer;

  &:active {
    cursor: ew-resize;
  }

  &:disabled {
    cursor: auto;
  }

  &:not(&_oldedge) {
    appearance: none;
    height: $track-height;
    padding: 0.4375rem 0; /* To catch click events nearby THIN input's track */
    background-color: transparent;
    background-clip: content-box; /* To clip filling of paddings */
    outline: none;
    border-radius: 0.75rem;

    &::-webkit-slider-container {
      border-radius: inherit;
    }

    &::-moz-range-progress {
      border-radius: inherit;
    }

    &::-webkit-slider-runnable-track {
      @include customize-track(fill, 1rem);
    }

    &::-moz-range-track {
      @include customize-track(notfill, 1rem);
    }

    &::-webkit-slider-thumb {
      @include customize-thumb(m);
      @include vertically-align-thumb(m);
    }

    &::-moz-range-thumb {
      @include customize-thumb(m);
    }

    &::-moz-range-progress {
      height: $track-height;
      background: $thumb-color;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>
