import type { ICommand } from './Command.interface';

class EraseCommand implements ICommand {
  public readonly name = 'eraser';

  constructor(
    private canvas: HTMLCanvasElement | null = null,
    private context: CanvasRenderingContext2D | null = null,
    private snapshot: ImageData | null
  ) {}

  execute(): void {
    console.log('Erase command executed');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.putImageData(this.snapshot, 0, 0);
  }

  undo(): void {
    console.log('Undoing the erase');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.putImageData(this.snapshot, 0, 0);
  }
}
export default EraseCommand;
