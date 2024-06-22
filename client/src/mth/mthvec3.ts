export class vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x?: number | vec3 | number[], y?: number, z?: number) {
    if (x instanceof vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (x instanceof Object) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else if (x != undefined && y == undefined) {
      this.x = this.y = this.z = x;
    } else if (x != undefined && y != undefined && z != undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = this.y = this.z = 0;
    }
  }

  add = (v: vec3) => {
    return _vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  };

  sub = (v: vec3) => {
    return _vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  };

  mulNum = (n: number) => {
    return _vec3(this.x * n, this.y * n, this.z * n);
  };

  divNum = (n: number) => {
    return _vec3(this.x / n, this.y / n, this.z / n);
  };

  neg = () => {
    return _vec3(-this.x, -this.y, -this.z);
  };

  dot = (v: vec3) => {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  cross = (v: vec3) => {
    return _vec3(
      this.y * v.z - v.y * this.z,
      v.x * this.z - this.x * v.z,
      this.x * v.y - v.x * this.y
    );
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

export function _vec3(x?: number | vec3 | number[], y?: number, z?: number) {
  return new vec3(x, y, z);
}
