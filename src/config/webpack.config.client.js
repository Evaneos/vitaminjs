import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { concat, vitaminResolve } from '../utils';
import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import appConfig from './index';
module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            vitaminResolve('src', 'index.js'),
        ],
        output: {
            // TODO : put hash in name
            filename: appConfig.build.client.filename,
        },
        module: {
            loaders: [
                createBabelLoaderConfig(false),
                {
                    test: vitaminResolve('src/config/index.js'),
                    loader: vitaminResolve('src/config/requireLoader'),
                }],
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
