import { io } from 'socket.io-client';
import { star, star_fetched } from '../../../server/src/stars';
import { anim, unit } from '../anim/anim';
import { topology, vertex } from '../anim/rnd/topo';
import { _vec3, vec3 } from '../mth/mthvec3';
import { buffer, uniform_buffer } from '../anim/rnd/buffer';
import { matrIdentity } from '../mth/mthmatr';
import { VK } from '../anim/input';

export class sky_unit extends unit {
  pr: number = 0;
  starsList: number[] = [];
  starsData: star[] = [];
  uboStars: buffer | null = null;
  socket;
  lastUpd: number = 0;

  constructor() {
    super();
    this.socket = io();
  }

  init = (ani: anim) => {
    this.uboStars = new uniform_buffer('Stars', 4 * 4 * 150, 3);

    this.socket.on('connect', () => {
      console.log(this.socket.id);

      this.socket.on('get_stars', (stars: star_fetched[], starsd: star[]) => {
        this.starsData = starsd;

        this.starsList = [];
        const t: number[] = [];
        for (let i = 0; i < stars.length; i++) {
          this.starsList.push(stars[i].sinA);
          this.starsList.push(stars[i].cosA);
          this.starsList.push(stars[i].sinE);
          this.starsList.push(stars[i].cosE);
        }
        for (let i = stars.length; i < 150; i++) {
          t.push(0);
          t.push(0);
          t.push(0);
          t.push(0);
        }

        this.uboStars?.update(
          new Float32Array(this.starsList),
          0,
          this.starsList.length * 4
        );
        if (t.length != 0)
          this.uboStars?.update(
            new Float32Array(t),
            this.starsList.length * 4,
            t.length * 4
          );
      });
    });

    const vert: vertex.point[] = [
      new vertex.point(_vec3(-1, -1, 0)),
      new vertex.point(_vec3(-1, 1, 0)),
      new vertex.point(_vec3(1, -1, 0)),
      new vertex.point(_vec3(1, 1, 0))
    ];

    const mtl: number = ani.addMaterial(
      'sky',
      _vec3(0),
      _vec3(0),
      _vec3(0),
      0,
      _vec3(0),
      0,
      ani.addShader('sky')
    );

    ani.getMaterial(mtl).tex[0] = ani.textures[ani.addCubemap('space', 'png')];

    this.pr = ani.primCreate(new topology.tristrip(vert), mtl);
  };
  response = (ani: anim) => {
    if (ani.keysClick[VK.LBUTTON]) {
      let px, py, r;

      px = (((2.0 * ani.mX + 1.0) / (ani.frameW - 1.0) - 1.0) * ani.wp) / 2.0;
      py = ((1 - (2.0 * ani.mY + 1.0) / (ani.frameH - 1.0)) * ani.hp) / 2.0;
      r = ani.dir
        .mulNum(ani.projDist)
        .add(ani.right.mulNum(px))
        .add(ani.up.mulNum(py))
        .norm();

      let sinD, cosD, sinH, cosH, sinL, cosL, sinE, cosE, sinA, cosA;

      sinL = Math.sin((ani.curLat * Math.PI) / 180);
      cosL = Math.cos((ani.curLat * Math.PI) / 180);

      sinE = r.y;
      cosE = Math.sqrt(1 - r.y * r.y);
      sinA = r.z / cosE;
      cosA = r.x / cosE;

      sinD = sinL * sinE + cosL * cosE * cosA;
      cosD = Math.sqrt(1 - sinD * sinD);

      sinH = (-cosE * sinA) / cosD;
      cosH = (cosL * sinE - sinL * cosE * cosA) / cosD;

      // sinH = (-sinA * cosE) / cosD;
      // cosH = (sinE - sinD * sinL) / (cosD * cosL);

      let ra = (Math.atan2(sinH, cosH) / Math.PI) * 12;
      if (ra < 0) ra += 24;
      ra = ani.curLMST - ra;

      if (ra < 0) ra += 24;
      else if (ra >= 24) ra -= 24;

      console.log('Ra: ' + ra + '; De: ' + (Math.asin(sinD) / Math.PI) * 180);
      let az = (Math.atan2(sinA, cosA) / Math.PI) * 180;
      if (az < 0) az += 360;
      console.log('Az: ' + az + '; El: ' + (Math.asin(sinE) / Math.PI) * 180);

      let minDist = -1,
        min = -1;
      for (let i = 0; i < this.starsList.length; i += 4) {
        const sith = this.starsList[i + 0];
        const coth = this.starsList[i + 1];
        const siph = this.starsList[i + 2];
        const coph = this.starsList[i + 3];

        const r1 = _vec3(coph * coth, siph, coph * sith);
        const x = r1.dot(r);

        if (min == -1 || minDist < x) {
          minDist = x;
          min = i / 4;
        }
      }

      if (min != -1) {
        console.log('Name: ' + this.starsData[min].name);
        console.log(
          'Ra (sky): ' +
            this.starsData[min].rasc +
            '; De (sky): ' +
            this.starsData[min].decl
        );
        if (minDist >= 0.9999) ani.curStar = this.starsData[min];
        else ani.curStar = null;
      }
    }

    if (ani.globalTime - this.lastUpd > 1) {
      this.lastUpd = ani.globalTime;

      this.socket.emit(
        'fetch_stars',
        ani.matrVP,
        ani.curLMST,
        ani.curLat,
        ani.fetchInfo
      );
    }

    ani.primDraw(
      this.pr,
      matrIdentity(),
      this.uboStars ? [this.uboStars] : undefined
    );
  };
}
