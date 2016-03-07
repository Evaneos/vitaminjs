import { fondationResolve, appResolve } from '../utils';
import { pluginLoaders } from '../utils/plugin';
import buildConfig from '../app_descriptor/build';
import { HotModuleReplacementPlugin, LoaderOptionsPlugin } from 'webpack';

const MODULES_DIRECTORIES = [appResolve('node_modules'), fondationResolve('node_modules')];
export const APP_SOURCE_DIR = appResolve('src');
const INCLUDES = [
    APP_SOURCE_DIR,
    fondationResolve('src'),
];

const EXCLUDES = [];
export const createBabelLoaderConfig = (server, hot) => ({
    test: /\.js(x?)$/,
    loader: 'babel',
    include: INCLUDES,
    exclude: EXCLUDES,
    query: {
        extends: fondationResolve('src', 'build_config',
            `.babelrc.${server ? 'node' : 'browser'}`),
        filename: fondationResolve('node_modules'),
        presets: hot && !server ? ['react-hmre'] : [],
    },
});

const externalPlugins = pluginLoaders(buildConfig.plugins);

export function config(options) {
    return {
        devtool: options.dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',
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
                    'css-loader?module&localIdentName=[name]_[local]_[hash:base64:3]',
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
