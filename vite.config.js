import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../public/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
        style: resolve(__dirname, 'src/scss/main.scss'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req, _res, _options) => {
          // Let Vite handle its own assets
          if (
            req.url.startsWith('/src/') ||
            req.url.startsWith('/@vite/') ||
            req.url.startsWith('/@fs/')
          ) {
            return req.url;
          }
          // Proxy everything else to Express
          return null;
        },
      },
    },
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Remove additional data since we're using @use in each file
      },
    },
  },
});
