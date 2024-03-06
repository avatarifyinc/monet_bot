import { Ref, ref } from 'vue';

import type {
  IContinuousTool,
  ISingleActionTool,
  ToolType,
} from './Tool.interface';
import { ToolFactory } from './ToolFactory';

export class ToolManager {
  private currentTool: Ref<ISingleActionTool | IContinuousTool | null> =
    ref(null);

  constructor(private offscreen: HTMLCanvasElement | null) {
    this.offscreen = offscreen;
  }

  switchTool(toolType: ToolType): ISingleActionTool | IContinuousTool {
    this.currentTool.value?.deactivate();
    this.currentTool.value = ToolFactory.createTool(toolType, this.offscreen);
    this.currentTool.value.activate();

    return this.currentTool.value;
  }

  getCurrentTool(): Ref<ISingleActionTool | IContinuousTool | null> {
    return this.currentTool;
  }
}
