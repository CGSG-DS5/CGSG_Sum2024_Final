import { gl } from '../../canvas_context';
import { vec3 } from '../../mth/mthvec3';
import { primManager } from './prim';

export class render extends primManager {
  init() {
    gl.clearColor(0.3, 0.47, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    super.init();
  }

  frameStart() {
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  frameEnd() {
    gl.finish();
  }

  resize(w: number, h: number) {
    gl.viewport(0, 0, w, h);
    this.camResize(w, h);

    this.uboUtils?.update(
      new Float32Array([this.frameW, this.frameH, this.wp, this.hp]),
      4 * 4 * 5,
      4 * 4 * 1
    );
  }

  camSet(loc: vec3, at: vec3, up1: vec3) {
    super.camSet(loc, at, up1);
    this.uboUtils?.update(
      new Float32Array([
        this.loc.x,
        this.loc.y,
        this.loc.z,
        0,
        this.up.x,
        this.up.y,
        this.up.z,
        this.at.x,
        this.right.x,
        this.right.y,
        this.right.z,
        this.at.y,
        this.dir.x,
        this.dir.y,
        this.dir.z,
        this.at.z
      ]),
      4 * 4 * 1,
      4 * 4 * 4
    );
  }

  projSet(farClip: number, projDist: number, projSize: number) {
    this.camSetProj(farClip, projDist, projSize);

    this.uboUtils?.update(
      new Float32Array([
        this.wp,
        this.hp,
        this.farClip,
        this.projDist,
        this.projSize,
        0
      ]),
      4 * 4 * 5 + 4 * 2,
      4 * 2 + 4 * 4 * 1
    );
  }

  camSetFOV(fov: number) {
    super.camSetFOV(fov);

    this.uboUtils?.update(
      new Float32Array([
        this.wp,
        this.hp,
        this.farClip,
        this.projDist,
        this.projSize,
        0
      ]),
      4 * 4 * 5 + 4 * 2,
      4 * 2 + 4 * 4 * 1
    );
  }

  fovSet(fov: number) {
    super.camSetFOV(fov);

    this.uboUtils?.update(
      new Float32Array([
        this.wp,
        this.hp,
        this.farClip,
        this.projDist,
        this.projSize,
        0
      ]),
      4 * 4 * 5 + 4 * 2,
      4 * 2 + 4 * 4 * 1
    );
  }
}
