import { ref } from 'vue';

import Clear from './Clear';
import Eraser from './Eraser';
import Invert from './Invert';
import Pencil from './Pencil';
import type {
  IContinuousTool,
  ISingleActionTool,
  ToolType,
} from './Tool.interface';

export class ToolFactory {
  static createTool(
    toolType: ToolType,
    offscreen: HTMLCanvasElement | null
  ): ISingleActionTool | IContinuousTool {
    const canvas = document.querySelector('canvas');
    const context = ref(
      canvas?.getContext('2d', { willReadFrequently: true }) || null
    );
    const octx = ref(
      offscreen?.getContext('2d', { willReadFrequently: true }) || null
    );

    // Apply the same styling to the ocanvas canvas
    if (octx.value) {
      octx.value.lineCap = 'round';
      octx.value.lineJoin = 'round';
      octx.value.lineWidth = 32;
      octx.value.strokeStyle = '#f485bb';
    }

    if (context.value) {
      context.value.lineCap = 'round';
      context.value.lineJoin = 'round';
      context.value.lineWidth = 32;
    }

    const tools = {
      pencil: new Pencil(canvas, context.value, offscreen, octx.value),
      eraser: new Eraser(canvas, context.value, offscreen, octx.value),
      clear: new Clear(canvas, context.value, offscreen, octx.value),
      invert: new Invert(canvas, context.value, offscreen, octx.value),
      DEFAULT: () => {
        throw new Error(`Unknown tool type ${toolType}`);
      },
    };

    return tools[toolType] || tools.DEFAULT;
  }
}
