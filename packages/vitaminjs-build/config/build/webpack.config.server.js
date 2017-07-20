import { optimize, BannerPlugin, DefinePlugin } from 'webpack';
import mergeWith from 'lodash.mergewith';
import { config, createBabelLoader, createResolveConfigLoader } from './webpack.config.common';
import { isExternalModule, isRuntimeModule, resolveParentModule, __isVitaminFacadeModule } from '../resolve';
import { concat } from '../utils';

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
        !request.startsWith('!')
    ) {
        // FIXME Why commonjs2 over commonjs
        callback(null, 'commonjs2 ' + request);
        return;
    }

    callback();
}


export default function serverConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            options.hot && require.resolve('../utils/hot'),
            resolveParentModule('vitaminjs-runtime/src/server/server'),
        ].filter(Boolean),
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
}
