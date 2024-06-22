const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

module.exports = {
  input: './client/src/Main.tsx',
  output: {
    file: 'client/main.js',
    format: 'es',
    name: 'XXX',
    sourcemap: 'inline',
    inlineDynamicImports: true
  },
  external: ['fs'],
  plugins: [
    resolve({ jsnext: true, main: true, browser: true }),
    typescript(),
    commonjs(),
    nodeResolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': '"development"'
    })
  ]
};
