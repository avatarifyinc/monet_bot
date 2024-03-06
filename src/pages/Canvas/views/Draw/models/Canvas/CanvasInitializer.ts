import { CanvasOptionsType } from './CanvasOptions.type';

class CanvasInitializer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null = null;
  readonly devicePixelRatio: number;
  width: number;
  height: number;

  constructor(
    public canvasElement: HTMLCanvasElement,
    public options: CanvasOptionsType
  ) {
    this.canvas = canvasElement;
    this.devicePixelRatio = options.devicePixelRatio;
    this.width = options.width;
    this.height = options.height;
    this.setupCanvas();
    this.initContext();
  }

  private initContext(): void {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        this.context = ctx;
      }
    }
  }

  public resetCanvas(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.setupCanvas();
  }

  private setupCanvas() {
    this.canvas.width = this.width * this.devicePixelRatio;
    this.canvas.height = this.height * this.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.context) {
      this.context.scale(this.devicePixelRatio, this.devicePixelRatio);
    }
  }

  static setupContext(
    canvas: HTMLCanvasElement,
    devicePixelRatio: number,
    width: number,
    height: number
  ) {
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }
}

export default CanvasInitializer;
