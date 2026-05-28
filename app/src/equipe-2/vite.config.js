import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/equipe-2/',
  build: {
    outDir: '../../dist/equipe-2',
    emptyOutDir: true,
  },
});
