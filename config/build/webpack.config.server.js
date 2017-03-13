import { optimize, BannerPlugin, DefinePlugin } from 'webpack';
import mergeWith from 'lodash.mergewith';
import fs from 'fs';
import { config, createBabelLoader, createResolveConfigLoader } from './webpack.config.common';
import { vitaminResolve, appResolve, concat } from '../utils';

const safeReaddirSync = (path) => {
    try {
        return fs.readdirSync(path);
    } catch (e) {
        return [];
    }
};

const externalModules = modulesPath => safeReaddirSync(modulesPath).filter(m => m !== '.bin');
const appModules = externalModules(appResolve('node_modules')).filter(m => m !== 'vitaminjs');
const vitaminModules = externalModules(vitaminResolve('node_modules'));
const hotPoll = vitaminResolve('config', 'utils', 'hot.js');

function externals(context, request, callback) {
    const pathStart = request.split('/')[0];

    if (appModules.includes(pathStart)) {
        return callback(null, `commonjs2 ${request}`);
    }
    if (vitaminModules.includes(pathStart)) {
        return callback(null, `commonjs2 vitaminjs/node_modules/${request}`);
    }
    return callback();
}


export default function serverConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            options.hot && hotPoll,
            vitaminResolve('src', 'server', 'server.js'),
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
                createBabelLoader('server', options.dev),
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
