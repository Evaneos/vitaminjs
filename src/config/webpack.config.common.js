import { fondationResolve, appResolve } from '../utils';
import appConfig, { moduleMap } from './index';
import { HotModuleReplacementPlugin, LoaderOptionsPlugin } from 'webpack';
import autoprefixer from 'autoprefixer';

const MODULES_DIRECTORIES = [appResolve('node_modules'), fondationResolve('node_modules')];
const APP_SOURCE_DIR = appResolve();
const INCLUDES = [
    APP_SOURCE_DIR,
    fondationResolve('src'),
];
export const createBabelLoaderConfig = (server) => ({
    test: /\.js(x?)$/,
    loader: 'babel',
    include: INCLUDES,
    query: {
        extends: fondationResolve('src', 'config',
            `.babelrc.${server ? 'node' : 'browser'}`),
    },
});
export function config(options) {
    return {
        devtool: options.dev ? 'source-map' : null,
        output: {
            pathinfo: options.dev,
            publicPath: appConfig.server.basePath + appConfig.build.client.publicPath,
            path: appConfig.build.path,
        },
        module: {
            // Disable handling of unknown requires
            unknownContextRegExp: /$^/,
            unknownContextCritical: true,

            // Disable handling of requires with a single expression
            exprContextRegExp: /$^/,
            exprContextCritical: true,

            // Disable handling of expression in require
            wrappedContextRegExp: /$^/,
            wrappedContextCritical: true,

            loaders: [{
                test: /\.css$/,
                loaders: [
                    'isomorphic-style-loader',
                    'css-loader?module&localIdentName=[name]_[local]_[hash:base64:3]' +
                    '&importLoaders=1!postcss-loader',
                ],
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000&name=files/[hash].[ext]',
            }, {
                test: /\.json$/,
                loader: 'json',
            }],
        },

        resolveLoader: {
            modules: MODULES_DIRECTORIES,
        },
        cache: options.hot,
        resolve: {
            alias: moduleMap,
            modules: MODULES_DIRECTORIES,
            extensions: ['.js', '.jsx', '.json', '.css'],
        },
        postcss() {
            return [autoprefixer];
        },
        plugins: [
            ...(options.hot ? [
                new HotModuleReplacementPlugin(),
                new LoaderOptionsPlugin({
                    test: /\.css$/,
                    debug: true,
                }),
            ] : []),
        ],
    };
}
