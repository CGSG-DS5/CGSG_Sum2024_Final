const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');

module.exports = {
  input: './server/src/main.ts',
  output: {
    dir: 'server',
    format: 'cjs',
    name: 'XXX',
    sourcemap: 'inline'
  },
  external: ['fs'],
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    resolve(),
    typescript(),
    commonjs(),
    json()
  ]
};
