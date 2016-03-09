import { fondationResolve, appResolve } from '../utils';
import { pluginLoaders } from '../utils/plugin';
import buildConfig from '../app_descriptor/build';
import { HotModuleReplacementPlugin, LoaderOptionsPlugin } from 'webpack';
import autoprefixer from 'autoprefixer';

const MODULES_DIRECTORIES = [appResolve('node_modules'), fondationResolve('node_modules')];
const APP_SOURCE_DIR = appResolve('src');
const INCLUDES = [
    APP_SOURCE_DIR,
    fondationResolve('src'),
];
export const createBabelLoaderConfig = (server) => ({
    test: /\.js(x?)$/,
    loader: 'babel',
    include: INCLUDES,
    query: {
        extends: fondationResolve('src', 'build_config',
            `.babelrc.${server ? 'node' : 'browser'}`),
    },
});

const externalPlugins = pluginLoaders(buildConfig.plugins);

export function config(options) {
    return {
        devtool: options.dev ? 'source-map' : null,
        output: {
            pathinfo: options.dev,
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
                    'css-loader?module&localIdentName=[name]_[local]_[hash:base64:3]&importLoaders=1!postcss-loader',
                ],
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000',
            }, {
                test: /\.json$/,
                loader: 'json',
            },
                ...externalPlugins,
            ],
        },

        resolveLoader: {
            modules: MODULES_DIRECTORIES,
        },

        resolve: {
            alias: {
                __app__: APP_SOURCE_DIR,
            },
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
