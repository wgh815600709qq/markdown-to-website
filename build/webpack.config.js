const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSS_NAME = 'css/[name].css';
const LESS_NAME = '[name]_[local]_[hash:base64:4]';
const config = {
    mode: "development",
    entry: path.resolve(__dirname, '../dist/dynamicRouter.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loaders: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // sourceMap: false,
                            // importLoaders: true,
                            // modules: true,
                            // localIdentName: LESS_NAME,
                            // minimize: false
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: {},
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
                use: ['url-loader']
            }, {
                test: /\.(png|jpe?g|gif)$/,
                use: ['url-loader?limit=10240&name=img/[hash:8].[name].[ext]']
            }, {
                test: /\.json$/,
                use: ['json-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css',
            allChunks: true
        }),
        new MiniCssExtractPlugin({
            filename: CSS_NAME,
            chunkFilename: CSS_NAME
        })
    ],
};
module.exports = config