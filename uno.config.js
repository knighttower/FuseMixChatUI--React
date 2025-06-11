import { defineConfig } from 'unocss';
import { presetAttributify, presetUno } from 'unocss';

export default defineConfig({
    presets: [presetUno(), presetAttributify()],
    postcss: false,
    transformCSS: 'pre',
    // frontend: true,
    content: {
        filesystem: ['./src/**/*.blade.php', './src/**/*.html', './src/**/*.js', './src/**/*.vue'],
    },
    // hmrTopLevelAwait: true,
    // fetchMode: 'no-cors',
    // cli: {
    //     entry: {
    //         patterns: [
    //             'resources/views/**/*.blade.php',
    //             'resources/html/**/*.html',
    //             'resources/js/**/*.vue',
    //         ],
    //         outFile: 'resources/css/uno.css',
    //     },
    // },
    theme: {
        breakpoints: {
            xs: '360px',
            sm: '599px',
            mobile: '599px',
            md: '768px',
            tablet: '768px',
            lg: '1023px',
            desktop: '1023px',
            xl: '1200px',
        },
    },
    blocklist: [
        'w-25',
        'w-33',
        'w-50',
        'w-66',
        'w-75',
        'w-100',
        'w-10',
        'w-20',
        'w-30',
        'w-40',
        'w-60',
        'w-70',
        'w-80',
        'w-90',
    ],
});
