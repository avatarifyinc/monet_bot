import { useDrawingStore } from '../../store/drawing.store';
import InvertCommand from '../Command/InvertCommand';
import type { ISingleActionTool } from './Tool.interface';

class Invert implements ISingleActionTool {
  private store = useDrawingStore();

  constructor(
    private readonly canvas: HTMLCanvasElement | null,
    private readonly context: CanvasRenderingContext2D | null,
    private readonly ocanvas: HTMLCanvasElement | null,
    private readonly octx: CanvasRenderingContext2D | null
  ) {}

  activate(): void {
    console.log('Invert tool activated');
    this.performAction();
  }

  deactivate(): void {
    console.log('Invert tool deactivated');
  }

  private createSnapshot(): ImageData | null {
    if (this.canvas && this.context) {
      let canvasSnapshot;

      if (this.context) {
        canvasSnapshot = this.context.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );

        return canvasSnapshot;
      }
    }

    return null;
  }

  performAction(): void {
    if (!this.ocanvas || !this.octx || !this.canvas || !this.context) {
      return;
    }

    const snapshot = this.createSnapshot();

    if (snapshot) {
      const data = snapshot.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) {
          // Pixel was transparent (mask area)
          // Fill with the Pencil color and apply alpha
          data[i] = 244; // R - Matching Pencil's color
          data[i + 1] = 133; // G
          data[i + 2] = 187; // B
          data[i + 3] = 255; // Alpha is solid to keep the offscreen canvas opacity!!!
        } else {
          data[i + 3] = 0; // Alpha (transparent)
        }
      }

      if (this.ocanvas && this.context) {
        this.octx.putImageData(snapshot, 0, 0);

        const data = snapshot.data;

        // 60% opacity only to save into snapshot!!!
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i + 3] = data[i + 3] * 0.6;
          }
        }

        const command = new InvertCommand(this.canvas, this.context, snapshot);

        this.store.execute(command);
      }
    }
  }
}

export default Invert;
