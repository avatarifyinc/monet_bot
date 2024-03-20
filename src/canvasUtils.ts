export function clampCanvasSize(original: { width: number; height: number }): {
  width: number;
  height: number;
} {
  const s = Math.min(Math.max(original.width, original.height), 2048);
  const aspect = original.width / original.height;

  if (aspect > 1) {
    return {
      width: s,
      height: s / aspect,
    };
  }

  return {
    width: s * aspect,
    height: s,
  };
}

export function drawingToMask(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const dataArr = imageData.data;

  for (let i = 0; i < dataArr.length; i += 4) {
    const t = dataArr[i + 3];

    const c = t === 0 ? 0 : 255;

    dataArr[i] = c;
    dataArr[i + 1] = c;
    dataArr[i + 2] = c;
    dataArr[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
