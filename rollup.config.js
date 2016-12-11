/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import flow from 'rollup-plugin-flow';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

let entry = 'src/index.js';
let presetKey = 'default';

if (process.env.NODE_VERSION) {
  presetKey = `node${process.env.NODE_VERSION}`;
}

if (process.env.ENTRY) {
  entry = 'src/cli.js';
}

const babelPresets = {
  default: ['latest', { es2015: { modules: false } }],
  node6: ['env', { modules: false, targets: { node: '6' } }],
  node4: ['env', { modules: false, targets: { node: '4' } }],
};

export default {
  entry,
  plugins: [
    flow(),
    nodeResolve({ extensions: ['.js', '.json'] }),
    babel({
      presets: [babelPresets[presetKey]],
      plugins: ['transform-flow-strip-types', 'transform-object-rest-spread'],
      runtimeHelpers: true,
      babelrc: false,
    }),
    commonjs(),
  ],
  external,
  targets: [
    {
      dest: `./lib/cli/${presetKey}.js`,
      format: 'cjs',
    },
  ],
};
