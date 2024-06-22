import { gl } from '../../canvas_context';
import { _matr, matr } from '../../mth/mthmatr';
import { _vec3, vec3 } from '../../mth/mthvec3';
import { buffer, index_buffer, uniform_buffer, vertex_buffer } from './buffer';
import { materialManager } from './mtl';
import { primType, topology, vertex } from './topo';

export class prim {
  type: number = 0;
  va: WebGLVertexArrayObject = 0;
  vbuf: vertex_buffer | null = null;
  ibuf: index_buffer | null = null;

  vertSize: number = 0;

  numOfElements: number = 0;
  trans: matr;

  mtl: number;
  minBB: vec3 = _vec3(0);
  maxBB: vec3 = _vec3(0);

  constructor(mtl: number, m?: matr) {
    this.mtl = mtl;
    if (m) this.trans = _matr(m);
    else this.trans = _matr(1);
  }

  create<vert extends vertex.base_vertex>(t: topology.base<vert>) {
    this.type =
      t.type == primType.TRIMESH
        ? gl.TRIANGLES
        : t.type == primType.STRIP
          ? gl.TRIANGLE_STRIP
          : t.type == primType.LINE_STRIP
            ? gl.LINE_STRIP
            : gl.POINTS;

    if (t.vert.length != 0) {
      const v = gl.createVertexArray();
      if (v) this.va = v;

      gl.bindVertexArray(this.va);

      this.vertSize = t.vert[0].sizeof();
      this.vbuf = new vertex_buffer(t.getFloat32Array(), t.vert[0].sizeof());
    }
    if (t.ind.length != 0) {
      this.ibuf = new index_buffer(t.getUint32Array());
      this.numOfElements = t.ind.length;
    } else this.numOfElements = t.vert.length == 0 ? 1 : t.vert.length;
  }
}

export class primManager extends materialManager {
  prims: prim[] = [];
  primsNum: number = 0;

  uboMatr: uniform_buffer | null = null;
  uboUtils: uniform_buffer | null = null;

  init() {
    super.init();
    this.uboMatr = new uniform_buffer('Matrs', 4 * 16 * 3, 0);
    this.uboUtils = new uniform_buffer('Utils', 4 * 4 * 11, 1);
  }

  primCreate<vert extends vertex.base_vertex>(
    t: topology.base<vert>,
    mtl: number,
    m?: matr
  ) {
    this.prims[this.primsNum] = new prim(mtl, m);
    this.prims[this.primsNum].create(t);

    return this.primsNum++;
  }

  primDraw(prim: number, trans?: matr, ubos?: buffer[]) {
    if (prim < 0 || prim >= this.primsNum) return;

    const pr: prim = this.prims[prim];

    const w = trans ? pr.trans.mulMatr(trans) : pr.trans,
      winv = w.inverse(),
      wvp = w.mulMatr(this.matrVP);

    const prg = this.applyMaterial(pr.mtl);
    if (!prg) return;

    const a: number[] = [];

    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) a.push(w.a[i][j]);
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) a.push(winv.a[i][j]);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) a.push(wvp.a[i][j]);

    this.uboMatr?.update(new Float32Array(a), 0, this.uboMatr.size);
    this.uboMatr?.apply(prg);
    this.uboUtils?.apply(prg);

    ubos?.forEach((ubo) => {
      ubo.apply(prg);
    });

    gl.bindVertexArray(pr.va);
    pr.vbuf?.apply(prg);

    let loc;

    if ((loc = gl.getAttribLocation(prg, 'InPos')) !== -1) {
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, pr.vertSize, 0);
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InTexCoord')) !== -1) {
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, pr.vertSize, 3 * 4);
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InNormal')) !== -1) {
      gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, pr.vertSize, (3 + 2) * 4);
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InColor')) !== -1) {
      gl.vertexAttribPointer(
        loc,
        4,
        gl.FLOAT,
        false,
        pr.vertSize,
        (3 + 2 + 3) * 4
      );
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InRaDec')) !== -1) {
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, pr.vertSize, 0);
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InMotion')) !== -1) {
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, pr.vertSize, 4 * 2);
      gl.enableVertexAttribArray(loc);
    }

    if ((loc = gl.getAttribLocation(prg, 'InMagn')) !== -1) {
      gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, pr.vertSize, 4 * (2 + 2));
      gl.enableVertexAttribArray(loc);
    }

    if (!pr.ibuf) gl.drawArrays(pr.type, 0, pr.numOfElements);
    else {
      pr.ibuf.apply(prg);
      gl.drawElements(pr.type, pr.numOfElements, gl.UNSIGNED_INT, 0);
    }
  }
}
