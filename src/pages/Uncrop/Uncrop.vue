<template>
  <div :class="$style.wrapper">
    <div
      ref="availableRef"
      style="
        position: relative;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        align-items: center;
        background: var(--tok-text-color-08);
      "
    >
      <div
        ref="areaRef"
        :class="$style.drawingArea"
        :style="computedDrawingAreaStyle"
      >
        <Resizer
          v-overscroll
          v-transform="onTransformGesture"
          :style="style"
          @size-changed="onSizeChanged"
        >
          <img
            ref="imageRef"
            src="../../assets/images/edit-eraser.jpg"
            :class="$style.photo"
            @load="onImageLoad"
          />
        </Resizer>
      </div>

      <div
        :class="[$style.align, $style.align_v]"
        :data-panning="verticalAlignment"
      />
      <div
        :class="[$style.align, $style.align_h]"
        :data-panning="horizontalAligment"
      />
    </div>

    <div :class="$style.menu">
      <div v-for="(g, i) in sizes" :key="i" :class="$style.menu__group">
        <button
          v-for="item in g"
          :key="item.label"
          :class="$style.button"
          :data-active="item.label === active.label"
          @click="onUpdateRatio(item)"
        >
          <div :class="$style.button__ratio" :style="item.style">
            <div :class="[$style.ratio, $style.ratio__lt]" />
            <div :class="[$style.ratio, $style.ratio__rt]" />
            <div :class="[$style.ratio, $style.ratio__bl]" />
            <div :class="[$style.ratio, $style.ratio__br]" />
            <div
              v-if="item.label === 'iPhone'"
              :class="[$style.ratio, $style.ratio__iphone]"
            />

            <svg-icon
              v-if="item.rotatable && item.label === active.label"
              name="rotate"
              :class="$style.ratio__rotate"
            />
          </div>

          <span :class="$style.button__label">{{ item }}</span>
        </button>
      </div>
    </div>
  </div>

  <main-button color="#007aff" text-color="#ffffff" text="Generate" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { MainButton } from '@/telegram/MainButton';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { OverscrollDirective as vOverscroll } from '@/ui/overscroll';
import { SvgIcon } from '@/ui/SvgIcon';
import { clamp } from '@/ui/utility/clamp';
import { TransformDirective as vTransform } from '@/zoom-rotate-transform/transform';

import Resizer from './Resizer.vue';

const sdk = useTelegramSdk();

const areaRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

class Ratio {
  constructor(
    readonly w: number,
    readonly h: number,
    readonly label: string,
    readonly rotatable = false
  ) {}

  get style() {
    return { aspectRatio: `${this.w}/${this.h}` };
  }

  get rstyle() {
    return this.rotatable ? { aspectRatio: `${this.h}/${this.w}` } : this.style;
  }

  get a() {
    return this.w / this.h;
  }

  toString() {
    return this.label;
  }
}

const verticalAlignment = ref(false);
const horizontalAligment = ref(false);
const loaded = ref<number | null>(null);

const refit = ref(NaN);

const availableRef = ref<HTMLElement | null>(null);

const fitted = computed(() => {
  const _area = areaRef.value?.getBoundingClientRect();
  const _image = imageRef.value?.getBoundingClientRect();

  if (!_area || !_image || loaded.value === null) {
    return;
  }

  refit.value;

  const r = fitImageInArea(
    _image.width,
    _image.height,
    _area.width - 50,
    _area.height - 50
  );

  const s = Math.max(_image.width, _image.height);

  return {
    ...r,
    maxWidth: _area.width,
    maxHeight: _area.height,
    s,
    imageW: _image.width,
    imageH: _image.height,
    ratio: _image.width / _image.height,
  };
});

const sizes = computed(() => {
  const _img = fitted.value;

  return [
    [new Ratio(_img?.imageW ?? 1, _img?.imageH ?? 1, 'Default')],
    [
      new Ratio(1, 1, '1:1'),
      new Ratio(4, 5, '4:5'),
      new Ratio(3, 4, '3:4'),
      new Ratio(2, 3, '2:3', true),
      new Ratio(9, 16, '9:16', true),
    ],
    [
      new Ratio(9, 19.5, 'iPhone'),
      new Ratio(9, 16, 'Tiktok', true),
      new Ratio(1, 1, 'Instagram'),
      new Ratio(9, 16, 'Story', true),
    ],
    [
      new Ratio(4, 6, '4x6"'),
      new Ratio(5, 7, '5x7"', true),
      new Ratio(8, 10, '8x10"'),
      new Ratio(12, 20, 'Letter', true),
    ],
  ] as const;
});
const active = ref<Ratio>(sizes.value[0][0]);
const rotated = ref(false);

const ima = computed(() => {
  const _image = imageRef.value?.getBoundingClientRect();

  return !!loaded.value && !!_image && [_image.width, _image.height];
});

