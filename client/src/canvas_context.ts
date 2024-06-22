export let gl: WebGL2RenderingContext;
export let ctx2d: CanvasRenderingContext2D;

export function getGLContext() {
  const can = document.getElementById('glcan') as HTMLCanvasElement | null;
  if (!can) return;
  const ctx = can.getContext('webgl2');
  if (!ctx) return;
  gl = ctx;

  const can2 = document.getElementById('2dcan') as HTMLCanvasElement | null;
  if (!can2) return;
  const ctx2 = can2.getContext('2d');
  if (!ctx2) return;
  ctx2d = ctx2;
}
