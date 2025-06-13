import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import UnoCSS from '@unocss/postcss';
import cssnano from 'cssnano';
export default {
    plugins: [
        UnoCSS(),
        process.env.NODE_ENV === 'production' &&
            purgeCSSPlugin({
                content: ['./src/*'],
                safelist: {
                    standard: ['html', 'body'],
                    deep: [],
                    greedy: [
                        //   /.*\-\-.*/,
                        //   /.*--/,
                        /^x-*/,
                        /--/,
                        /.--/,
                        /offset-/,
                        /col-sm/,
                        /col-lg/,
                        /col-md/,
                        /col-xl/,
                        /col-xxl-/,
                    ],
                },
            }),
        process.env.NODE_ENV === 'production' && cssnano(),
        autoprefixer,
    ],
};
