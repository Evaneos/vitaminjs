import path from 'path';
import { createBabelLoaderConfig, APP_SOURCE_DIR, config } from './webpack.config.common.js';
import { appResolve, concat } from '../utils';
import serverConfig from '../app_descriptor/server';
import mergeWith from 'lodash.mergewith';

module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            path.join(APP_SOURCE_DIR, 'client.js'),
            ...(options.hot ? [
                `webpack-dev-server/client?${serverConfig.host}:${serverConfig.port}`,
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
                createBabelLoaderConfig('.babelrc.browser', options.hot),
            ],
        },
    }, concat);
};
