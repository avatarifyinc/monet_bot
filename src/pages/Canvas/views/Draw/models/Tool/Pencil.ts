import { DrawCommand } from '@/pages/Canvas/views/Draw/models/Command/DrawCommand';

import { useDrawingStore } from '../../store/drawing.store';
import type { IContinuousTool } from './Tool.interface';

class Pencil implements IContinuousTool {
  private drawing = false;
  private store = useDrawingStore();
  private lastX: number | undefined;
  private lastY: number | undefined;

  constructor(
    private readonly canvas: HTMLCanvasElement | null,
    private readonly context: CanvasRenderingContext2D | null,
    private readonly ocanvas: HTMLCanvasElement | null,
    private readonly octx: CanvasRenderingContext2D | null
  ) {}

  activate(): void {
    console.log('Pencil tool activated');

    if (!this.canvas) {
      return;
    }

    const snapshot = this.createSnapshot();

    if (snapshot) {
      const command = new DrawCommand(this.canvas, this.context, snapshot);

      this.store.execute(command);
    }

    this.canvas.addEventListener('mousedown', this.startDrawing);
    this.canvas.addEventListener('mousemove', this.handleMouseEvent);
    this.canvas.addEventListener('touchstart', this.startDrawing, {
      passive: true,
    });
    this.canvas.addEventListener('touchmove', this.handleTouchEvent, {
      passive: true,
    });
    window.addEventListener('mouseup', this.stopDrawing);
    window.addEventListener('touchend', this.stopDrawing, { passive: true });
  }

  deactivate(): void {
    console.log('Pencil tool deactivated');

    if (!this.canvas) {
      return;
    }

    this.canvas.removeEventListener('mousedown', this.startDrawing);
    this.canvas.removeEventListener('mousemove', this.handleMouseEvent);
    this.canvas.removeEventListener('touchstart', this.startDrawing);
    this.canvas.removeEventListener('touchmove', this.handleTouchEvent);
    window.removeEventListener('mouseup', this.stopDrawing);
    window.removeEventListener('touchend', this.stopDrawing);
  }

  onContinuousInput(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent) {
      const { clientX: x, clientY: y } = event;

      this.draw(x, y);
    } else if (event instanceof TouchEvent) {
      const { clientX: x, clientY: y } = event.touches[0];

      this.draw(x, y);
    }
  }

  private startDrawing = (event: MouseEvent | TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    this.drawing = true;
    const { offsetX, offsetY } = this.getOffset(event);

    this.lastX = offsetX;
    this.lastY = offsetY;
  };

  private draw = (x: number, y: number) => {
    if (
      !this.drawing ||
      !this.context ||
      !this.canvas ||
      !this.octx ||
      this.lastX === undefined ||
      this.lastY === undefined
    ) {
      return;
    }

    this.octx.beginPath();
    this.octx.moveTo(this.lastX, this.lastY);
    this.octx.lineTo(x, y);
    this.octx.stroke();

    // Clear the main canvas and draw the ocanvas canvas content onto it with desired transparency
    if (this.ocanvas && this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.globalAlpha = 0.6; // Set the desired transparency for the stroke
      this.context.drawImage(this.ocanvas, 0, 0);
      this.context.globalAlpha = 1; // Reset globalAlpha to default
    }

    // Update last positions
    this.lastX = x;
    this.lastY = y;
  };

  private stopDrawing = () => {
    if (this.drawing && this.canvas && this.context) {
      const snapshot = this.createSnapshot();

      if (snapshot) {
        const command = new DrawCommand(this.canvas, this.context, snapshot);

        this.store.execute(command);
      }
    }

    this.drawing = false;
    this.lastX = undefined;
    this.lastY = undefined;
  };

  private createSnapshot(): ImageData | null {
    if (this.canvas && this.context) {
      let canvasSnapshot;

      if (this.context) {
        this.context.globalAlpha = 0.6;

        canvasSnapshot = this.context.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );

        this.context.globalAlpha = 1;

        return canvasSnapshot;
      }
    }

    return null;
  }

  private handleTouchEvent = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas?.getBoundingClientRect();
      const offsetX = touch.clientX - (rect?.left ?? 0);
      const offsetY = touch.clientY - (rect?.top ?? 0);

      this.draw(offsetX, offsetY);
    }
  };

  private handleMouseEvent = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;

    this.draw(offsetX, offsetY);
  };

  private getOffset(event: MouseEvent | TouchEvent): {
    offsetX: number;
    offsetY: number;
  } {
    if (event instanceof MouseEvent) {
      return { offsetX: event.offsetX, offsetY: event.offsetY };
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas?.getBoundingClientRect();

      return {
        offsetX: touch.clientX - (rect?.left ?? 0),
        offsetY: touch.clientY - (rect?.top ?? 0),
      };
    }

    return { offsetX: 0, offsetY: 0 }; // Default in case of error
  }
}

export default Pencil;
