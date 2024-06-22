import { gl } from '../../canvas_context';
import { _vec3, vec3 } from '../../mth/mthvec3';
import { buffer, uniform_buffer } from './buffer';
import { shader, shaderManager } from './shd';
import { texture } from './texture';

export class material {
  name: string;
  ka: vec3;
  kd: vec3;
  ks: vec3;
  ph: number;
  ke: vec3;
  trans: number;
  shdNo: number;
  ubo: buffer;
  tex: texture[];

  constructor(
    name: string,
    ka: vec3,
    kd: vec3,
    ks: vec3,
    ph: number,
    ke: vec3,
    trans: number,
    shdNo: number
  ) {
    this.name = name;
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.ph = ph;
    this.ke = ke;
    this.trans = trans;
    this.shdNo = shdNo;

    let buf: Float32Array = new Float32Array([
      this.ka.x,
      this.ka.y,
      this.ka.z,
      this.ph,

      this.kd.x,
      this.kd.y,
      this.kd.z,
      this.trans,

      this.ks.x,
      this.ks.y,
      this.ks.z,
      0.0,

      this.ke.x,
      this.ke.y,
      this.ke.z,
      0.0
    ]);

    this.ubo = new uniform_buffer('Material', buf.length * 4, 2);
    this.ubo.update(buf, 0, this.ubo.size);

    this.tex = [];
  }

  free() {
    this.ubo.free();
  }
}

export class materialManager extends shaderManager {
  materials: material[] = [];
  materialsNum: number = 0;

  addMaterial(
    name: string,
    ka: vec3,
    kd: vec3,
    ks: vec3,
    ph: number,
    ke: vec3,
    trans: number,
    shdNo: number
  ) {
    for (let i = 0; i < this.materialsNum; i++)
      if (this.materials[i].name == name) return i;

    this.materials[this.materialsNum] = new material(
      name,
      ka,
      kd,
      ks,
      ph,
      ke,
      trans,
      shdNo
    );
    return this.materialsNum++;
  }

  findMaterial(name: string) {
    for (let i = 0; i < this.materialsNum; i++)
      if (this.materials[i].name == name) return i;
    return -1;
  }

  getMaterial(index: number) {
    if (index < 0 || index > this.materialsNum) return this.materials[0];
    return this.materials[index];
  }

  getDefMaterial() {
    const i = this.findMaterial('default');
    if (i == -1)
      return this.addMaterial(
        'default',
        _vec3(0.2),
        _vec3(0.8),
        _vec3(0.5),
        47,
        _vec3(0),
        0,
        0
      );
  }

  closeMaterial() {
    for (let i = 0; i < this.materialsNum; i++) this.materials[i].free();
  }

  applyMaterial(mtlNo: number): WebGLProgram | null {
    let mtl = this.getMaterial(mtlNo);

    let prg = super.getShader(mtl.shdNo).progID;

    if (!prg) return null;
    gl.useProgram(prg);

    mtl.ubo.apply(prg);

    let loc;

    for (let i = 0; i < mtl.tex.length; i++)
      if (!mtl.tex[i].isCube) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, mtl.tex[i].texId);
        if ((loc = gl.getUniformLocation(prg, 'Texture' + i)) != -1)
          gl.uniform1i(loc, i);
      } else {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[i].texId);
        if ((loc = gl.getUniformLocation(prg, 'CubeMap' + i)) != -1)
          gl.uniform1i(loc, i);
      }

    return prg;
  }
}
