import { star } from '../../../server/src/stars';
import { vec3 } from '../mth/mthvec3';
import { render } from './rnd/rnd';

export class unit {
  init(ani: anim) {}
  response(ani: anim) {}
  render(ani: anim) {}
}

export class anim extends render {
  units: unit[] = [];
  isMap: boolean = false;
  curLat: number = 0;
  curLon: number = 0;
  curLMST: number = 0;

  curStar: star | null = null;
  fetchInfo: string = '';

  addUnit(uni: unit) {
    this.units.push(uni);
    uni.init(this);
  }

  init() {
    super.init();
  }

  resize(w: number, h: number) {
    super.resize(w, h);
  }

  camSet(loc: vec3, at: vec3, up1: vec3) {
    super.camSet(loc, at, up1);
  }

  camSetFOV(fov: number) {
    super.camSetFOV(fov);
  }

  projSet(farClip: number, projDist: number, projSize: number) {
    super.projSet(farClip, projDist, projSize);
  }

  response() {
    super.response();

    this.curLMST = (this.gmst + this.curLon / 15) / 24;
    this.curLMST -= Math.floor(this.curLMST);
    if (this.curLMST < 0) this.curLMST++;
    this.curLMST *= 24;

    this.uboUtils?.update(
      new Float32Array([
        this.localTime,
        this.globalTime,
        this.localDeltaTime,
        this.globalDeltaTime
      ]),
      0,
      4 * 4 * 1
    );
    this.frameStart();

    for (let i = 0; i < this.units.length; i++) this.units[i].response(this);
    for (let i = 0; i < this.units.length; i++) this.units[i].render(this);

    /*gl.clearColor(Math.abs(Math.sin(this.tmr.globalTime)), 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);*/

    this.frameEnd();
  }
}
