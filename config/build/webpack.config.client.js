import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import { createBabelLoaderConfig, config } from './webpack.config.common.js';
import { concat, vitaminResolve, appResolve } from '../utils';
import appConfig from '../index';

function clientConfig(options, entryName, entryPath, assetPlugin) {
    const hmrPath = `${appConfig.server.basePath + appConfig.build.client.publicPath}/__webpack_hmr`;
    const hotMiddlewareAsset =
        `webpack-hot-middleware/client?path=${appConfig.server.externalUrl + hmrPath}`;
    return mergeWith({}, config(options), {
        entry: { [entryName]: options.hot ? [entryPath, hotMiddlewareAsset] : entryPath },
        output: {
            filename: entryName,
        },
        module: {
            rules: [
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
            assetPlugin,
        ],
    }, concat);
}

const secondaryEntries = appConfig.build.client.secondaryEntries;
for (const key of Object.keys(secondaryEntries)) {
    secondaryEntries[key] = appResolve(secondaryEntries[key]);
}
const entries = {
    [appConfig.build.client.filename]: vitaminResolve('src', 'client', 'index.jsx'),
    ...secondaryEntries,
};
module.exports = (options) => {
    const assetPlugin = new AssetsPlugin({
        path: appConfig.build.path,
        prettyPrint: true,
    });
    return Object.keys(entries).map(
        entryName => clientConfig(options, entryName, entries[entryName], assetPlugin)
    );
};
