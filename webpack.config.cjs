const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
                '@': path.resolve(__dirname, resourcesDir),
                '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
                '~knighttower': path.resolve(__dirname, 'node_modules/knighttower'),
            },
            extensions: ['.js', '.jsx', '.mjs', '.cjs'],
        },
        externals: {},
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
        options: {},
    };

    const vendorSettings = {
        optimization: {
            usedExports: true,
            minimize: isProduction,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
            minimizer: [
                new TerserPlugin({
                    parallel: true,

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
                    test: /\.(?:js|mjs|cjs|jsx)$/,
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
                                '@babel/preset-react', // ✅ React preset
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
            ...jsLibConfig,
            plugins: [
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                }),
            ],

            module: {
                rules: [
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
                style: ['./src/resources/sass/app.scss'],
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
            ...jsLibConfig,
            plugins: [],
            entry: {
                app: ['./src/app.jsx'],
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
