import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/etec/',
  plugins: [react()],
  test: {
    setupFiles: './src/test/setupTests.js',
  },
});
