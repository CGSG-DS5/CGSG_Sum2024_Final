import { createRoot } from 'react-dom/client';
import React from 'react';
import { ctx2d, getGLContext, gl } from './canvas_context';
import { anim } from './anim/anim';
import { _vec3, vec3 } from './mth/mthvec3';
import { control_unit } from './units/control_unit';
import { sky_unit } from './units/sky_unit';
import { MapComponent } from './react_elements/MapComponent';

async function main() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  const root = createRoot(rootElement);

  getGLContext();

  let ani: anim = new anim();

  ani.init();

  const w = window.innerWidth;
  const h = window.innerHeight;
  ani.resize(w, h);

  gl.canvas.width = w;
  gl.canvas.height = h;
  ctx2d.canvas.width = w;
  ctx2d.canvas.height = h;

  ani.resize(w, h);

  ani.camSet(_vec3(1, 1, 1), _vec3(0, 0, 0), _vec3(0, 1, 0));
  ani.projSet(1000, 0.1, 0.1);

  window.addEventListener('keydown', ani.onKeyDown);
  window.addEventListener('keyup', ani.onKeyUp);
  window.addEventListener('mousedown', ani.onMouseDown);
  window.addEventListener('mouseup', ani.onMouseUp);
  window.addEventListener('mousemove', ani.onMouseMove);
  window.addEventListener('wheel', ani.onMouseWheel);
  window.addEventListener('resize', (e: UIEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ani.resize(w, h);

    gl.canvas.width = w;
    gl.canvas.height = h;
    ctx2d.canvas.width = w;
    ctx2d.canvas.height = h;
  });

  let u = new control_unit();
  ani.addUnit(u);
  ani.addUnit(new sky_unit());

  const rnd = () => {
    ani.response();

    root.render(
      <div>
        <MapComponent ani={ani}></MapComponent>
      </div>
    );

    window.requestAnimationFrame(rnd);
  };

  rnd();
}

window.addEventListener('load', (e) => {
  main();
});
