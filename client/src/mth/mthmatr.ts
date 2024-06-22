import { vec3, _vec3 } from './mthvec3';

export function d2r(a: number) {
  return a * (Math.PI / 180.0);
}

export function r2d(a: number) {
  return a * (180.0 / Math.PI);
}

export class matr {
  a: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  constructor(
    a00?: number[][] | number[] | number | matr,
    a01?: number,
    a02?: number,
    a03?: number,
    a10?: number,
    a11?: number,
    a12?: number,
    a13?: number,
    a20?: number,
    a21?: number,
    a22?: number,
    a23?: number,
    a30?: number,
    a31?: number,
    a32?: number,
    a33?: number
  ) {
    if (!a00)
      this.a = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    else if (a00 instanceof matr)
      this.a = [
        [a00.a[0][0], a00.a[0][1], a00.a[0][2], a00.a[0][3]],
        [a00.a[1][0], a00.a[1][1], a00.a[1][2], a00.a[1][3]],
        [a00.a[2][0], a00.a[2][1], a00.a[2][2], a00.a[2][3]],
        [a00.a[3][0], a00.a[3][1], a00.a[3][2], a00.a[3][3]]
      ];
    else if (Array.isArray(a00)) {
      if (
        Array.isArray(a00[0]) &&
        Array.isArray(a00[1]) &&
        Array.isArray(a00[2]) &&
        Array.isArray(a00[3])
      )
        this.a = [
          [a00[0][0], a00[0][1], a00[0][2], a00[0][3]],
          [a00[1][0], a00[1][1], a00[1][2], a00[1][3]],
          [a00[2][0], a00[2][1], a00[2][2], a00[2][3]],
          [a00[3][0], a00[3][1], a00[3][2], a00[3][3]]
        ];
      else if (
        !Array.isArray(a00[0]) &&
        !Array.isArray(a00[1]) &&
        !Array.isArray(a00[2]) &&
        !Array.isArray(a00[3]) &&
        !Array.isArray(a00[4]) &&
        !Array.isArray(a00[5]) &&
        !Array.isArray(a00[6]) &&
        !Array.isArray(a00[7]) &&
        !Array.isArray(a00[8]) &&
        !Array.isArray(a00[9]) &&
        !Array.isArray(a00[10]) &&
        !Array.isArray(a00[11]) &&
        !Array.isArray(a00[12]) &&
        !Array.isArray(a00[13]) &&
        !Array.isArray(a00[14]) &&
        !Array.isArray(a00[15])
      )
        this.a = [
          [a00[0], a00[1], a00[2], a00[3]],
          [a00[4], a00[5], a00[6], a00[7]],
          [a00[8], a00[9], a00[10], a00[11]],
          [a00[12], a00[13], a00[14], a00[15]]
        ];
    } else if (typeof a00 == 'number')
      if (
        typeof a01 == 'number' &&
        typeof a02 == 'number' &&
        typeof a03 == 'number' &&
        typeof a10 == 'number' &&
        typeof a11 == 'number' &&
        typeof a12 == 'number' &&
        typeof a13 == 'number' &&
        typeof a20 == 'number' &&
        typeof a21 == 'number' &&
        typeof a22 == 'number' &&
        typeof a23 == 'number' &&
        typeof a30 == 'number' &&
        typeof a31 == 'number' &&
        typeof a32 == 'number' &&
        typeof a33 == 'number'
      )
        this.a = [
          [a00, a01, a02, a03],
          [a10, a11, a12, a13],
          [a20, a21, a22, a23],
          [a30, a31, a32, a33]
        ];
      else
        this.a = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
        ];
  }

  mulMatr = (m: matr) => {
    let r = _matr();

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++) r.a[i][j] += this.a[i][k] * m.a[k][j];

    return r;
  };

  transpose = () => {
    let r = _matr();

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) r.a[i][j] = this.a[j][i];

    return r;
  };

  determ = () => {
    return (
      this.a[0][0] *
        matrDeterm3x3(
          this.a[1][1],
          this.a[1][2],
          this.a[1][3],
          this.a[2][1],
          this.a[2][2],
          this.a[2][3],
          this.a[3][1],
          this.a[3][2],
          this.a[3][3]
        ) -
      this.a[0][1] *
        matrDeterm3x3(
          this.a[1][0],
          this.a[1][2],
          this.a[1][3],
          this.a[2][0],
          this.a[2][2],
          this.a[2][3],
          this.a[3][0],
          this.a[3][2],
          this.a[3][3]
        ) +
      this.a[0][2] *
        matrDeterm3x3(
          this.a[1][0],
          this.a[1][1],
          this.a[1][3],
          this.a[2][0],
          this.a[2][1],
          this.a[2][3],
          this.a[3][0],
          this.a[3][1],
          this.a[3][3]
        ) -
      this.a[0][3] *
        matrDeterm3x3(
          this.a[1][0],
          this.a[1][1],
          this.a[1][2],
          this.a[2][0],
          this.a[2][1],
          this.a[2][2],
          this.a[3][0],
          this.a[3][1],
          this.a[3][2]
        )
    );
  };

  inverse = () => {
    let det = this.determ();
    if (det === 0) return matrIdentity();

    let r = _matr();

    // build adjoint matrix
    r.a[0][0] =
      matrDeterm3x3(
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[1][0] =
      -matrDeterm3x3(
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[2][0] =
      matrDeterm3x3(
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    r.a[3][0] =
      -matrDeterm3x3(
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    r.a[0][1] =
      -matrDeterm3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[1][1] =
      +matrDeterm3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[2][1] =
      -matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    r.a[3][1] =
      +matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    r.a[0][2] =
      +matrDeterm3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[3][1],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[1][2] =
      -matrDeterm3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[3][0],
        this.a[3][2],
        this.a[3][3]
      ) / det;

    r.a[2][2] =
      +matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[3][0],
        this.a[3][1],
        this.a[3][3]
      ) / det;

    r.a[3][2] =
      -matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[3][0],
        this.a[3][1],
        this.a[3][2]
      ) / det;

    r.a[0][3] =
      -matrDeterm3x3(
        this.a[0][1],
        this.a[0][2],
        this.a[0][3],
        this.a[1][1],
        this.a[1][2],
        this.a[1][3],
        this.a[2][1],
        this.a[2][2],
        this.a[2][3]
      ) / det;

    r.a[1][3] =
      +matrDeterm3x3(
        this.a[0][0],
        this.a[0][2],
        this.a[0][3],
        this.a[1][0],
        this.a[1][2],
        this.a[1][3],
        this.a[2][0],
        this.a[2][2],
        this.a[2][3]
      ) / det;

    r.a[2][3] =
      -matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][3],
        this.a[1][0],
        this.a[1][1],
        this.a[1][3],
        this.a[2][0],
        this.a[2][1],
        this.a[2][3]
      ) / det;

    r.a[3][3] =
      +matrDeterm3x3(
        this.a[0][0],
        this.a[0][1],
        this.a[0][2],
        this.a[1][0],
        this.a[1][1],
        this.a[1][2],
        this.a[2][0],
        this.a[2][1],
        this.a[2][2]
      ) / det;

    return r;
  };

  mulVec3 = (v: vec3) => {
    const w =
      v.x * this.a[0][3] +
      v.y * this.a[1][3] +
      v.z * this.a[2][3] +
      this.a[3][3];

    return _vec3(
      (v.x * this.a[0][0] +
        v.y * this.a[1][0] +
        v.z * this.a[2][0] +
        this.a[3][0]) /
        w,
      (v.x * this.a[0][1] +
        v.y * this.a[1][1] +
        v.z * this.a[2][1] +
        this.a[3][1]) /
        w,
      (v.x * this.a[0][2] +
        v.y * this.a[1][2] +
        v.z * this.a[2][2] +
        this.a[3][2]) /
        w
    );
  };

  vectorTransform = (v: vec3) => {
    return _vec3(
      v.x * this.a[0][0] + v.y * this.a[1][0] + v.z * this.a[2][0],
      v.x * this.a[0][1] + v.y * this.a[1][1] + v.z * this.a[2][1],
      v.x * this.a[0][2] + v.y * this.a[1][2] + v.z * this.a[2][2]
    );
  };

  pointTransform = (v: vec3) => {
    return _vec3(
      v.x * this.a[0][0] +
        v.y * this.a[1][0] +
        v.z * this.a[2][0] +
        this.a[3][0],
      v.x * this.a[0][1] +
        v.y * this.a[1][1] +
        v.z * this.a[2][1] +
        this.a[3][1],
      v.x * this.a[0][2] +
        v.y * this.a[1][2] +
        v.z * this.a[2][2] +
        this.a[3][2]
    );
  };
}

