import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

import { createBabelLoader, createResolveConfigLoader, config } from './webpack.config.common.js';
import { resolveConfigModule, resolveParentModule } from '../resolve';
import { concat } from '../utils';

export default function clientConfig(options) {
    const hotMiddlewareEntry =
        `webpack-hot-middleware/client?path=${options.publicPath}/__webpack_hmr`;
    return mergeWith({}, config(options), {
        entry: [
            // FIXME Should we use resolveParentModule() or give a context to webpack?
            resolveParentModule('vitaminjs-runtime/src/client/index'),
            options.hot && hotMiddlewareEntry,
        ].filter(Boolean),
        output: {
            path: options.client.buildPath,
            filename: options.client.filename,
        },
        module: {
            rules: [
                createBabelLoader('client', options),
                createResolveConfigLoader(),
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            options.hot && new webpack.NoEmitOnErrorsPlugin(),
            !options.dev && new webpack.optimize.UglifyJsPlugin({ minimize: true }),
            options.client.serviceWorker && new ServiceWorkerWebpackPlugin({
                // FIXME Move resolving with other config props
                entry: resolveConfigModule(options.client.serviceWorker),
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
