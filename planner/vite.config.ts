import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
export default defineConfig({
  base: './', plugins: [react(), {
    name: 'pdf-reader-assets',
    buildStart() {
      const target = resolve('public/pdf-assets');
      mkdirSync(target, { recursive: true });
      for (const folder of ['cmaps', 'standard_fonts']) {
        cpSync(resolve('node_modules/pdfjs-dist', folder), resolve(target, folder), { recursive: true });
      }
    },
  }],
  build: { sourcemap: false, manifest: true },
  server: { strictPort: true }
});
