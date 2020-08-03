import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

const extensions = ['.js', '.ts'];

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'KbDragDrop',
    globals: {
      hammerjs: 'Hammer',
    }
  },
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['@babel/preset-typescript'],
      extensions,
    }),
  ],
  external: ['hammerjs'],
};
