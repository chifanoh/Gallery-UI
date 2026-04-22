import { build } from 'esbuild'

build({
  entryPoints: ['electron/main.ts', 'electron/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outdir: 'dist-electron',
  format: 'cjs',
  external: ['electron']
}).then(() => {
  console.log('Electron build completed')
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
