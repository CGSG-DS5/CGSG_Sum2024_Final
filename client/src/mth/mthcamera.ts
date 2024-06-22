import { _matr, d2r, matr, matrFrustum, matrView } from './mthmatr';
import { _vec3, vec3 } from './mthvec3';

/* Camera class */
export class camera {
  loc: vec3 = _vec3(0, 0, 0); /* Camera location */
  dir: vec3 = _vec3(0, 0, 0); /* Camera forward direction */
  right: vec3 = _vec3(0, 0, 0); /* Camera right direction */
  up: vec3 = _vec3(0, 0, 0); /* Camera up direction */
  at: vec3 = _vec3(0, 0, 0); /* Camera location */

  projDist: number = 0.1;
  projSize: number = 0.1;
  farClip: number = 1000;
  wp: number = 0.1;
  hp: number = 0.1;
  frameW: number = 100;
  frameH: number = 100;

  matrView: matr = _matr(1);
  matrProj: matr = _matr(1);
  matrVP: matr = _matr(1);

  camSet(loc: vec3, at: vec3, up1: vec3) {
    this.matrView = matrView(loc, at, up1);

    this.loc = loc;
    this.at = at;
    this.right = _vec3(
      this.matrView.a[0][0],
      this.matrView.a[1][0],
      this.matrView.a[2][0]
    );
    this.up = _vec3(
      this.matrView.a[0][1],
      this.matrView.a[1][1],
      this.matrView.a[2][1]
    );
    this.dir = _vec3(
      -this.matrView.a[0][2],
      -this.matrView.a[1][2],
      -this.matrView.a[2][2]
    );

    this.matrVP = this.matrView.mulMatr(this.matrProj);
  }

  camSetProj(farClip: number, projDist: number, projSize: number) {
    this.farClip = farClip;
    this.projDist = projDist;
    this.projSize = projSize;

    this.wp = this.hp = this.projSize;

    /// ???
    if (this.frameW < this.frameH) this.wp *= this.frameW / this.frameH;
    else this.hp *= this.frameH / this.frameW;

    const wp2 = this.wp / 2,
      hp2 = this.hp / 2;
    this.matrProj = matrFrustum(
      -wp2,
      wp2,
      -hp2,
      hp2,
      this.projDist,
      this.farClip
    );

    this.matrVP = this.matrView.mulMatr(this.matrProj);
  }

  camSetFOV(fov: number) {
    this.camSetProj(
      this.farClip,
      this.projDist,
      2 * Math.tan(d2r(fov) / 2) * this.projDist
    );
  }

  camResize(w: number, h: number) {
    this.frameW = w;
    this.frameH = h;

    this.camSetProj(this.farClip, this.projDist, this.projSize);
  }
}
