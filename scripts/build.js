import * as esbuild from 'esbuild';
import mri from 'mri';

const argv = process.argv.slice(2);
const args = mri(argv, { boolean: ['eswatch', 'minify', 'sourceman' ]});

console.log(argv);
console.log(args);

const context = await esbuild.context({
  entryPoints: ['src/client/index.jsx'],
  outfile: 'public/index.js',
  bundle: true,
  minify: args.minify,
  sourcemap: args.sourcemap,
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
