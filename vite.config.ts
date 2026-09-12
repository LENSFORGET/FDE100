import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'./',build:{rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules'))return 'vendor';if(id.includes('/data/cases.json'))return 'report';}}}}});
