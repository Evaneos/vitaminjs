import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { appResolve, concat, fondationResolve } from '../utils';
import appConfig from '../app_descriptor/shared';
import buildConfig from '../app_descriptor/build';
import serverConfig from '../app_descriptor/server';
import mergeWith from 'lodash.mergewith';

if (module.hot) {
    module.hot.accept('../app_descriptor/shared', () => {
        const basename = require('../app_descriptor/shared').default.basename;
        if (basename !== appConfig.basename) {
            throw new Error('Cannot hot reload basename of the app, aborting');
        }
    });
}

module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            fondationResolve('src', 'index.js'),
            ...(options.hot ? [
                `webpack-dev-server/client?${serverConfig.host}:${serverConfig.port}/${
                    appConfig.basename}`,
                'webpack/hot/dev-server',
            ] : []),
        ],
        output: {
            path: appResolve(buildConfig.client.path),
            // TODO : put hash in name
            filename: buildConfig.client.filename,
            publicPath: `/${appConfig.basename}`,
        },
        module: {
            loaders: [
                createBabelLoaderConfig(false, options.hot),
            ],
        },
    }, concat);
};
