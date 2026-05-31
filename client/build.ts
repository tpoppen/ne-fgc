import esbuild from 'esbuild';
import mri from 'mri';
import path from 'path';
import { fileURLToPath } from 'url';

const argv = process.argv.slice(2);
const args = mri(argv, { boolean: ['bundle', 'minify', 'sourcemaps', 'eswatch'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../', 'public');
console.log({
  __dirname,
  publicDir,
  bundle: args.bundle,
  sourcemap: args.sourcemaps,
  minify: args.minify,
});

const context = await esbuild.context({
  entryPoints: ['index.tsx'],
  bundle: args.bundle,
  sourcemap: args.sourcemaps,
  minify: args.minify,
  outfile: path.join(publicDir, 'index.js'),
  jsx: 'automatic'
});

console.log("Building...");
console.time("Finished Build:");
await context.rebuild();
console.timeEnd("Finished Build:");

if (args.eswatch) {
  console.log("Watching...");
  await context.watch();
} else {
  context.dispose();
}
