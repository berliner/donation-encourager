import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
export default {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'donation-encourager.js',
        // library: 'donationEncourager',
        // libraryTarget: 'window',
        // libraryExport: 'default'
    },
    resolve: {
        "alias": {
          "react": "preact/compat",
          "react-dom": "preact/compat"
        }
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }]
          }, {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
          }, {
            test: /\.css$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader" // translates CSS into CommonJS
            ]
          }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            title: 'Custom template',
            inject: false,
            template: path.join(__dirname, 'src/index.html')
        }),
    ],
    stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        colors: true,
        timings: true
    },
    devtool: 'source-map'
};