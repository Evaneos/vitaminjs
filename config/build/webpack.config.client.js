import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

import { createBabelLoader, createResolveConfigLoader, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';

export default function clientConfig(options) {
    const hotMiddlewareEntry =
        `webpack-hot-middleware/client?path=${options.publicPath}/__webpack_hmr`;
    return mergeWith({}, config(options), {
        entry: [
            vitaminResolve('src', 'client', 'index.jsx'),
            options.hot && hotMiddlewareEntry,
        ].filter(Boolean),
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
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),

            options.hot && new webpack.NoErrorsPlugin(),
            options.hot && new webpack.optimize.OccurrenceOrderPlugin(),

            !options.dev && new webpack.optimize.UglifyJsPlugin({ minimize: true }),

            options.client.serviceWorker && new ServiceWorkerWebpackPlugin({
                entry: appResolve(options.client.serviceWorker),
            }),
        ].filter(Boolean),
    }, concat);
}
