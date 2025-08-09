import esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const isWatch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Copy static files
const staticFiles = [
  { src: 'manifest.json', dest: 'dist/manifest.json' },
  { src: 'static/options.html', dest: 'dist/options.html' },
  { src: 'static/styles.css', dest: 'dist/styles.css' },
];

staticFiles.forEach(({ src, dest }) => {
  if (existsSync(src)) {
    // Ensure destination directory exists
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  } else {
    console.warn(`Warning: ${src} not found, skipping...`);
  }
});

// Copy icons if they exist
if (existsSync('static/icons')) {
  if (!existsSync('dist/icons')) {
    mkdirSync('dist/icons', { recursive: true });
  }
  // Copy all icon files
  const { readdirSync } = await import('fs');
  const iconFiles = readdirSync('static/icons');
  iconFiles.forEach(iconFile => {
    const src = join('static/icons', iconFile);
    const dest = join('dist/icons', iconFile);
    copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  });
}

// esbuild configuration
const buildOptions = {
  entryPoints: [
    'src/content.ts',
    'src/options.ts'
  ],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  minify: !isWatch,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
  },
  logLevel: 'info',
};

if (isWatch) {
  console.log('Starting watch mode...');
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  console.log('Building extension...');
  await esbuild.build(buildOptions);
  console.log('Build complete!');
}