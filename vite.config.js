import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        host: '0.0.0.0',
        port: 5000,
        hmr: {
            clientPort: 443
        },
        proxy: {},
        watch: {
            usePolling: true
        },
        allowedHosts: ['localhost', '.replit.dev', '.replit.app', '.ngrok.io']
    }
});