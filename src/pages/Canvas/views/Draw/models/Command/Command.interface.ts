import type { ToolType } from '../Tool/Tool.interface';

export interface ICommand {
  name: ToolType;

  execute(): void;

  undo(): void;
}