const computedDrawingAreaStyle = computed(() => {
  const _ima = ima.value;
  const a = active.value;
  const _available = availableRef.value;
  const _rotated = rotated.value;

  if (!_ima || !_available) {
    return a.style;
  }

  const rect = _available.getBoundingClientRect();
  const ratio = a.rotatable && _rotated ? 1 / a.a : a.a;

  const defaultRatioBehavior = rect.width / ratio;
  const s = _rotated ? a.rstyle : a.style;

  if (defaultRatioBehavior < rect.height) {
    return s;
  }

  const clampedWidth = rect.height * ratio;

  return {
    ...s,
    width: `${clampedWidth}px`,
  };
});

watch(
  ima,
  (value) => {
    if (value) {
      active.value = sizes.value[0][0];

      setTimeout(() => {
        refit.value = Date.now();
      });
    }
  },
  { immediate: true }
);

type ToStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
  ratio: number;
};

const toStyle = ref<ToStyle>({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  ratio: 1,
});

watch(
  fitted,
  (value) => {
    if (value) {
      toStyle.value = {
        left: (value.maxWidth - value.width) / 2,
        top: (value.maxHeight - value.height) / 2,
        width: value.width,
        height: value.height,
        ratio: value.ratio,
      };
    }
  },
  { immediate: true }
);

const style = computed(() => {
  const _fitted = fitted.value;
  const val = toStyle.value;

  if (!_fitted) {
    return {};
  }

  return {
    position: 'absolute',
    left: `${val.left}px`,
    top: `${val.top}px`,
    width: `${val.width}px`,
    height: `${val.height}px`,
    maxWidth: `${_fitted.maxWidth}px`,
    aspectRatio: `${_fitted.width}/${_fitted.height}`,
    zIndex: '1',
  };
});

const magnetToCenter = (
  style: ToStyle
): { s: ToStyle; va: boolean; ha: boolean } => {
  const _fitted = fitted.value;

  if (!_fitted) {
    return {
      s: style,
      va: false,
      ha: false,
    };
  }

  const currWidth = style.left + style.width / 2;
  const vertical = _fitted.maxWidth / 2;

  const verticalDiff = vertical - currWidth;
  const shouldMagnetVertical = verticalDiff < 4 && verticalDiff > -4;

  const horizontalDiff = _fitted.maxHeight / 2 - (style.top + style.height / 2);
  const shouldMagnetHor = horizontalDiff < 4 && horizontalDiff > -4;

  const toMagnetVert = (_fitted.maxWidth - style.width) / 2;
  const toMagnetHor = (_fitted.maxHeight - style.height) / 2;

  return {
    s: {
      ...style,
      left: shouldMagnetVertical ? toMagnetVert : style.left,
      top: shouldMagnetHor ? toMagnetHor : style.top,
    },
    va: shouldMagnetVertical,
    ha: shouldMagnetHor,
  };
};

const clampUpdatedStyle = ({
  left,
  top,
  width,
  height,
  ratio,
}: ToStyle): ToStyle => {
  const _fitted = fitted.value;

  const a = {
    left: clamp(left, 0, _fitted ? _fitted.maxWidth - width : 420 - width),
    top: clamp(top, 0, _fitted ? _fitted.maxHeight - height : Infinity),
    width: clamp(width, 0, _fitted ? _fitted.maxWidth : 420),
    height,
    ratio,
  };

  return a;
};

const onSizeChanged = (
  type: 'lt' | 'rt' | 'bl' | 'br',
  [dw]: [number, number]
) => {
  if (dw < 1 && dw > -1) {
    return;
  }

  const _fitted = fitted.value;

  const current = toStyle.value;
  let nw = current.width - dw;

  const maxH = _fitted ? _fitted.maxHeight : Infinity;
  const nh = clamp((1 / current.ratio) * nw, 0, maxH);

  if (nh === maxH) {
    nw = current.width;
  }

  verticalAlignment.value = false;
  horizontalAligment.value = false;

  if (type === 'bl') {
    toStyle.value = clampUpdatedStyle({
      ...current,
      left: current.left + dw,
      width: nw,
      height: nh,
    });
  } else if (type === 'br') {
    toStyle.value = clampUpdatedStyle({
      ...current,
      width: nw,
      height: nh,
    });
  } else if (type === 'lt') {
    toStyle.value = clampUpdatedStyle({
      ...current,
      left: current.left + (current.width - nw),
      top: current.top + (current.height - nh),
      width: nw,
      height: nh,
    });
  } else if (type === 'rt') {
    toStyle.value = clampUpdatedStyle({
      ...current,
      top: current.top + (current.height - nh),
      width: nw,
      height: nh,
    });
  }
};

