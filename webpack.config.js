const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const DEBUG = argv.mode !== 'production';

    return {
        mode: DEBUG ? 'development' : 'production',
        entry: {
            'main.js': [
                'jquery',
                './src/js/main.js'
            ],
            'ie9': [
                './src/sass/ie9.scss'
            ],
            'main': [
                './src/sass/main.scss'
            ],
            'noscript': [
                './src/sass/noscript.scss'
            ],
        },
        output: {
            filename: '[name]',
            path: path.resolve(__dirname, 'build')
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new HtmlWebpackPlugin({
                hash: true,
                cache: true,
                template: './src/index.html',
                excludeChunks: [
                    'ie9',
                    'noscript'
                ],
                minify: DEBUG ? false : {
                    collapseWhitespace: true,
                    preserveLineBreaks: false
                }
            })
        ],
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    cache: true,
                    parallel: true,
                    extractComments: true
                }),
                new OptimizeCSSAssetsPlugin({
                    template: './src/index.html',
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                },
                {
                    test: /\.(png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }]
                }
            ]
        }
    };
}