import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

import { createBabelLoader, createResolveConfigLoader, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';

export default function clientConfig(options) {
    const hotMiddlewareEntry =
        `webpack-hot-middleware/client?path=${options.publicPath}/__webpack_hmr`;
    return mergeWith({}, config(options), {
        entry: {
            [options.client.name]: [
                vitaminResolve('src', 'client', 'index.jsx'),
                options.hot && hotMiddlewareEntry,
            ].filter(Boolean),
            ...options.client.entries,
        },
        output: {
            path: options.client.buildPath,
            filename: options.client.filename,
            chunkFilename: options.client.chunkFilename,
        },
        module: {
            rules: [
                createBabelLoader('client', options.dev),
                createResolveConfigLoader(),
            ],
        },
        plugins: [
            // user-defined chunks
            ...(Object.keys(options.client.commonChunks).map(chunkKey => (
                new webpack.optimize.CommonsChunkPlugin({
                    name: chunkKey,
                    chunks: options.client.chunks[chunkKey],
                    children: true,
                    minChunks: Infinity,
                    // async: options.http2,
                })
            ))),
            // vendor chunk
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                // this assumes your vendor imports exist in the node_modules directory
                minChunks: module => console.log(module.context) || module.context && module.context.includes('node_modules'),
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),

            options.hot && new webpack.NoEmitOnErrorsPlugin(),
            options.hot && new webpack.optimize.OccurrenceOrderPlugin(),

            !options.dev && new webpack.optimize.UglifyJsPlugin({ minimize: true }),

            options.client.serviceWorker && new ServiceWorkerWebpackPlugin({
                entry: appResolve(options.client.serviceWorker),
            }),
        ].filter(Boolean),
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        // fs and module are used by source-map-support
        node: {
            fs: 'empty',
            module: 'empty',
        },
    }, concat);
}
