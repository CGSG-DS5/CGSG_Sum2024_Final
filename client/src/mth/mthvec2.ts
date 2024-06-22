export class vec2 {
  x: number;
  y: number;

  constructor(x?: number | vec2 | number[], y?: number) {
    if (x instanceof vec2) {
      this.x = x.x;
      this.y = x.y;
    } else if (x instanceof Object) {
      this.x = x[0];
      this.y = x[1];
    } else if (x != undefined && y == undefined) {
      this.x = this.y = x;
    } else if (x != undefined && y != undefined) {
      this.x = x;
      this.y = y;
    } else {
      this.x = this.y = 0;
    }
  }

  add = (v: vec2) => {
    return _vec2(this.x + v.x, this.y + v.y);
  };

  sub = (v: vec2) => {
    return _vec2(this.x - v.x, this.y - v.y);
  };

  mulNum = (n: number) => {
    return _vec2(this.x * n, this.y * n);
  };

  divNum = (n: number) => {
    return _vec2(this.x / n, this.y / n);
  };

  neg = () => {
    return _vec2(-this.x, -this.y);
  };

  dot = (v: vec2) => {
    return this.x * v.x + this.y * v.y;
  };

  cross = (v: vec2) => {
    this.x * v.y - v.x * this.y;
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

export function _vec2(x?: number | vec2 | number[], y?: number) {
  return new vec2(x, y);
}