export function _matr(
  a00?: number[][] | number[] | number | matr,
  a01?: number,
  a02?: number,
  a03?: number,
  a10?: number,
  a11?: number,
  a12?: number,
  a13?: number,
  a20?: number,
  a21?: number,
  a22?: number,
  a23?: number,
  a30?: number,
  a31?: number,
  a32?: number,
  a33?: number
) {
  return new matr(
    a00,
    a01,
    a02,
    a03,
    a10,
    a11,
    a12,
    a13,
    a20,
    a21,
    a22,
    a23,
    a30,
    a31,
    a32,
    a33
  );
}

export function matrZero() {
  return new matr([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

export function matrIdentity() {
  return new matr([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function matrDeterm3x3(
  a11: number,
  a12: number,
  a13: number,
  a21: number,
  a22: number,
  a23: number,
  a31: number,
  a32: number,
  a33: number
) {
  return (
    a11 * a22 * a33 +
    a12 * a23 * a31 +
    a13 * a21 * a32 -
    a11 * a23 * a32 -
    a12 * a21 * a33 -
    a13 * a22 * a31
  );
}

export function matrTranslate(t: vec3) {
  return _matr([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t.x, t.y, t.z, 1]);
}

export function matrScale(s: vec3) {
  return _matr([s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1]);
}

export function matrRotateX(angleInDegree: number) {
  const a = d2r(angleInDegree);
  return _matr([
    1,
    0,
    0,
    0,
    0,
    Math.cos(a),
    Math.sin(a),
    0,
    0,
    -Math.sin(a),
    Math.cos(a),
    0,
    0,
    0,
    0,
    1
  ]);
}

export function matrRotateY(angleInDegree: number) {
  const a = d2r(angleInDegree);
  return _matr([
    Math.cos(a),
    0,
    -Math.sin(a),
    0,
    0,
    1,
    0,
    0,
    Math.sin(a),
    0,
    Math.cos(a),
    0,
    0,
    0,
    0,
    1
  ]);
}

export function matrRotateZ(angleInDegree: number) {
  const a = d2r(angleInDegree);
  return _matr([
    Math.cos(a),
    Math.sin(a),
    0,
    0,
    -Math.sin(a),
    Math.cos(a),
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ]);
}

export function matrView(loc: vec3, at: vec3, up1: vec3) {
  const dir = at.sub(loc).norm();
  const right = dir.cross(up1).norm();
  const up = right.cross(dir).norm();
  return _matr([
    [right.x, up.x, -dir.x, 0],
    [right.y, up.y, -dir.y, 0],
    [right.z, up.z, -dir.z, 0],
    [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]
  ]);
}

export function matrOrtho(
  l: number,
  r: number,
  b: number,
  t: number,
  n: number,
  f: number
) {
  return _matr([
    [2 / (r - l), 0, 0, 0],
    [0, 2 / (t - b), 0, 0],
    [0, 0, 2 / (n - f), 0],
    [(r + l) / (l - r), (t + b) / (b - t), (f + n) / (n - f), 1]
  ]);
}

export function matrFrustum(
  l: number,
  r: number,
  b: number,
  t: number,
  n: number,
  f: number
) {
  return _matr([
    [(2 * n) / (r - l), 0, 0, 0],
    [0, (2 * n) / (t - b), 0, 0],
    [(r + l) / (r - l), (t + b) / (t - b), (f + n) / (n - f), -1],
    [0, 0, (2 * n * f) / (n - f), 0]
  ]);
}
