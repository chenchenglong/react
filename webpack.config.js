var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: [
                    'babel-loader',
                ],
                include: [
                    // path.resolve(__dirname, "app")
                    APP_DIR
                ],
            }
        ]
    },
    devServer: {
        host: '0.0.0.0',
        port: 9090,
        contentBase: path.resolve('./dist'),
        historyApiFallback: true,
        inline: true,
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    }
};

module.exports = config;
