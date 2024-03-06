import type { ISingleActionTool } from '../../models/Tool/Tool.interface';
import { useDrawingStore } from '../../store/drawing.store';
import ClearCommand from '../Command/ClearCommand';

class Clear implements ISingleActionTool {
  private store = useDrawingStore();

  constructor(
    private readonly canvas: HTMLCanvasElement | null,
    private readonly context: CanvasRenderingContext2D | null,
    private readonly ocanvas: HTMLCanvasElement | null,
    private readonly octx: CanvasRenderingContext2D | null
  ) {}

  activate(): void {
    console.log('Clear tool activated');

    if (!this.canvas || !this.context) {
      return;
    }

    this.octx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const snapshot = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const command = new ClearCommand(this.canvas, this.context, snapshot);

    this.store.execute(command);
  }

  deactivate(): void {
    console.log('Clear tool deactivated');
  }

  performAction(): void {
    // The clear action is performed via the activate method
  }
}

export default Clear;
