import { io } from 'socket.io-client';
import { star, star_fetched } from '../../../server/src/stars';
import { anim, unit } from '../anim/anim';
import { topology, vertex } from '../anim/rnd/topo';
import { _vec3, vec3 } from '../mth/mthvec3';
import { buffer, uniform_buffer } from '../anim/rnd/buffer';
import { matrIdentity } from '../mth/mthmatr';

export class sky_unit extends unit {
  pr: number = 0;
  starsList: number[] = [];
  uboStars: buffer | null = null;
  socket;

  constructor() {
    super();
    this.socket = io();
  }

  init = (ani: anim) => {
    this.uboStars = new uniform_buffer('Stars', 4 * 4 * 200, 3);

    this.socket.on('connect', () => {
      console.log(this.socket.id);

      this.socket.on('get_stars', (stars: star_fetched[]) => {
        this.starsList = [];
        for (let i = 0; i < stars.length; i++) {
          this.starsList.push(stars[i].sinA);
          this.starsList.push(stars[i].cosA);
          this.starsList.push(stars[i].sinE);
          this.starsList.push(stars[i].cosE);
        }

        this.uboStars?.update(
          new Float32Array(this.starsList),
          0,
          this.starsList.length * 4
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
    const min = ani.dir
      .mulNum(ani.projDist)
      .add(ani.right.mulNum(-ani.wp / 2))
      .add(ani.up.mulNum(-ani.hp / 2))
      .norm();
    const max = ani.dir
      .mulNum(ani.projDist)
      .add(ani.right.mulNum(ani.wp / 2))
      .add(ani.up.mulNum(ani.hp / 2))
      .norm();

    let minE = Math.asin(min.y);
    let maxE = Math.asin(max.y);

    const cosMinE = Math.sqrt(1 - min.y * min.y);
    const cosMaxE = Math.sqrt(1 - max.y * max.y);

    let minA = Math.atan2(min.z / cosMinE, min.x / cosMinE);
    let maxA = Math.atan2(max.z / cosMaxE, max.x / cosMaxE);

    this.socket.emit(
      'fetch_stars',
      minA,
      minE,
      maxA,
      maxE,
      ani.curLMST,
      ani.curLat
    );

    ani.primDraw(
      this.pr,
      matrIdentity(),
      this.uboStars ? [this.uboStars] : undefined
    );
  };
}

// let sinD, cosD, sinH, cosH, sinE, cosE, sinA, cosA;
// const sinL = Math.sin(ani.curLat),
//   cosL = Math.cos(ani.curLat);

// this.allStarsList.forEach((s) => {
//   sinD = Math.sin(s.decl);
//   cosD = Math.cos(s.decl);
//   sinH = Math.sin(ani.curLMST - s.rasc);
//   cosH = Math.cos(ani.curLMST - s.rasc);

//   sinE = sinL * sinD + cosL * cosD * cosH;
//   cosE = Math.sqrt(1 - sinE * sinE);

//   sinA = (-cosD * sinH) / cosE;
//   cosA = (cosL * sinD - sinL * cosD * cosH) / cosE;

//   arr.push(sinA, cosA, sinE, cosE);
// });
