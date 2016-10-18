import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';
import appConfig from '../index';

function clientConfig(options) {
    const hotMiddlewareEntry =
        `webpack-hot-middleware/client?path=${appConfig.publicPath}/__webpack_hmr`;
    return mergeWith({}, config(options), {
        entry: [
            vitaminResolve('src', 'client', 'index.jsx'),
            ...(options.hot ? [hotMiddlewareEntry] : []),
        ],
        output: {
            path: appConfig.client.buildPath,
            filename: appConfig.client.filename,
        },
        module: {
            rules: [
                createBabelLoaderConfig('client'),
                // The following loader will resolve the config to its final value during the build
                {
                    test: vitaminResolve('config/index'),
                    loader: vitaminResolve('config/build/requireLoader'),
                }],
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
            ...(appConfig.client.serviceWorker ? [
                new ServiceWorkerWebpackPlugin({
                    entry: appResolve(appConfig.client.serviceWorker),
                }),
            ] : []),
        ],
    }, concat);
}

module.exports = clientConfig;
