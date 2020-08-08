import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import banner from 'rollup-plugin-banner';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const extensions = ['.js', '.ts'];

const bannerContent = `
<%= pkg.name %> v<%= pkg.version %>
release at ${new Date().toLocaleDateString()}
by <%= pkg.author %>
github <%= pkg.homepage %>
`.trim();

const outputs = {
  esm: {
    file: pkg.module,
    format: 'esm',
  },
  umd: {
    file: pkg.main,
    format: 'umd',
    exports: 'named',
    name: 'KbDragDrop',
  },
  uglify: {
    file: pkg.main.replace('.js', '.min.js'),
    format: 'umd',
    exports: 'named',
    name: 'KbDragDrop',
  },
};

const plugins = [
  resolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  typescript(),
  babel({
    exclude: 'node_modules/**',
    babelrc: false,
    presets: ['@babel/preset-typescript'],
    extensions,
  }),
  banner(bannerContent),
];

const format = process.env.format || 'uglify';
format === 'uglify' && plugins.splice(2, 0, uglify());

export default {
  input: 'src/index.ts',
  output: {
    globals: {
      hammerjs: 'Hammer',
    },
    ...outputs[format],
  },
  plugins: plugins,
  external: ['hammerjs'],
};
