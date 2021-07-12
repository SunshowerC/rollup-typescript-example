import { nodeResolve } from '@rollup/plugin-node-resolve' // 解析 node_modules 中的模块
import commonjs from '@rollup/plugin-commonjs' // cjs => esm
import alias from '@rollup/plugin-alias' // alias 和 reslove 功能
import replace from '@rollup/plugin-replace'
// import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import clear from 'rollup-plugin-clear'
import { name, version, author } from '../package.json'
import typescript from '@rollup/plugin-typescript';


const pkgName = 'vtools'
const banner =
'/*!\n' +
` * ${name} v${version}\n` +
` * (c) 2014-${new Date().getFullYear()} ${author}\n` +
' * Released under the MIT License.\n' +
' */'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${pkgName}.umd.js`,
      format: 'umd',
      name: pkgName,
      banner
    },
    {
      file: `dist/${pkgName}.umd.min.js`,
      format: 'umd',
      name: pkgName,
      banner,
      plugins: [terser()]
    },
    {
      file: `dist/${pkgName}.cjs.js`,
      format: 'cjs',
      name: pkgName,
      banner
    },
    {
      file: `dist/${pkgName}.esm.js`,
      format: 'es',
      banner
    }
  ],
  plugins: [
    clear({
      targets: ['dist']
    }),

    // TODO: 无法生存 ts 声明定义文件
    typescript({
      // declarationDir: "dist",
      outDir: "dist"
    }),
    
    alias(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      preventAssignment: true
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    // TODO: eslint typescript 暂未支持
    // eslint({
    //   throwOnError: true, // 抛出异常并阻止打包
    //   include: ['src/**'],
    //   exclude: ['node_modules/**']
    // }),
    babel({ 
      babelHelpers: 'bundled', 
      extensions: ['.ts']
    })
  ]
}
