// 前端项目构建脚本
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const shelljs = require('shelljs');
const defaultStatsOptions = {
    colors: 'red',
    chunks: false,
    children: false
}
const config = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
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

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log('打包失败')
        console.log(err)
        console.log(stats.hasErrors())
        console.log(stats.toString(defaultStatsOptions))
        return
    }
    console.log('打包成功')
    shelljs.exec('node server.js')
});