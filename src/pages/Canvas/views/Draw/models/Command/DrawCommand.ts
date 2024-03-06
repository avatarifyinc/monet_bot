import { ICommand } from '@/pages/Canvas/views/Draw/models/Command/Command.interface';

export class DrawCommand implements ICommand {
  readonly name = 'pencil';

  constructor(
    private canvas: HTMLCanvasElement | null = null,
    private context: CanvasRenderingContext2D | null = null,
    private snapshot: ImageData | null
  ) {}

  execute(): void {
    console.log('Draw command executed');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.putImageData(this.snapshot, 0, 0);
  }

  undo(): void {
    console.log('Undoing the drawing');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.putImageData(this.snapshot, 0, 0);
  }
}
