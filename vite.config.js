import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('radix-vue')) {
                            return 'ui-kit';
                        }
                        if (id.includes('@vueuse')) {
                            return 'vueuse';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
