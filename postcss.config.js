import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import UnoCSS from '@unocss/postcss';
export default {
    plugins: [
        UnoCSS(),
        // purgeCSSPlugin({
        //     content: [
        //         './layout/*',
        //         './sections/*',
        //         './templates/*',
        //         './snippets/*',
        //         './resources/js/**/*.js',
        //         './resources/js/**/*.vue',
        //     ],
        //     safelist: {
        //         standard: ['html', 'body', 'open', '--dark'],
        //         deep: [],
        //         greedy: [
        //             /.*\-\-.*/,
        //             /^--*/,
        //             /.*--/,
        //             /--/,
        //             /.--/,
        //             /.*--.*/,
        //             /(\*?\.)?[a-zA-Z0-9_-]+(\.\-\-[a-zA-Z0-9_-]+)+/,
        //         ],
        //     },
        // }),
        autoprefixer,
    ],
};
