<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { MainButton } from '@/telegram/MainButton';
import { useTelegramSdk } from '@/telegram/use/sdk';
import { FlatButton } from '@/ui/FlatButton';
import { InputText } from '@/ui/InputText';
import { clamp } from '@/ui/utility/clamp';
import { ZoomDirective as vZoom } from '@/zoom-rotate-transform/zoom';

import { useState } from './useState';

const { stack, undoIndex } = useState();
const sdk = useTelegramSdk();

const inputValue = ref('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const matrix = ref({
  scale: 1,
  translate: { x: 0, y: 0 },
  deg: 0,
});

const release = ref(false);

const zoomStyle = computed(() => {
  const _matrix = matrix.value;

  return {
    position: 'relative',
    display: 'inline-flex',
    transition: release.value ? 'transform 0.2s ease' : '',
    transformOrigin: '0 0',
    transform: `translate(${_matrix.translate.x}px, ${_matrix.translate.y}px) scale(${_matrix.scale})`,
  } as any;
});

const toolsGroups = [
  [
    {
      label: 'Undo',
      icon: 'undo',
      type: 'undo' as const,
    },
    {
      label: 'Redo',
      icon: 'redo',
      type: 'redo' as const,
    },
  ],
  [
    // {
    //   label: 'Select',
    //   icon: 'selection',
    //   type: 'selection' as const,
    // },
    {
      label: 'Draw',
      icon: 'draw',
      type: 'draw' as const,
    },
    {
      label: 'Eraser',
      icon: 'erase',
      type: 'eraser' as const,
    },
  ],
  [
    {
      label: 'Invert',
      icon: 'invert',
      type: 'invert' as const,
    },
    {
      label: 'Clear',
      icon: 'clear',
      type: 'clear' as const,
    },
  ],
];

