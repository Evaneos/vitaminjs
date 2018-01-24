const { optimize, BannerPlugin, DefinePlugin } = require('webpack');
const mergeWith = require('lodash.mergewith');
const { config, createBabelLoader, createResolveConfigLoader } = require('./webpack.config.common');
const {
    isExternalModule,
    isRuntimeModule,
    resolveParentModule,
    __isVitaminFacadeModule,
    __hasWebpackLoader,
} = require('../resolve');
const { concat } = require('../utils');

function externals(context, request, callback) {
    // TODO Take a look at `webpack-node-externals`
    if (
        isExternalModule(request) &&
        // TODO Remove for Vitamin 2
        !__isVitaminFacadeModule(request) &&
        // Runtime should be built along with application because of our proprietary imports in it
        !isRuntimeModule(request) &&
        // Oh look, it's one of our proprietary imports! This is certainly not external
        !request.startsWith('__app_modules__') &&
        request !== '__vitamin_runtime_config__' &&
        // FIXME Internal webpack chained loaders syntax
        !__hasWebpackLoader(request)
    ) {
        // FIXME Why commonjs2 over commonjs
        callback(null, `commonjs2 ${request}`);
        return;
    }

    callback();
}


module.exports = function serverConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            options.hot && require.resolve('../utils/hot'),
            // FIXME Should we use resolveParentModule() or give a context to webpack?
            resolveParentModule('vitaminjs-runtime/src/server/server'),
        ].filter(Boolean),
        // TODO
        // context: '',
        output: {
            filename: options.server.filename,
            path: options.server.buildPath,
            libraryTarget: 'commonjs2',
        },

        target: 'node',
        externals,
        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
        },

        module: {
            rules: [
                createBabelLoader('server', options),
                createResolveConfigLoader(),
            ],
        },
        plugins: [
            new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
            options.dev && new BannerPlugin({
                banner: 'require("source-map-support").install({ environment: \'node\' });',
                raw: true,
                entryOnly: false,
            }),
            new DefinePlugin({
                ASSETS_BY_CHUNK_NAME: JSON.stringify(options.assetsByChunkName),
            }),
        ].filter(Boolean),
    }, concat);
};