const fitImageInArea = (iw: number, ih: number, rw: number, rh: number) => {
  const imageAspectRatio = iw / ih;
  const rectangleAspectRatio = rw / rh;
  let newWidth, newHeight;

  if (imageAspectRatio > rectangleAspectRatio) {
    newWidth = rw;
    newHeight = newWidth / imageAspectRatio;
  } else {
    newHeight = rh;
    newWidth = newHeight * imageAspectRatio;
  }

  return { width: newWidth, height: newHeight };
};

const onImageLoad = () => {
  loaded.value = Date.now();
};

const onUpdateRatio = (ratio: typeof active.value) => {
  if (ratio.rotatable && active.value.label === ratio.label) {
    rotated.value = !rotated.value;
  } else {
    rotated.value = false;
  }

  active.value = ratio;

  setTimeout(() => {
    refit.value = Date.now();
  });
};

const onPan = ([dx, dy]: [number, number]) => {
  const current = toStyle.value;

  const r = magnetToCenter({
    ...current,
    left: current.left + dx,
    top: current.top + dy,
  });

  verticalAlignment.value = r.va;
  horizontalAligment.value = r.ha;

  toStyle.value = clampUpdatedStyle(r.s);
};

watch([verticalAlignment, horizontalAligment], ([a, b]) => {
  if (a || b) {
    sdk.HapticFeedback.impactOccurred('light');
  }
});

const onTransformGesture = {
  onEvent: onPan,
  onPanning: (value: boolean) => {
    if (!value) {
      verticalAlignment.value = value;
      horizontalAligment.value = value;
    }
  },
};
</script>

<style module lang="scss">
@import '@/styles/local.scss';

.wrapper {
  min-height: calc(100vh - 1rem);
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.drawingArea {
  @include transparentBackground;

  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  max-height: calc(100vh - 114px);
  border: 1px inset var(--tok-text-color-16);
  box-sizing: border-box;

  overflow: hidden;
}

.align {
  &:before,
  &:after {
    @include transition(opacity);

    position: absolute;
    content: '';
    background: var(--tok-primary);

    pointer-events: none;
    opacity: 0.0000001;
    z-index: 1;
  }

  &_v {
    &:before,
    &:after {
      width: 2px;
      height: 2rem;
    }

    &:before {
      left: 50%;
      top: 0;
    }

    &:after {
      left: 50%;
      bottom: 0;
    }
  }

  &_h {
    &:before,
    &:after {
      height: 2px;
      width: 2rem;
    }

    &:before {
      top: 50%;
      left: 0;
    }

    &:after {
      top: 50%;
      right: 0;
    }
  }

  &[data-panning='true'] {
    &:before,
    &:after {
      opacity: 1;
    }
  }
}

.menu {
  @include hidescroll;

  display: flex;
  flex-wrap: nowrap;
  background: var(--tok-background-color);
  padding: 1rem 0.5rem;
  gap: 1rem;

  overflow-x: auto;

  &__group {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: nowrap;

    &:after {
      position: absolute;
      content: '';
      right: -0.5rem;
      top: 0;
      height: calc(100% - 1em - 0.5rem);
      width: 1px;
      background: var(--tok-text-color-16);
    }
  }
}

.ratio {
  position: absolute;
  background: var(--tok-primary);
  width: 0.75rem;
  height: 0.75rem;

  &__lt {
    left: 0;
    top: 0;
  }

  &__rt {
    right: 0;
    top: 0;
  }

  &__bl {
    left: 0;
    bottom: 0;
  }

  &__br {
    right: 0;
    bottom: 0;
  }

  &__iphone {
    height: 2px;
    left: 50%;
    top: 4px;
    transform: translateX(-50%);
    z-index: 10;
  }

  &__rotate {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    color: var(--tok-primary);
  }
}

.button {
  @include clearbutton;

  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 5.125rem;
  align-items: center;
  justify-content: space-between;
  margin: 0 0.75rem;

  &[data-active='true'] {
    .button__ratio {
      opacity: 0.64;
    }
  }

  &__ratio {
    @include transition(opacity);

    position: relative;
    width: 2.25rem;
    background: linear-gradient(
        var(--tok-background-color-80),
        var(--tok-background-color-80)
      ),
      var(--tok-primary);
    border-radius: 0.5rem;
    overflow: hidden;
    opacity: 0.32;

    margin: auto 0;

    cursor: pointer;

    &:before,
    &:after {
      position: absolute;
      content: '';
      left: 2px;
      top: 2px;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      border-radius: calc(0.5rem - 2px);
      background: var(--tok-background-color);
      z-index: 1;
    }

    &:after {
      background: linear-gradient(
          var(--tok-background-color-80),
          var(--tok-background-color-80)
        ),
        var(--tok-primary);
      z-index: 2;
    }

    @include hover {
      opacity: var(--tok-hover-opacity);
    }
  }

  &__label {
    color: var(--tok-text-color-64);
    font: var(--tok-font-s);
    margin-top: 0.5rem;
  }
}

.photo {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
</style>
