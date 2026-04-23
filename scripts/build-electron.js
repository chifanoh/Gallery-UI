import { build } from 'esbuild'

// 构建主进程 - 输出为 .cjs
build({
  entryPoints: ['electron/main.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist-electron/main.cjs',
  format: 'cjs',
  external: ['electron']
}).then(() => {
  console.log('Main process build completed')
}).catch((err) => {
  console.error(err)
  process.exit(1)
})

// 构建 preload - 输出为 .cjs
build({
  entryPoints: ['electron/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist-electron/preload.cjs',
  format: 'cjs',
  external: ['electron']
}).then(() => {
  console.log('Preload build completed')
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
