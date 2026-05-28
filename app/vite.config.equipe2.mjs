import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, 'src/equipe-2'),
  base: '/equipe-2/',
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist/equipe-2'),
    emptyOutDir: true,
  },
});
