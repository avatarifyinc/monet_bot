import { ICommand } from './Command.interface';

class InvertCommand implements ICommand {
  public readonly name = 'invert';

  constructor(
    private canvas: HTMLCanvasElement,
    private context: CanvasRenderingContext2D,
    private snapshot: ImageData
  ) {}

  execute(): void {
    console.log('Inverting transparency');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalAlpha = 0.6;
    this.context.putImageData(this.snapshot, 0, 0);
    this.context.globalAlpha = 1;
  }

  undo(): void {
    console.log('Reverting inversion');

    if (!this.context || !this.canvas || !this.snapshot) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalAlpha = 0.6;
    this.context.putImageData(this.snapshot, 0, 0);
    this.context.globalAlpha = 1;
  }
}
export default InvertCommand;
