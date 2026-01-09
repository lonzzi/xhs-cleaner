import { build } from 'bun';
import { writeFileSync, readFileSync } from 'fs';

await build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  minify: true,
});

const meta = readFileSync('src/meta.txt', 'utf8');
const code = readFileSync('dist/index.js', 'utf8');

writeFileSync('dist/xhs-cleaner.user.js', `${meta}\n\n${code}`);
