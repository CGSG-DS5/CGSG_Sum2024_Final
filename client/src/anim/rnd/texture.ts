import { gl } from '../../canvas_context';
import { input } from '../input';

export class texture {
  name: string;
  texId: WebGLShader;
  isCube: boolean;
  constructor(name: string, texId: WebGLShader, isCube: boolean) {
    this.name = name;
    this.texId = texId;
    this.isCube = isCube;
  }
}

export class textureManager extends input {
  textures: texture[] = [];
  texturesNum: number = 0;

  add = (fileName: string) => {
    const n = this.texturesNum++;

    const res = gl.createTexture();
    if (!res) return -1;
    this.textures[n] = new texture(fileName, res, false);

    const img = new Image();
    img.src = 'bin/textures/' + fileName;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this.textures[n].texId);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    return n;
  };

  addCubemap = (name: string, ext: string) => {
    const n = this.texturesNum++;
    const names = ['PosX', 'NegX', 'PosY', 'NegY', 'PosZ', 'NegZ'];

    const res = gl.createTexture();
    if (!res) return -1;

    this.textures[n] = new texture(name, res, true);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[n].texId);

    let a = [false, false, false, false, false, false];

    for (let i = 0; i < 6; i++) {
      const img = new Image();
      img.src = 'bin/textures/skyboxes/' + name + '/' + names[i] + '.' + ext;
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[n].texId);
        gl.texImage2D(
          gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        a[i] = true;
        if (a[0] && a[1] && a[2] && a[3] && a[4] && a[5])
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      };
    }

    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return n;
  };
}
