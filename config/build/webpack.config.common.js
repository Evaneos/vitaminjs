import { vitaminResolve, appResolve } from '../utils';
import appConfig, { moduleMap } from '../index';
import { HotModuleReplacementPlugin, LoaderOptionsPlugin, DefinePlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import babelrc from './babelrc';

const MODULES_DIRECTORIES = [appResolve('node_modules'), vitaminResolve('node_modules')];
const server = appConfig.server;

export const createBabelLoaderConfig = (env) => ({
    test: /\.js(x?)$/,
    loader: 'babel',
    include: (path) =>
        path.indexOf('node_modules') === -1 ||
        path.indexOf('node_modules/vitaminjs') !== -1 &&
        path.indexOf('node_modules/vitaminjs/node_modules') === -1,
    query: babelrc(env),
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
            new DefinePlugin({
                __APP_URL__: JSON.stringify(
                    `http://${server.host}:${server.port}${server.basePath}`
                ),
            }),
        ],
    };
}
