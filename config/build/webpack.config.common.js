import { HotModuleReplacementPlugin, LoaderOptionsPlugin, NamedModulesPlugin } from 'webpack';
import autoprefixer from 'autoprefixer';
import { join } from 'path';
import { vitaminResolve, appResolve } from '../utils';
import appConfig, { moduleMap } from '../index';
import babelrc from './babelrc';

const MODULES_DIRECTORIES = [appResolve('node_modules'), vitaminResolve('node_modules')];

export const createBabelLoaderConfig = env => ({
    test: /\.js(x?)$/,
    loader: 'babel',
    include: path =>
        path.indexOf('node_modules') === -1 ||
        (path.indexOf('node_modules/vitaminjs') !== -1 &&
        path.indexOf('node_modules/vitaminjs/node_modules') === -1),
    query: babelrc(env),
});
export function config(options) {
    return {
        devtool: options.dev && 'source-map',
        output: {
            pathinfo: options.dev,
            publicPath: `${appConfig.publicPath}/`,
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

            rules: [{
                // only files with .global will go through this loader
                test: /\.global\.css$/,
                loaders: [
                    'isomorphic-style-loader',
                    'css-loader?sourceMap&importLoaders=1!postcss-loader',
                    'postcss-loader',
                ],
            }, {
                // anything with .global will not go through css modules loader
                test: /^((?!\.global).)*\.css$/,
                loaders: [
                    'isomorphic-style-loader',
                    'css-loader?modules&sourceMap&importLoaders=1' +
                        '&localIdentName=[name]__[local]___[hash:base64:3]!postcss-loader',
                    'postcss-loader',
                ],
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)$/,
                loader: `url-loader?limit=10000&name=${join(appConfig.filesPath, '[hash].[ext]')}`,
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
        plugins: [
            new LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    postcss: [autoprefixer()],
                },
                test: /\.css$/,
                debug: true,

            }),
            ...(options.hot ? [
                new HotModuleReplacementPlugin(),
                new NamedModulesPlugin(),
            ] : []),
        ],
    };
}
