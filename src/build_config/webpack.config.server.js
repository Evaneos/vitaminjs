import { config, createBabelLoaderConfig } from './webpack.config.common';
import { fondationResolve, appResolve, concat } from '../utils/index';
import { BannerPlugin } from 'webpack';
import mergeWith from 'lodash.mergewith';
import fs from 'fs';
import path from 'path';


const externalModules = (modulesPath) => fs
    .readdirSync(modulesPath)
    .filter(m => m !== '.bin');
const appModules = externalModules(appResolve('node_modules'));
const fondationModules = externalModules(fondationResolve('node_modules'));
const whiteList = ['webpack/hot/poll.js?1000'];
const externals = function (context, request, callback) {
    var pathStart = request.split('/')[0];
    if (whiteList.indexOf(request) !== -1) {
        return callback();
    }
    if (appModules.indexOf(pathStart) !== -1) {
        return callback(null, `commonjs2 ${request}`);
    }
    if (fondationModules.indexOf(pathStart) !== -1) {
        return callback(null, `commonjs2 fondation/node_modules/${request}`);
    }
    return callback();
};

module.exports = function (options) {
    return mergeWith({}, config(options), {
        entry: [
            ...(options.hot ? ['webpack/hot/poll.js?1000'] : []),
            fondationResolve('src', 'server', 'index.js'),
        ],
        output: {
            path: appResolve('build'),
            filename: 'server.js',
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
            loaders: [createBabelLoaderConfig('.babelrc.node', false)],
        },
        plugins: [
            ...(options.dev ? [new BannerPlugin({
                banner: 'require("source-map-support").install();',
                raw: true, entryOnly: false,
            })] : [])
        ],
    }, concat);
};
