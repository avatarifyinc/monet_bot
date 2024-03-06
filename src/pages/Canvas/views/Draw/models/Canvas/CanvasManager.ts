import { Ref, ref } from 'vue';

import type {
  IContinuousTool,
  ISingleActionTool,
  ToolType,
} from '../Tool/Tool.interface';
import { ToolManager } from '../Tool/ToolManager';
import CanvasInitializer from './CanvasInitializer';

export class CanvasManager {
  private toolManager: ToolManager;
  public currentTool: Ref<ISingleActionTool | IContinuousTool | null> =
    ref(null);

  constructor(
    private canvasInitializer: CanvasInitializer,
    toolManager: ToolManager
  ) {
    this.canvasInitializer = canvasInitializer;
    this.toolManager = toolManager;
  }

  setTool(toolType: ToolType): void {
    this.currentTool.value = this.toolManager.switchTool(toolType);
  }

  resizeCanvas(newWidth: number, newHeight: number): void {
    this.canvasInitializer.resetCanvas(newWidth, newHeight);
  }
}
