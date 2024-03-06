import { onMounted, Ref, ref } from 'vue';

import { ToolType } from '@/pages/Canvas/views/Draw/models/Tool/Tool.interface';
import { ToolManager } from '@/pages/Canvas/views/Draw/models/Tool/ToolManager';

import CanvasInitializer from './models/Canvas/CanvasInitializer';
import { CanvasManager } from './models/Canvas/CanvasManager';
import { useDrawingStore } from './store/drawing.store';

export function useDrawing(
  canvasRef: Ref<HTMLCanvasElement | null>,
  imageRef: Ref<HTMLImageElement | null>
) {
  const store = useDrawingStore();
  let canvasManager: CanvasManager | null = null;
  const currentToolType = ref<ToolType | null>(null);
  const offscreenCanvas = document.createElement('canvas');

  const initializeCanvasAndTools = () => {
    const canvas = canvasRef.value;
    const image = imageRef.value;

    if (!canvas || !image || !offscreenCanvas) {
      return;
    }

    const canvasOptions = {
      devicePixelRatio: window.devicePixelRatio,
      width: parseInt(window.getComputedStyle(image).width, 10),
      height: parseInt(window.getComputedStyle(image).height, 10),
    };

    const canvasInitializer = new CanvasInitializer(canvas, canvasOptions);

    CanvasInitializer.setupContext(
      offscreenCanvas,
      canvasOptions.devicePixelRatio,
      canvasOptions.width,
      canvasOptions.height
    );

    const toolManager = new ToolManager(offscreenCanvas);

    canvasManager = new CanvasManager(canvasInitializer, toolManager);

    canvasManager.setTool('pencil'); // fallback in case no tools selected

    currentToolType.value = 'pencil';
  };

  const switchTool = (toolType: ToolType) => {
    if (canvasManager) {
      canvasManager.setTool(toolType);
      currentToolType.value = toolType;
    }
  };

  onMounted(initializeCanvasAndTools);

  return {
    switchTool,
    currentToolType,
    initializeCanvasAndTools,
    execute: store.execute,
    clear: store.clear,
    undo: store.undo,
    redo: store.redo,
  };
}
