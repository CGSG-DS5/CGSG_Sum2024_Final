import { anim, unit } from '../anim/anim';
import { VK } from '../anim/input';
import { ctx2d } from '../canvas_context';
import {
  _matr,
  matr,
  matrRotateX,
  matrRotateY,
  matrTranslate,
  r2d
} from '../mth/mthmatr';
import { _vec3, vec3 } from '../mth/mthvec3';

export class control_unit extends unit {
  scale = 0;
  PrevTime = 0;
  PrevW = 0;
  PrevH = 0;
  init = (ani: anim) => {
    ctx2d.fillStyle = 'yellow';
    ctx2d.font = '30px sans-serif';

    ctx2d.clearRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
    ctx2d.fillText('FPS: 30.7', 100, 100);
  };
  response = (ani: anim) => {
    let Dist, plen, cosT, sinT, cosP, sinP, Azimuth, Elevator, sx, sy;

    if (ani.keysClick['C'.charCodeAt(0)]) ani.isMap = true;
    if (ani.isMap) return;

    if (
      ani.globalTime - this.PrevTime > 1 ||
      this.PrevW != ani.frameW ||
      this.PrevH != ani.frameH
    ) {
      ctx2d.fillStyle = 'yellow';
      ctx2d.font = '30px sans-serif';

      ctx2d.clearRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
      ctx2d.fillText('FPS: ' + ani.fps.toFixed(1), 20, 50);
      ctx2d.fillText(
        'FOV: ' +
          (120 * Math.pow(1.3, -this.scale)).toFixed(
            -Math.log10(120 * Math.pow(1.3, -this.scale)) + 3
          ),
        20,
        100
      );
      this.PrevTime = ani.globalTime;
      this.PrevW = ani.frameW;
      this.PrevH = ani.frameH;
    }

    // if (ani.keysClick['P'.charCodeAt(0)]) ani.isPause = !ani.isPause;

    Dist = ani.at.sub(ani.loc).len();
    cosT = (ani.loc.y - ani.at.y) / Dist;
    sinT = Math.sqrt(1 - cosT * cosT);
    plen = Dist * sinT;
    cosP = (ani.loc.z - ani.at.z) / plen;
    sinP = (ani.loc.x - ani.at.x) / plen;

    Azimuth = r2d(Math.atan2(sinP, cosP));
    Elevator = r2d(Math.atan2(sinT, cosT));

    Azimuth +=
      (((ani.globalDeltaTime *
        (30 * Number(ani.keys[VK.LBUTTON]) * ani.mdX +
          0 * (Number(ani.keys[VK.LEFT]) - Number(ani.keys[VK.RIGHT])) * 10)) /
        5) *
        (120 * Math.pow(1.3, -this.scale))) /
      120;
    Elevator +=
      (((ani.globalDeltaTime *
        (30 * Number(ani.keys[VK.LBUTTON]) * ani.mdY +
          0 * (Number(ani.keys[VK.UP]) - Number(ani.keys[VK.DOWN]) * 10))) /
        5) *
        (120 * Math.pow(1.3, -this.scale))) /
      120;
    // Dist -=
    //   ((ani.globalDeltaTime *
    //     ((3 + Number(ani.keys[VK.CONTROL]) * 10) *
    //       (ani.mdZ / 20 +
    //         (Number(ani.keys['W'.charCodeAt(0)]) -
    //           Number(ani.keys['S'.charCodeAt(0)]))))) /
    //     5) *
    //   ani.at.sub(ani.loc).len();

    if (Elevator < 0.08) Elevator = 0.08;
    else if (Elevator > 178.9) Elevator = 178.9;
    // if (Dist < 0.1) Dist = 0.1;

    this.scale += ani.mdZ / 100;

    if (this.scale > 100) this.scale = 100;
    if (this.scale < 0) this.scale = 0;

    ani.camSet(
      matrRotateX(Elevator)
        .mulMatr(matrRotateY(Azimuth))
        .mulMatr(matrTranslate(ani.at))
        .pointTransform(_vec3(0, Dist, 0)),
      ani.at,
      _vec3(0, 1, 0)
    );

    ani.camSetFOV(120 * Math.pow(1.3, -this.scale));
  };
}
