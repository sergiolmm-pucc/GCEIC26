import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'views/equipe-25'),
  base: '/equipe-25/',
  build: {
    outDir: path.resolve(__dirname, 'views/equipe-25/dist'),
    emptyOutDir: true,
  },
});
