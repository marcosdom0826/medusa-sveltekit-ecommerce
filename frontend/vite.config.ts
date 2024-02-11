/* eslint-disable no-console */
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import Unfonts from 'unplugin-fonts/vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        Unfonts(),
        Icons({
            autoInstall: true,
            compiler: 'svelte',
            scale: 1.2,
            transform: (svg) => svg.replace(/^<svg /, '<svg ')
        })
    ],
    // resolve: {
    //     alias: {
    //         $: resolve(__dirname, './src'),
    //         $lib: resolve(__dirname, './src/lib'),
    //         $components: resolve(__dirname, './src/lib/components')
    //     }
    // },
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        process.exit(1);
    })
    .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });
