import { config, createBabelLoaderConfig } from './webpack.config.common';
import { vitaminResolve, appResolve, concat } from '../utils/index';
import { BannerPlugin } from 'webpack';
import mergeWith from 'lodash.mergewith';
import appConfig from './index';
import fs from 'fs';

const externalModules = (modulesPath) => fs
    .readdirSync(modulesPath)
    .filter(m => m !== '.bin');
const appModules = externalModules(appResolve('node_modules'));
const vitaminModules = externalModules(vitaminResolve('node_modules'));
const whiteList = ['webpack/hot/poll.js?1000'];

function externals(context, request, callback) {
    const pathStart = request.split('/')[0];
    if (whiteList.indexOf(request) !== -1) {
        return callback();
    }
    if (appModules.indexOf(pathStart) !== -1) {
        return callback(null, `commonjs2 ${request}`);
    }
    if (vitaminModules.indexOf(pathStart) !== -1) {
        return callback(null, `commonjs2 vitamin/node_modules/${request}`);
    }
    return callback();
}

module.exports = function serverConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            ...(options.hot ? ['webpack/hot/poll.js?1000'] : []),
            vitaminResolve('src', 'server', 'server.js'),
        ],
        output: {
            filename: appConfig.build.server.filename,
            libraryTarget: 'commonjs2',
        },

        target: 'node',
        externals: [externals],
        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
        },

        module: {
            loaders: [createBabelLoaderConfig(true)],
        },
        plugins: [
            ...(options.dev ? [new BannerPlugin({
                banner: 'require("vitamin/node_modules/source-map-support").install();',
                raw: true, entryOnly: false,
            })] : []),
        ],
    }, concat);
};
