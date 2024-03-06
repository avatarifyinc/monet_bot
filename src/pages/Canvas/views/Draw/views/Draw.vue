<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';

import { useEvent } from '@/shared/BrowserApi/useEvent';
import { MainButton } from '@/telegram/MainButton';
import { InputText } from '@/ui/InputText';
import { SvgIcon } from '@/ui/SvgIcon';

import { ICommand } from '../models/Command/Command.interface';
import { ToolType } from '../models/Tool/Tool.interface';
import { useDrawing } from '../useDrawing';

type DrawingOperations = Ref<{
  switchTool: (toolType: ToolType) => void;
  execute: (command: ICommand) => void;
  currentToolType: Ref<ToolType | null>;
  initializeCanvasAndTools: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}>;

const drawingOperations = ref<DrawingOperations | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const imageElement = ref<HTMLImageElement | null>(null);

drawingOperations.value = useDrawing(canvasElement, imageElement);

const toolsGroups = [
  [
    {
      label: 'Undo',
      icon: 'undo',
      type: 'undo',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.undo(),
    },
    {
      label: 'Redo',
      icon: 'redo',
      type: 'redo',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.redo(),
    },
  ],
  [
    {
      label: 'Select',
      icon: 'selection',
      type: 'selection',
      disabled: true,
      active: false,
      onClick: () => {
        console.log('Select');
      },
    },
    {
      label: 'Draw',
      icon: 'draw',
      type: 'pencil',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.switchTool('pencil'),
    },
    {
      label: 'Eraser',
      icon: 'erase',
      type: 'eraser',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.switchTool('eraser'),
    },
  ],
  [
    {
      label: 'Invert',
      icon: 'invert',
      type: 'invert',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.switchTool('invert'),
    },
    {
      label: 'Clear',
      icon: 'clear',
      type: 'clear',
      disabled: false,
      active: false,
      onClick: () => drawingOperations.value?.switchTool('clear'),
    },
  ],
];

const imgSrc = ref<typeof import('*.png') | null>(null);
const maskSrc = ref<string | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const toolMaxWidthPx = ref(0);

const toolsCount = computed(() => toolsGroups.flat(Infinity).length);
const onWrapperResize = () => {
  const wrapperWidth = wrapperRef.value?.getBoundingClientRect().width;

  if (typeof wrapperWidth !== 'undefined') {
    toolMaxWidthPx.value = wrapperWidth / toolsCount.value;
  }
};

const processMaskImage = (maskImageUrl: string) => {
  const offScreenCanvas = document.createElement('canvas');
  const ctx = offScreenCanvas.getContext('2d', { willReadFrequently: true });
  const maskImage = new Image();

  maskImage.onload = () => {
    // Set the off-screen canvas size to that of the image
    offScreenCanvas.width = maskImage.width;
    offScreenCanvas.height = maskImage.height;

    // Draw the mask image onto the off-screen canvas
    ctx?.drawImage(maskImage, 0, 0);

    // Get the image data from the off-screen canvas
    const imageData = ctx?.getImageData(
      0,
      0,
      offScreenCanvas.width,
      offScreenCanvas.height
    );
    const data = imageData?.data;

    // Create a path based on non-transparent pixels
    const path = new Path2D();

    for (let y = 0; y < offScreenCanvas.height; y++) {
      for (let x = 0; x < offScreenCanvas.width; x++) {
        const alpha = data[(y * offScreenCanvas.width + x) * 4 + 3];

        if (alpha > 0) {
          // Adjust this condition depending on how you define the edges of your mask
          path.rect(x, y, 1, 1); // Add a rectangle for each non-transparent pixel
        }
      }
    }

    // Now you can use `path` to stroke or fill on your actual on-screen canvas
    const onScreenCanvasCtx = document
      .querySelector('canvas')
      ?.getContext('2d', { willReadFrequently: true });

    onScreenCanvasCtx?.fill(path);
  };

  maskImage.src = maskImageUrl;
};

const onSetImageSource = async () => {
  imgSrc.value = await import('./images/test.png');

  const img = new Image();

  img.onload = () => {
    if (canvasElement.value) {
      drawingOperations.value?.initializeCanvasAndTools();
    }
  };

  img.src = imgSrc.value.default;
};

const init = () => {
  /**
   * fetch image
   * fetch mask (if no mask -> move to next step)
   * (if had mask on previous step - setup canvas path with received mask)
   * create canvas with the same size as image or use mask to set the path for canvas
   * init tools
   * */
  onSetImageSource();
  /**
   * maskSrc.value = null; // TODO fetch the mask here through related method
   * */
};

useEvent('resize', onWrapperResize);
watch(() => wrapperRef.value?.getBoundingClientRect().width, onWrapperResize, {
  immediate: true,
});

onMounted(init);
</script>

<template>
  <div ref="wrapperRef" :class="$style.wrapper">
    <div :class="$style.drawingArea">
      <img
        v-if="imgSrc"
        ref="imageElement"
        :class="$style.image"
        :src="imgSrc.default"
        alt="image"
      />
      <canvas ref="canvasElement" :class="$style.canvas" />
    </div>
    <div :class="$style.tools">
      <div
        v-for="(group, index) in toolsGroups"
        :key="index"
        :class="$style.toolsGroup"
      >
        <div
          v-for="tool in group"
          :key="tool.label"
          :class="[
            $style.tool,
            drawingOperations.currentToolType === tool.type &&
              $style.tool_selected,
          ]"
          :style="{ width: `${toolMaxWidthPx}px` }"
          @click="tool.onClick"
        >
          <svg-icon :name="tool.icon" />
          <span>{{ tool.label }}</span>
        </div>
      </div>
    </div>
    <div :class="[$style.section, $style.inputArea]">
      <input-text model-value="xyz" :class="$style.input" />
      <svg-icon name="cog" style="color: var(--tok-primary)" />
    </div>
    <div :class="$style.section">
      <main-button color="#007aff" text-color="#ffffff" text="Generate" />
    </div>
  </div>
</template>

<style module lang="scss">
@import '@/styles/local.scss';

$paddingTopBottom: 16px;

.wrapper {
  min-height: calc(100dvh - $paddingTopBottom);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawingArea {
  @include transparentBackground;

  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.image,
.canvas {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  max-width: 100%;
  width: 100%;
  height: auto;
  touch-action: none;
}

.image {
  user-select: none;
}

.tools {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}

.toolsGroup {
  display: flex;
  justify-content: center;

  & + & {
    border-left: 1px solid var(--tok-text-color-48);
  }

  &:not(:nth-of-type(2)) {
    flex: 0;
    padding: 0 0.5rem;
  }
}

.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 0.5rem;
  color: var(--tok-text-color-48);
  font: var(--tok-font-xs);
  font-size: clamp(0.8rem, 2.5vw, 1rem);

  &_selected {
    color: var(--tok-primary);
  }
}

.inputArea {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input {
  width: 100%;
}

.section {
  padding: 0.5rem;
}
</style>
