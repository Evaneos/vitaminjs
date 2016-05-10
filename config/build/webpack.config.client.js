import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { concat, vitaminResolve } from '../utils';
import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import appConfig from '../index';
module.exports = function clientConfig(options) {
    return mergeWith({}, config(options), {
        entry: [
            vitaminResolve('src', 'client', 'index.js'),
        ],
        output: {
            // TODO : put hash in name
            filename: appConfig.build.client.filename,
        },
        module: {
            loaders: [
                createBabelLoaderConfig('client'),
                // The following loader will resolve the config to its final value during the build
                {
                    test: vitaminResolve('config/index'),
                    loader: vitaminResolve('config/build/requireLoader'),
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
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
        ],
    }, concat);
};
