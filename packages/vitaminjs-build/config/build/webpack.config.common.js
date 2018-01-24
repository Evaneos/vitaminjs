const { HotModuleReplacementPlugin, LoaderOptionsPlugin, NamedModulesPlugin } = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const postcssOmitImportTilde = require('postcss-omit-import-tilde');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssCssNext = require('postcss-cssnext');
const postcssBrowserReporter = require('postcss-browser-reporter');
const postcssReporter = require('postcss-reporter');
const { join } = require('path');
const { isBuildModulePath, isExternalModulePath, isRuntimeModulePath, __isVitaminFacadeModulePath } = require('../resolve');
const { appResolve } = require('../utils');
const babelrc = require('./babelrc');

const APP_MODULES = appResolve('node_modules');

function createBabelLoader(env, options) {
    return {
        test: /\.js(x?)$/,
        loader: 'babel-loader',
        include: path =>
            // We only want to transpile user land application code and our own runtime
            (
                !isExternalModulePath(path) ||
                __isVitaminFacadeModulePath(path) ||
                isRuntimeModulePath(path) ||
                // FIXME This is only required for parts of the runtime
                // that require the build system
                isBuildModulePath(path)
            ),
        query: babelrc(env, options),
    };
}

const createResolveConfigLoader = () => ({
    // The following loader will resolve the config to its final value during the build
    test: require.resolve('../runtimeConfig'),
    loader: require.resolve('./resolveConfigLoader'),
});

function config(options) {
    const CSSLoaders = ({ modules }) => [
        {
            loader: 'isomorphic-style-loader',
            options: {
                debug: true,
            },
        },
        {
            loader: 'css-loader',
            options: {
                minimize: !options.dev,
                discardComments: {
                    removeAll: !options.dev,
                },
                importLoaders: 1,
                ...(modules ? {
                    localIdentName: options.dev ?
                        '[name]__[local]___[hash:base64:5]' : '[hash:base64]',
                    modules: true,
                } : {}),
            },
        },
        'postcss-loader',
    ];
    return {
        devtool: (options.withSourceMaps || options.dev) && 'source-map',
        output: {
            pathinfo: options.dev,
            publicPath: `${options.publicPath}/`,
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
                loaders: CSSLoaders({ modules: false }),
            }, {
                // anything with .global will not go through css modules loader
                test: /^((?!\.global).)*\.css$/,
                loaders: CSSLoaders({ modules: true }),
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|eot|ttf)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: join(options.filesPath, '[hash].[ext]'),
                },
            }, {
                test: /\.json$/,
                loader: 'json-loader',
            }, {
                test: /\.ya?ml$/,
                loader: 'yaml-loader',
            }],
        },

        resolveLoader: {
            // Commmented out beause absolute paths were opting out of node resolve algorithm
            // modules: MODULES_DIRECTORIES,
        },
        cache: options.hot,
        resolve: {
            alias: {
                ...options.moduleMap,
                __vitamin_runtime_config__: require.resolve('../runtimeConfig'),
            },
            // Commmented out beause absolute paths were opting out of node resolve algorithm
            // modules: MODULES_DIRECTORIES,
            extensions: ['.js', '.jsx', '.json', '.css'],
            mainFields: ['browser', 'module', 'main', 'style'],
        },
        plugins: [
            new LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    postcss: [
                        postcssOmitImportTilde(),
                        postcssImport(),
                        postcssUrl(),
                        postcssCssNext({ browsers: options.client.targetBrowsers }),
                        options.dev && postcssBrowserReporter(),
                        postcssReporter(),
                    ].filter(Boolean),
                },
                test: /\.css$/,
                debug: true,
            }),
            options.hot && new HotModuleReplacementPlugin(),
            options.hot && new NamedModulesPlugin(),

            // If you require a missing module and then `npm install` it, you still have
            // to restart the development server for Webpack to discover it. This plugin
            // makes the discovery automatic so you don't have to restart.
            // See https://github.com/facebookincubator/create-react-app/issues/186
            options.dev && new WatchMissingNodeModulesPlugin(APP_MODULES),

            // enforces the entire path of all required modules match the exact case
            // of the actual path on disk. Using this plugin helps alleviate cases
            // for developers working on case insensitive systems like OSX.
            options.dev && new CaseSensitivePathsPlugin(),
        ].filter(Boolean),
    };
}

module.exports = {
    createBabelLoader,
    createResolveConfigLoader,
    config,
};
