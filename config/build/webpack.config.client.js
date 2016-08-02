import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';
import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import appConfig from '../index';

function clientConfig(options, entryName, entryPath) {
    return mergeWith({}, config(options), {
        entry: entryPath,
        output: {
            filename: entryName,
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
}

const secondaryEntries = appConfig.build.client.secondaryEntries;
for (const key of Object.keys(secondaryEntries)) {
    secondaryEntries[key] = appResolve(secondaryEntries[key]);
}
const entries = {
    [appConfig.build.client.filename]: vitaminResolve('src', 'client', 'index.js'),
    ...secondaryEntries,
};
module.exports = options =>
    Object.keys(entries).map(
        entryName => clientConfig(options, entryName, entries[entryName])
    );

