import { readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'tsdown/config'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  workspace: 'packages/*',
  entry: ['./src/*.ts', '!./**.d.ts'],
  format: 'esm',
  watch: !!process.env.DEV,
  plugins: [Vue({ isProduction: true })],
  clean: true,
  define: {
    'import.meta.DEV': JSON.stringify(!!process.env.DEV),
  },
  platform: 'neutral',
  dts: {
    vue: true,
  },
  unused: {
    level: 'error',
  },
  report: false,
  exports: {
    devExports: 'dev',
    all: true,
    async customExports(exports, { outDir }) {
      const hasRootDts = (await readdir(path.dirname(outDir))).some((file) =>
        file.endsWith('.d.ts'),
      )
      if (hasRootDts) {
        exports['./*'] = ['./*', './*.d.ts']
      }

      return exports
    },
  },
})
