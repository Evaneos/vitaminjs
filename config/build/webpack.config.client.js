import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

import { createBabelLoader, createResolveConfigLoader, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';

function clientConfig(options) {
    const hotMiddlewareEntry =
        `webpack-hot-middleware/client?path=${options.publicPath}/__webpack_hmr`;
    return mergeWith({}, config(options), {
        entry: [
            vitaminResolve('src', 'client', 'index.jsx'),
            ...(options.hot ? [hotMiddlewareEntry] : []),
        ],
        output: {
            path: options.client.buildPath,
            filename: options.client.filename,
        },
        module: {
            rules: [
                createBabelLoader('client'),
                createResolveConfigLoader(),
            ],
        },
        plugins: [
            ...(options.hot ? [
                new webpack.NoErrorsPlugin(),
                new webpack.optimize.OccurrenceOrderPlugin(),
            ] : []),
            ...(!options.dev ? [
                new webpack.optimize.UglifyJsPlugin({ minimize: true }),
            ] : []),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            ...(options.client.serviceWorker ? [
                new ServiceWorkerWebpackPlugin({
                    entry: appResolve(options.client.serviceWorker),
                }),
            ] : []),
        ],
    }, concat);
}

module.exports = clientConfig;
