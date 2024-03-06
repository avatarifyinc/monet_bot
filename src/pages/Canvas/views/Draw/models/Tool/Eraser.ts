import EraseCommand from '@/pages/Canvas/views/Draw/models/Command/EraseCommand';
import { IContinuousTool } from '@/pages/Canvas/views/Draw/models/Tool/Tool.interface';
import { useDrawingStore } from '@/pages/Canvas/views/Draw/store/drawing.store';

class Eraser implements IContinuousTool {
  private erasing = false;
  private lastX: number | undefined;
  private lastY: number | undefined;
  private store = useDrawingStore();
  private eraserSize = 32;

  constructor(
    private readonly canvas: HTMLCanvasElement | null,
    private readonly context: CanvasRenderingContext2D | null,
    private readonly ocanvas: HTMLCanvasElement | null,
    private readonly octx: CanvasRenderingContext2D | null
  ) {}

  activate(): void {
    console.log('Eraser tool activated');

    if (!this.canvas) {
      return;
    }

    this.canvas.addEventListener('mousedown', this.startErasing);
    this.canvas.addEventListener('mousemove', this.handleMouseEvent);
    this.canvas.addEventListener('touchstart', this.startErasing, {
      passive: true,
    });
    this.canvas.addEventListener('touchmove', this.handleTouchEvent, {
      passive: true,
    });
    window.addEventListener('mouseup', this.stopErasing);
    window.addEventListener('touchend', this.stopErasing, { passive: true });
  }

  deactivate(): void {
    console.log('Eraser tool deactivated');

    if (!this.canvas) {
      return;
    }

    this.canvas.removeEventListener('mousedown', this.startErasing);
    this.canvas.removeEventListener('mousemove', this.handleMouseEvent);
    this.canvas.removeEventListener('touchstart', this.startErasing);
    this.canvas.removeEventListener('touchmove', this.handleTouchEvent);
    window.removeEventListener('mouseup', this.stopErasing);
    window.removeEventListener('touchend', this.stopErasing);
  }

  onContinuousInput = (event: MouseEvent | TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    this.erasing = true;

    if (event instanceof MouseEvent) {
      const { clientX: x, clientY: y } = event;

      this.erase(x, y);
    } else if (event instanceof TouchEvent) {
      const { clientX: x, clientY: y } = event.touches[0];

      this.erase(x, y);
    }
  };

  private startErasing = (event: MouseEvent | TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    this.erasing = true;
    const { offsetX, offsetY } = this.getOffset(event);

    this.lastX = offsetX;
    this.lastY = offsetY;
  };

  private erase = (x: number, y: number) => {
    if (
      !this.erasing ||
      !this.context ||
      !this.canvas ||
      !this.octx ||
      this.lastX === undefined ||
      this.lastY === undefined
    ) {
      return;
    }

    if (this.octx) {
      this.octx.globalCompositeOperation = 'destination-out';

      this.octx.beginPath();
      this.octx.arc(x, y, this.eraserSize / 2, 0, 2 * Math.PI);
      this.octx.fill();

      this.octx.globalCompositeOperation = 'source-over';
    }

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

  private stopErasing = () => {
    if (this.erasing && this.canvas && this.context) {
      const snapshot = this.createSnapshot();

      if (snapshot) {
        const eraseCommand = new EraseCommand(
          this.canvas,
          this.context,
          snapshot
        );

        this.store.execute(eraseCommand);
      }
    }

    this.erasing = false;
  };

  private handleTouchEvent = (event: TouchEvent) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas?.getBoundingClientRect();
      const offsetX = touch.clientX - (rect?.left ?? 0);
      const offsetY = touch.clientY - (rect?.top ?? 0);

      this.erase(offsetX, offsetY);
    }
  };

  private handleMouseEvent = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;

    this.erase(offsetX, offsetY);
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

    return { offsetX: 0, offsetY: 0 }; // Default case
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
}

export default Eraser;
