const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const hashedName = isProduction ? '[name]' : '[name]';
    const resourcesDir = 'src';
    const targetOutput = 'public/assets';
    const jsDirOutput = targetOutput + '/js';
    const cssDirOutput = targetOutput + '/css';
    const baseSettings = {
        stats: isProduction ? 'normal' : 'minimal',
        resolve: {
            modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
            alias: {
                '@src': path.resolve(__dirname, resourcesDir),
                '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
                '~knighttower': path.resolve(__dirname, 'node_modules/knighttower'),
                vue: 'vue/dist/vue.esm-bundler.js',
            },
        },
        externals: {
            vue: ['Vue'],
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    // exclude: [/cb\.js$/, /extra\.js$/],
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                        ie8: false,
                        ecma: 6, // Specify ECMAScript target version: 5 for IE8 support
                        keep_classnames: true, // Preserve class names
                        keep_fnames: true, // Preserve function names
                        safari10: true, // Workaround for Safari 10/11 loop scoping and await bugs
                        toplevel: false, // Mangle toplevel names

                        output: {
                            ascii_only: true,
                            braces: true,
                            comments: 'none',
                            inline_script: true,
                            keep_numbers: false,
                            keep_quoted_props: false,
                            preamble: null,
                            quote_keys: false,
                            quote_style: 0,
                            semicolons: true,
                            shebang: true,
                            webkit: false,
                            wrap_iife: false,
                            wrap_func_args: true,
                        },

                        compress: {
                            arrows: true,
                            arguments: false,
                            booleans: false,
                            booleans_as_integers: false,
                            collapse_vars: false,
                            comparisons: false,
                            computed_props: false,
                            conditionals: false,
                            dead_code: false,
                            directives: false,
                            drop_console: false,
                            drop_debugger: false,
                            evaluate: false,
                            expression: false,
                            global_defs: {},
                            hoist_funs: false,
                            hoist_props: false,
                            hoist_vars: false,
                            if_return: false,
                            inline: 3,
                            join_vars: false,
                            keep_fargs: false,
                            keep_infinity: false,
                            loops: false,
                            negate_iife: false,
                            properties: false,
                            pure_funcs: [],
                            pure_getters: false,
                            reduce_funcs: false,
                            reduce_vars: false,
                            sequences: false,
                            side_effects: false,
                            switches: false,
                            top_retain: [],
                            typeofs: false,
                            unsafe: false,
                            unsafe_arrows: false,
                            unsafe_comps: false,
                            unsafe_Function: false,
                            unsafe_math: false,
                            unsafe_proto: false,
                            unsafe_regexp: false,
                            unsafe_undefined: false,
                            unused: false,
                        },
                        parse: {
                            html5_comments: false, // Ignore HTML5 comments
                            shebang: true, // Preserve shebang
                            bare_returns: false,
                        },

                        mangle: {
                            eval: false,
                            reserved: ['dashboard'],
                        },
                    },

                    extractComments: false, // Do not extract comments to separate file
                }),
            ],
        },
    };

    const cssRulesUse = [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                url: false, // Do not handle URLs in your CSS
            },
        },
    ];

    const postCssSass = {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                    // require('autoprefixer'),
                    isProduction
                        ? purgeCSSPlugin({
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
                          })
                        : false,
                    isProduction ? require('cssnano') : false,
                ].filter(Boolean),
            },
        },
    };

    const vendorSettings = {
        optimization: {
            usedExports: true,
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    // exclude: [/cb\.js$/, /extra\.js$/],
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                        ecma: 6,
                        // keep_classnames: true, // Preserve class names
                        // keep_fnames: true, // Preserve function names
                        // safari10: true, // Workaround for Safari 10/11 loop scoping and await bugs

                        toplevel: true,
                        output: {
                            ascii_only: true, // Escape Unicode characters
                            braces: true, // Always insert braces in if, for, do, while or with statements
                            semicolons: true, // Separate statements with semicolons
                            comments: false,
                        },

                        compress: {
                            arrows: true, // Enable arrow function compression (transform to function expressions)
                        },
                        parse: {
                            html5_comments: false, // Ignore HTML5 comments
                            shebang: true, // Preserve shebang
                        },

                        mangle: true, // Disable variable renaming
                    },

                    extractComments: false, // Do not extract comments to separate file
                }),
            ],
        },
    };

    const jsLibConfig = {
        module: {
            rules: [
                {
                    test: /\.(?:js|mjs|cjs)$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        modules: false,
                                        targets: '> 0.25%, not dead',
                                    },
                                ],
                            ],
                        },
                    },
                    exclude: /node_modules/,
                },
            ],
        },
    };

    return [
        // =========================================
        // --> CORE JS
        // --------------------------
        {
            ...baseSettings,
            ...vendorSettings,
            plugins: [
                new VueLoaderPlugin(),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                }),
            ],

            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            transformAssetUrls: {
                                base: null,
                                includeAbsolute: false,
                            },
                            reactivityTransform: true,
                        },
                    },

                    {
                        test: /\.css$/,
                        use: [...cssRulesUse, postCssSass],
                    },

                    {
                        test: /\.scss$/,
                        use: [
                            ...cssRulesUse,
                            postCssSass, // Make sure postcss.config.js is configured with your desired plugins
                            {
                                loader: 'sass-loader',
                                options: {
                                    sassOptions: {
                                        quietDeps: true,
                                        implementation: require('sass'), // Ensure Dart Sass is used
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            entry: {
                x_style: ['./src/resources/sass/app.scss'],
            },
            experiments: {
                // outputModule: true,
            },

            output: {
                path: path.resolve(__dirname, cssDirOutput),
                filename: hashedName + '.js',
                library: {
                    type: 'window',
                },

                chunkFilename: 'module.[contenthash:10].js', // Generates hex-like hash filenames
            },
        },
        {
            ...baseSettings,
            ...vendorSettings,
            plugins: [new VueLoaderPlugin()],

            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader',
                        options: {
                            transformAssetUrls: {
                                base: null,
                                includeAbsolute: false,
                            },
                            reactivityTransform: true,
                        },
                    },

                    ...jsLibConfig.module.rules,
                ],
            },
            entry: {
                x_app: ['./src/app.js'],
            },

            output: {
                path: path.resolve(__dirname, jsDirOutput),
                filename: hashedName + '.js',
                library: {
                    type: 'window',
                },

                chunkFilename: 'module.[contenthash:10].js', // Generates hex-like hash filenames
            },
        },
    ];
};
