import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Veio do seu arquivo original
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'views/equipe-7'), // Onde estão seus arquivos fontes
  base: '/equipe-7/', 
  build: {
    // 📍 ALTERADO: Agora a pasta dist vai nascer DIRETO dentro da sua pasta equipe-7!
    outDir: path.resolve(__dirname, 'views/equipe-7/dist'), 
    emptyOutDir: true, // Limpa apenas a SUA nova pasta dist antes de gerar os arquivos
  },
});