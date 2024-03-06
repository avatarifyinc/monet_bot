export interface IContinuousTool {
  activate(): void;
  deactivate(): void;
  onContinuousInput(event: MouseEvent | TouchEvent): void;
}

export interface ISingleActionTool {
  activate(): void;
  deactivate(): void;
  performAction(): void;
}

export interface ITouchTool extends IContinuousTool {
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;
}

export interface IMultiTouchTool {
  onMultiTouchStart(event: TouchEvent): void;
  onMultiTouchMove(event: TouchEvent): void;
  onMultiTouchEnd(event: TouchEvent): void;
}

export type ToolType = 'pencil' | 'eraser' | 'clear' | 'invert';

export type PencilToolParametersType = {
  color: string;
  thickness: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
};

export type EraserToolParametersType = {
  thickness: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
};
