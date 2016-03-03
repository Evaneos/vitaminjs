import path from 'path';
import { createBabelLoaderConfig, APP_SOURCE_DIR, config } from './webpack.config.common.js';
import { appResolve, concat } from '../utils';
import serverConfig from '../app_descriptor/server';
import appConfig from '../app_descriptor/app';
import mergeWith from 'lodash.mergewith';

if (module.hot) {
    module.hot.accept('../app_descriptor/app', () => {
        const basename = require('../app_descriptor/app').default.basename;
        if (basename !== appConfig.basename) {
            throw new Error('Cannot hot reload basename of the app, aborting');
        }
    });
}

module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            path.join(APP_SOURCE_DIR, 'client.js'),
            ...(options.hot ? [
                `webpack-dev-server/client?${serverConfig.host}:${serverConfig.port}/${
                    appConfig.basename}`,
                'webpack/hot/dev-server',
            ] : []),
        ],
        output: {
            path: appResolve('public'),
            // TODO : put hash in name
            filename: 'bundle.js',
            publicPath: '/',
        },
        module: {
            loaders: [
                createBabelLoaderConfig(false, options.hot),
            ],
        },
    }, concat);
};
