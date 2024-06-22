import { gl } from '../../canvas_context';
import { textureManager } from './texture';

export class shader {
  constructor(str: string, id: WebGLProgram) {
    this.progID = id;
    this.name = str;
  }
  progID: WebGLProgram = 0;
  name: string = '';
}

export class shaderManager extends textureManager {
  shaders: shader[] = [];
  shadersNum: number = 0;

  private load(fileName: string) {
    const shdsName = ['vert', 'frag'];
    const shdsType = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER];
    const shdsID: WebGLShader[] = [];
    let proms = [];
    for (let i = 0; i < shdsName.length; i++) {
      const buf = 'bin/shaders/' + fileName + '/' + shdsName[i] + '.glsl';

      proms[i] = fetch(buf)
        .then((res) => res.text())
        .then((data) => {
          let res = gl.createShader(Number(shdsType[i]));
          if (!res) return;
          shdsID[i] = res;

          gl.shaderSource(shdsID[i], data);
          gl.compileShader(shdsID[i]);

          if (!gl.getShaderParameter(shdsID[i], gl.COMPILE_STATUS)) {
            const buf1 = gl.getShaderInfoLog(shdsID[i]);
            console.log(buf + ':' + '\n' + buf1);
          }
        });
    }
    const n = this.shadersNum;
    this.shaders[n] = new shader(fileName, 0);
    Promise.all(proms).then(() => {
      const program = gl.createProgram();
      if (!program) return;
      for (let i = 0; i < shdsName.length; i++)
        gl.attachShader(program, shdsID[i]);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const Buf = gl.getProgramInfoLog(program);
        console.log(Buf);
      }
      this.shaders[n].name = fileName;
      this.shaders[n].progID = program;
    });
  }

  addShader(fileName: string) {
    for (let i = 0; i < this.shadersNum; i++)
      if (this.shaders[i].name == fileName) return i;

    this.load(fileName);
    return this.shadersNum++;
  }

  getShader(index: number) {
    if (index < 0 || index > this.shadersNum) return this.shaders[0];
    return this.shaders[index];
  }
}
