import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { appResolve, concat, fondationResolve } from '../utils';
import buildConfig from '../app_descriptor/build';
import serverConfig from '../app_descriptor/server';
import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';

module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            fondationResolve('src', 'index.js'),
        ],
        output: {
            path: appResolve(buildConfig.client.path),
            // TODO : put hash in name
            filename: buildConfig.client.filename,
            publicPath: `${buildConfig.basename}${serverConfig.publicUrl}/`,
        },
        module: {
            loaders: [
                createBabelLoaderConfig(false),
            ],
        },
        plugins: [
            ...(options.hot ? [
                new webpack.NoErrorsPlugin(),
                new webpack.optimize.OccurrenceOrderPlugin(),
            ] : []),
            ...(!options.dev ? [
                new webpack.optimize.UglifyJsPlugin({ minimize: true }),
            ] : []),
        ],
    }, concat);
};
