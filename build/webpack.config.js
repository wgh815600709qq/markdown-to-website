const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = {
    mode: "production",
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
                exclude: path.resolve(__dirname, 'node_modules'),
                query: {
                    presets: ['react', 'es2015', "stage-0"]
                }
            }, {
                test: /(\.css|\.less)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: true,
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:4]',
                            minimize: false
                        }
                    },
                        'postcss-loader',
                        'less-loader'
                    ],
                    publicPath: path.resolve(__dirname, 'dist/css')
                })
            }, {
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
        new ExtractTextPlugin('style.css')
    ],
};
module.exports = config