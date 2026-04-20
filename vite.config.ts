import path from 'node:path';

import externalGlobals from 'rollup-plugin-external-globals';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: './widget/src',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'widget/src/scripts'),
      '@assets': path.resolve(__dirname, 'widget/src/assets'),
      '@styles': path.resolve(__dirname, 'widget/src/styles'),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: ['index.html', 'fields.json', 'data.json'].map((file) => ({
        src: file,
        dest: '.',
        rename: { stripBase: true },
      })),
    }),
  ],
  build: {
    outDir: '../compiled',
    emptyOutDir: true,
    cssMinify: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        script: path.resolve(__dirname, 'widget/src/scripts/index.ts'),
        style: path.resolve(__dirname, 'widget/src/styles/index.scss'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
      plugins: [
        externalGlobals({
          '@tixyel/streamelements': "globalThis['@tixyel/streamelements']",
        }),
      ],
    },
  },
});