const fitImageInCanvas = (iw: number, ih: number, rw: number, rh: number) => {
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

const activeTool = ref<'draw' | 'eraser' | 'selection'>('draw');
const drawingAreaRef = ref<HTMLElement | null>(null);
const loadedImage = ref<HTMLImageElement | null>(null);

onMounted(() => {
  import('@/assets/images/edit-eraser.jpg').then((m) => {
    const _img = new Image();

    _img.onload = () => {
      loadedImage.value = _img;
    };

    _img.src = m.default;
  });
});

const fittedImageInCanvas = computed(() => {
  const area = drawingAreaRef.value;
  const _image = loadedImage.value;

  if (!area || !_image) {
    return null;
  }

  const available = area.getBoundingClientRect();

  return fitImageInCanvas(
    _image.width,
    _image.height,
    available.width,
    available.height
  );
});

const drawImageBackgroundOnCanvas = ([wh, canvas]: [
  {
    width: number;
    height: number;
  } | null,
  HTMLCanvasElement | null
]) => {
  if (!wh || !canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const _image = loadedImage.value;

  if (!ctx || !_image) {
    return;
  }

  const pr = window.devicePixelRatio;

  canvas.width = wh.width * pr;
  canvas.height = wh.height * pr;

  canvas.style.width = `${wh.width}px`;
  canvas.style.height = `${wh.height}px`;

  if (canvas !== sideCanvasRef.value) {
    ctx.drawImage(_image, 0, 0, wh.width * pr, wh.height * pr);
  }

  ctx.scale(pr, pr);

  if (canvas === sideCanvasRef.value) {
    const _canvas = sideCanvasRef.value;
    const _ctx = sideContext.value;

    if (!_canvas || !_ctx) {
      return;
    }

    const _data = stack.value[undoIndex.value - 1];

    clearCanvasAndDraw(_canvas, _data);
  }
};

let _timeout: ReturnType<typeof setTimeout> | null = null;

const onZoomGesture = {
  matrix: matrix,
  onEvent: (scale: number, x: number, y: number) => {
    if (release.value) {
      return;
    }

    const old = matrix.value;

    matrix.value = {
      ...old,
      scale,
      translate: { x, y },
    };
  },
  onRelease: () => {
    const old = matrix.value;

    if (old.scale < 1) {
      sdk.HapticFeedback.impactOccurred('light');

      matrix.value = {
        ...old,
        scale: clamp(old.scale, 1, 5),
        translate: { x: 0, y: 0 },
      };

      release.value = true;

      _timeout && clearTimeout(_timeout);

      _timeout = setTimeout(() => {
        release.value = false;
      }, 200);
    }
  },
};

let prev: { x: number; y: number } | null = null;

let isDrawing = false;

const begin = (el: HTMLCanvasElement, c: { x: number; y: number }) => {
  const ctx = el.getContext('2d')!;

  ctx.strokeStyle = '#f485bb';
  ctx.lineWidth = 32 / matrix.value.scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  prev = c;
};

const draw = (el: HTMLCanvasElement, c: { x: number; y: number }) => {
  const ctx = el.getContext('2d')!;

  ctx.beginPath();

  if (prev) {
    ctx.moveTo(prev.x, prev.y);
  }

  prev = c;
  ctx.lineTo(c.x, c.y);
  ctx.stroke();
  ctx.closePath();
};

const setup = (
  el: HTMLCanvasElement | null,
  _: any,
  onCleanup: (fn: () => void) => void
) => {
  let _rect: DOMRect | null = null;

  function _mobilestart(e: TouchEvent) {
    if (!el) {
      return;
    }

    if (e.touches.length !== 1) {
      return;
    }

    isDrawing = activeTool.value === 'draw' || activeTool.value === 'eraser';

    _rect = el.getBoundingClientRect();
    const t = e.touches[0];

    const c = {
      x: (t.clientX - _rect.left) / matrix.value.scale,
      y: (t.clientY - _rect.top) / matrix.value.scale,
    };

    begin(el, c);
  }

  let wasDrawing = false;

  function _mobilemove(e: TouchEvent) {
    if (!isDrawing || !_rect || !el) {
      return;
    }

    if (e.touches.length !== 1) {
      return;
    }

    wasDrawing = true;

    const t = e.touches[0];

    const c = {
      x: (t.clientX - _rect.left) / matrix.value.scale,
      y: (t.clientY - _rect.top) / matrix.value.scale,
    };

    draw(el, c);
  }

  function _mousedown(e: MouseEvent) {
    if (!el) {
      return;
    }

    isDrawing = activeTool.value === 'draw' || activeTool.value === 'eraser';

    const c = { x: e.offsetX, y: e.offsetY };

    begin(el, c);
  }

  function _mousemove(e: MouseEvent) {
    if (isDrawing && el) {
      wasDrawing = true;

      const c = { x: e.offsetX, y: e.offsetY };

      draw(el, c);
    }
  }

  function _end() {
    if (!isDrawing || !el) {
      return;
    }

    prev = null;
    isDrawing = false;

    if (!wasDrawing) {
      return;
    }

    wasDrawing = false;

    stack.value = stack.value.slice(0, undoIndex.value);

    const _ctx = el.getContext('2d');

    if (_ctx) {
      stack.value.push(_ctx.getImageData(0, 0, el.width, el.height));

      undoIndex.value += 1;
    }
  }

  onCleanup(() => {
    el?.removeEventListener('touchstart', _mobilestart);
    el?.removeEventListener('touchmove', _mobilemove);
    el?.removeEventListener('mousedown', _mousedown);
    el?.removeEventListener('mousemove', _mousemove);

    document.removeEventListener('touchend', _end);
    document.removeEventListener('mouseup', _end);
  });

  if (!el) {
    return;
  }

  el.addEventListener('touchstart', _mobilestart);
  el.addEventListener('touchmove', _mobilemove);
  el.addEventListener('mousedown', _mousedown);
  el.addEventListener('mousemove', _mousemove);

  document.addEventListener('touchend', _end);
  document.addEventListener('mouseup', _end);
};

const sideCanvasRef = ref<HTMLCanvasElement | null>(null);

const sideContext = computed(() => {
  const value = sideCanvasRef.value;

  return value?.getContext('2d', { willReadFrequently: true });
});

const onClearCanvas = () => {
  const _canvas = sideCanvasRef.value;

  const ctx = _canvas?.getContext('2d');

  if (!ctx || !_canvas) {
    return;
  }

  ctx.clearRect(0, 0, _canvas.width, _canvas.height);
};

const clearCanvasAndDraw = (canvas: HTMLCanvasElement, data?: ImageData) => {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  onClearCanvas();

  if (data) {
    ctx.putImageData(data, 0, 0);
  }
};

const undoRedo = (step: number) => {
  const _canvas = sideCanvasRef.value;
  const _ctx = sideContext.value;

  if (!_canvas || !_ctx) {
    return;
  }

  undoIndex.value += step;

  const _data = stack.value[undoIndex.value - 1];

  clearCanvasAndDraw(_canvas, _data);
};

const onInvert = () => {
  const _canvas = sideCanvasRef.value;
  const ctx = sideContext.value;

  if (!ctx || !_canvas) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
  const dataArr = imageData.data;

  for (let i = 0; i < dataArr.length; i += 4) {
    const t = dataArr[i + 3];

    if (t === 0) {
      dataArr[i] = 244;
      dataArr[i + 1] = 133;
      dataArr[i + 2] = 187;
      dataArr[i + 3] = 255;
    } else {
      dataArr[i + 3] = 0;
    }
  }

  stack.value.push(imageData);

  undoIndex.value += 1;

  ctx.putImageData(imageData, 0, 0);
};

const onAction = (
  type: 'undo' | 'redo' | 'draw' | 'eraser' | 'invert' | 'clear' | 'selection'
) => {
  if (type === 'draw' || type === 'eraser' || type === 'selection') {
    activeTool.value = type;
  } else if (type === 'undo') {
    undoRedo(-1);
  } else if (type === 'redo') {
    undoRedo(1);
  } else if (type === 'invert') {
    onInvert();
  } else if (type === 'clear') {
    onClearCanvas();

    stack.value = [];
    undoIndex.value = 0;
    activeTool.value = 'draw';
  }
};

watch([fittedImageInCanvas, canvasRef], drawImageBackgroundOnCanvas, {
  immediate: true,
});

watch([fittedImageInCanvas, sideCanvasRef], drawImageBackgroundOnCanvas, {
  immediate: true,
});

watch(
  [activeTool, sideContext],
  ([tool, _ctx]) => {
    if (!_ctx) {
      return;
    }

    if (tool === 'eraser') {
      _ctx.globalCompositeOperation = 'destination-out';
    } else {
      _ctx.globalCompositeOperation = 'source-over';
    }
  },
  { immediate: true }
);

watch(sideCanvasRef, setup, { immediate: true });

const onSubmit = () => {
  const a = canvasRef.value;
  const b = sideCanvasRef.value;
  const wh = fittedImageInCanvas.value;
  const _ctx = sideContext.value;

  if (!a || !b || !wh || !_ctx) {
    return;
  }

  const _canvas = document.createElement('canvas');
  const __ctx = _canvas.getContext('2d');

  if (!_canvas || !__ctx) {
    return;
  }

  drawImageBackgroundOnCanvas([wh, _canvas]);

  __ctx.globalAlpha = 0.6;

  __ctx.drawImage(
    b,
    0,
    0,
    b.width / window.devicePixelRatio,
    b.height / window.devicePixelRatio
  );

  __ctx.globalAlpha = 1;

  _canvas.toBlob((bl) => {
    // todo
    console.log(bl);
  });
};
</script>

<template>
  <div :class="$style.wrapper">
    <div ref="drawingAreaRef" :class="$style.drawingArea">
      <div v-zoom="onZoomGesture" :style="zoomStyle">
        <canvas ref="canvasRef" />
        <canvas
          ref="sideCanvasRef"
          style="position: absolute; left: 0; top: 0; opacity: 0.6"
        />
      </div>
    </div>

    <div :class="$style.tools">
      <div
        v-for="(group, index) in toolsGroups"
        :key="index"
        :class="$style.toolsGroup"
        :data-index="index"
      >
        <flat-button
          v-for="tool in group"
          :key="tool.label"
          :appearance="activeTool === tool.type ? 'primary' : 'flat'"
          :icon="tool.icon"
          :disabled="
            tool.type === 'undo'
              ? undoIndex === 0
              : tool.type === 'redo'
              ? undoIndex === stack.length
              : false
          "
          @click.stop.prevent="onAction(tool.type)"
        >
          {{ tool.label }}
        </flat-button>
      </div>
    </div>

    <div :class="$style.inputArea">
      <input-text
        v-model="inputValue"
        placeholder="[Optional] What you want to generate?"
        :class="$style.input"
      />

      <flat-button
        icon="cog"
        style="width: var(--tok-height-m)"
        :icon-size="32"
      />
    </div>

    <main-button
      color="#007aff"
      text-color="#ffffff"
      text="Generate"
      @on-click="onSubmit"
    />
  </div>
</template>

<style module lang="scss">
@import '@/styles/local.scss';

.wrapper {
  min-height: calc(100vh - 1rem);
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.drawingArea {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  background: var(--tok-text-color-08);
}

.tools {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem -0.5rem;
  padding: 0 0.5rem;
}

.toolsGroup {
  display: flex;
  justify-content: space-around;
  padding: 0 0.5rem;
  gap: 0.5rem;

  width: 100%;
  // width: calc((100% / 7) * var(--tools-count, 2));

  &[data-index='1'] {
    // --tools-count: 3;
  }

  & + & {
    border-left: 1px solid var(--tok-text-color-48);
  }
}

.inputArea {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0.5rem 0.5rem;
}

.input {
  width: 100%;
}

.section {
  padding: 0.5rem;
}
</style>
