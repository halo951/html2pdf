import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import { RollupOptions } from 'rollup'
import pkg from './package.json'

const banner: string = `
/** 
 * ${pkg.name}@${pkg.version}
 * 
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.url}>
 * Released under ${pkg.license} License
 * 
 * @author ${pkg.author.name}(${pkg.author.url})
 * @license ${pkg.license}
 */
`.trim()

/** export rollup.config */
export default async (): Promise<RollupOptions | Array<RollupOptions>> => {
    return {
        input: 'src/index.ts',
        plugins: [
            // 编译
            typescript({ clean: true, useTsconfigDeclarationDir: true, abortOnError: true }),
            // 压缩
            terser()
        ],
        output: [
            // output to cjs
            {
                exports: 'auto',
                inlineDynamicImports: true,
                banner,
                format: 'cjs',
                file: `dist/index.cjs.js`,
                sourcemap: 'inline'
            },
            // output to esm
            {
                exports: 'auto',
                inlineDynamicImports: true,
                banner,
                format: 'es',
                file: `dist/index.es.js`,
                sourcemap: 'inline'
            }
        ]
    }
}
