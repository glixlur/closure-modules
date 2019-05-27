import node from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

// Build test file.
export default {
  input: './test/index.js',
  output: {
    file: './test/out.js',
    format: 'cjs',
  },
  plugins: [
    node(),
    babel(),
  ]
}
