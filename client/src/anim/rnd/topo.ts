import { vec2 } from '../../mth/mthvec2';
import { _vec3, vec3 } from '../../mth/mthvec3';
import { vec4 } from '../../mth/mthvec4';

export enum primType {
  TRIMESH,
  POINTS,
  STRIP,
  LINE_STRIP
}

export namespace vertex {
  export class base_vertex {
    sizeof() {
      return 0;
    }

    write2Array(m: number[]) {}
  }

  export class std {
    p: vec3;
    t: vec2;
    n: vec3;
    c: vec4;

    constructor(p: vec3, t: vec2, n: vec3, c: vec4) {
      this.p = p;
      this.t = t;
      this.n = n;
      this.c = c;
    }

    sizeof() {
      return 4 * (3 + 2 + 3 + 4);
    }

    write2Array(m: number[]) {
      m.push(
        this.p.x,
        this.p.y,
        this.p.z,
        this.t.x,
        this.t.y,
        this.n.x,
        this.n.y,
        this.n.z,
        this.c.x,
        this.c.y,
        this.c.z,
        this.c.z
      );
    }
  }

  export class point {
    p: vec3;

    constructor(p: vec3) {
      this.p = p;
    }

    sizeof() {
      return 4 * 3;
    }

    write2Array(m: number[]) {
      m.push(this.p.x, this.p.y, this.p.z);
    }
  }

  export class star {
    radec: vec2;
    motion: vec2;
    magn: number;
    color: vec4;

    constructor(radec: vec2, motion: vec2, magn: number, color: vec4) {
      this.radec = radec;
      this.motion = motion;
      this.magn = magn;
      this.color = color;
    }

    sizeof() {
      return 4 * (2 + 2 + 1 + 3);
    }

    write2Array(m: number[]) {
      m.push(
        this.radec.x,
        this.radec.y,
        this.motion.x,
        this.motion.y,
        this.magn,
        this.color.x,
        this.color.y,
        this.color.z
      );
    }
  }
}

export namespace topology {
  export class base<vertex_type extends vertex.base_vertex> {
    type: primType;
    vert: vertex_type[];
    ind: number[];

    constructor(type: primType, vert?: vertex_type[], ind?: number[]) {
      this.type = type;

      if (!vert) this.vert = [];
      else this.vert = vert;

      if (!ind) this.ind = [];
      else this.ind = ind;
    }

    getFloat32Array() {
      const m: number[] = [];

      this.vert.forEach((v) => {
        v.write2Array(m);
      });
      return new Float32Array(m);
    }

    getUint32Array() {
      return new Uint32Array(this.ind);
    }
  }

  export class point<
    vertex_type extends vertex.base_vertex
  > extends base<vertex_type> {
    constructor(vert?: vertex_type[], ind?: number[]) {
      super(primType.POINTS, vert, ind);
    }
  }

  export class star extends base<vertex.star> {
    constructor(vert?: vertex.star[], ind?: number[]) {
      super(primType.POINTS, vert, ind);
    }
  }

  export class trimesh<
    vertex_type extends vertex.base_vertex
  > extends base<vertex_type> {
    constructor(vert?: vertex_type[], ind?: number[]) {
      super(primType.TRIMESH, vert, ind);
    }
  }

  export class tristrip<
    vertex_type extends vertex.base_vertex
  > extends base<vertex_type> {
    constructor(vert?: vertex_type[], ind?: number[]) {
      super(primType.STRIP, vert, ind);
    }
  }
}
