import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './server/src/main.ts',
  output: {
    dir: 'server',
    format: 'iife',
    name: 'XXX',
    sourcemap: 'inline'
  },
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve()
  ]
};
