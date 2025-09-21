import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        svgLoader({
            svgoConfig: {
                multipass: true
            },
            defaultImport: 'url'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/nekorify': {
                target: 'http://localhost:33001', // Nekorify后端地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/nekorify/, '/api')
            },
            '/ranaminder': {
                target: 'http://localhost:33002', // RanaMinder后端地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ranaminder/, '/api')
            },
            '/p/Nekorify': {
                target: 'http://oss.gdmuna.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/p\/Nekorify/, '/p/Nekorify')
            }
        }
    },
    assetsInclude: ['**/*.lottie']
});
