import type { ICommand } from './Command.interface';

class ClearCommand implements ICommand {
  readonly name = 'clear';

  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private snapshot: ImageData | null
  ) {}

  execute(): void {
    console.log('Clear command executed');

    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  undo(): void {
    console.log('Reverting the clear');

    if (!this.context || !this.snapshot) {
      return;
    }

    this.context.putImageData(this.snapshot, 0, 0);
  }
}

export default ClearCommand;
