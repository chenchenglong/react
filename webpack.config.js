const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

// process.env.NODE_ENV = 'development';
// let env = process.env.NODE_ENV || 'beta';
// console.log(`Running in ${env} mode.`);

let jsx = glob.sync(`./src/pages/*/index.jsx`).reduce((prev, curr) => {
    prev[curr.slice(6, -4)] = [curr];
    return prev;
}, {});

let html = glob.sync(`./src/pages/*/index.html`).map(item => {
    return new HtmlWebpackPlugin({
        item: item.slice(6, -5),
        data: {
            build: false
        },
        filename: item.substr(6),
        template: `ejs-compiled-loader!${item}`,
        inject: false,
        minify: false
    });
});

let config = {
    entry: jsx,
    output: {
        path: BUILD_DIR,
        publicPath: '/',
        filename: '[name].[chunkhash].js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'src': path.resolve(__dirname, APP_DIR),
            'components': path.resolve(__dirname, `${APP_DIR}/modules/components`),
            'common': path.resolve(__dirname, `${APP_DIR}/modules/common`)
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'babel-loader',
                ],
                include: [
                    APP_DIR
                ],
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
    ].concat(html),
    devtool: 'eval-source-map',
    devServer: {
        host: '0.0.0.0',
        port: 9090,
        contentBase: BUILD_DIR,
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
