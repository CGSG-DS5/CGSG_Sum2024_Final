import { gl } from '../../canvas_context';
import { _vec3 } from '../../mth/mthvec3';

export class buffer {
  id: WebGLBuffer = 0;
  type: number = 0;
  size: number = 0;

  constructor(type: number, size: number) {
    let res = gl.createBuffer();
    if (!res) return;
    this.id = res;
    this.type = type;
    this.size = size;
    gl.bindBuffer(type, this.id);
    gl.bufferData(type, size, gl.STATIC_DRAW);
  }

  update(data: Float32Array, offset: number, size: number) {
    gl.bindBuffer(this.type, this.id);
    gl.bufferSubData(this.type, offset, data, 0);
  }

  apply(prg: WebGLProgram) {
    gl.bindBuffer(this.type, this.id);
  }

  free() {
    gl.deleteBuffer(this.id);
    this.id = 0;
    this.size = 0;
  }
}

export class vertex_buffer extends buffer {
  numOfVertices: number;
  constructor(vertices: Float32Array, vertSize: number) {
    super(gl.ARRAY_BUFFER, vertices.length);
    this.numOfVertices = vertices.length / vertSize;
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  update(data: Float32Array, offset: number, size: number) {
    super.update(data, offset, size);
  }

  free() {
    super.free();
    this.numOfVertices = 0;
  }
}

export class index_buffer extends buffer {
  numOfIndices: number;
  constructor(indices: Uint32Array) {
    super(gl.ELEMENT_ARRAY_BUFFER, 4 * indices.length);
    this.numOfIndices = indices.length;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  update(data: Float32Array, offset: number, size: number) {
    super.update(data, offset, size);
  }

  free() {
    super.free();
    this.numOfIndices = 0;
  }
}

export class uniform_buffer extends buffer {
  name: string;
  bind: number;
  constructor(name: string, size: number, bindingPoint: number) {
    super(gl.UNIFORM_BUFFER, size);
    gl.bufferData(gl.UNIFORM_BUFFER, size, gl.STATIC_DRAW);
    this.bind = bindingPoint;
    this.name = name;
  }

  update(data: Float32Array, offset: number, size: number) {
    super.update(data, offset, size);
  }

  apply(prg: WebGLProgram) {
    let blk_loc = gl.getUniformBlockIndex(prg, this.name);
    if (blk_loc !== -1 && blk_loc !== 4294967295) {
      gl.uniformBlockBinding(prg, blk_loc, this.bind);
      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.bind, this.id);
    }
  }

  free() {
    super.free();
  }
}
