export class vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(
    x?: number | vec4 | number[],
    y?: number,
    z?: number,
    w?: number
  ) {
    if (x instanceof vec4) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else if (x instanceof Object) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else if (x != undefined && y == undefined) {
      this.x = this.y = this.z = this.w = x;
    } else if (
      x != undefined &&
      y != undefined &&
      z != undefined &&
      w != undefined
    ) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    } else {
      this.x = this.y = this.z = this.w = 0;
    }
  }

  add = (v: vec4) => {
    return _vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  };

  sub = (v: vec4) => {
    return _vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w + v.w);
  };

  mulNum = (n: number) => {
    return _vec4(this.x * n, this.y * n, this.z * n, this.w * n);
  };

  divNum = (n: number) => {
    return _vec4(this.x / n, this.y / n, this.z / n, this.w / n);
  };

  neg = () => {
    return _vec4(-this.x, -this.y, -this.z, -this.w);
  };

  dot = (v: vec4) => {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  };

  len2 = () => {
    return this.dot(this);
  };

  len = () => {
    const l = this.len2();

    if (l === 0 || l === 1) return l;
    else return Math.sqrt(l);
  };

  norm = () => {
    let len = this.len();
    return this.divNum(len);
  };
}

export function _vec4(
  x?: number | vec4 | number[],
  y?: number,
  z?: number,
  w?: number
) {
  return new vec4(x, y, z);
}
