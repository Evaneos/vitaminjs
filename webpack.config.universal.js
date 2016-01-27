'use strict';

const path = require('path');
const fondationResolve = require('./src/utils.js').fondationResolve;
const appResolve = require('./src/utils.js').appResolve;
const pluginLoaders = require('./src/plugin').pluginLoaders;
const defaultBuildConfig = require('./src/appDescriptor/buildConfig.js');


const HOT = module.exports.HOT = process.env.NODE_ENV === 'development-hot';
const DEV = module.exports.DEV = process.env.NODE_ENV !== 'production';
console.log('Hot reload : ', HOT);
console.log('Development : ', DEV);
/*
    Retrieving build config
    =======================

    This part is a little tricky. We need to retrieve the build config from the app.

    When this file is parsed for the first time by webpack for generating server bundle,
    we have access to dynamic require.

    But when it is parsed for generating the bundle for the client, from inside the node server,
    we do not. However, we have access to __app_descriptor__ alias, which points to the
    correct path.

    So the solution for now is to fallback consequently depending on the availability of the
    __app_descriptor__. But there is surely something more elegant.
*/
let buildConfig = {};
try {
    buildConfig = require('__app_descriptor__/buildConfig.js').default;
} catch (e1) {
    try {
        const buildConfigPath = appResolve('src', 'appDescriptor', 'buildConfig.js');
        buildConfig = require(buildConfigPath).default;
    } catch (e2) {
        console.warn('buildConfig.js not found, resolving to default config.');
    }
}
buildConfig = Object.assign({}, defaultBuildConfig, buildConfig);
/**
    The End.
**/

const MODULES_DIRECTORIES = ['node_modules', fondationResolve('node_modules')];
const APP_PATH = process.cwd();

const APP_SOURCE_DIR = module.exports.APP_SOURCE_DIR = path.join(APP_PATH, 'src');
module.exports.BUILD_DIR = path.join(APP_PATH, 'build');

const INCLUDES = [
    APP_SOURCE_DIR,
    fondationResolve('src'),
    fondationResolve('action.js'),
];
const EXCLUDES = [
    /\.es5\.js$/,
];

const externalPlugins = pluginLoaders(buildConfig.plugins);

module.exports.createBabelLoaderConfig = (babelConfig) => {
    return {
        test: /\.js(x?)$/,
        loader: 'babel',
        include: INCLUDES,
        exclude: EXCLUDES,
        query: {
            extends: fondationResolve(babelConfig),
        },
    };
};

module.exports.config = {
    devtool: 'source-map',
    noInfo: true,
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
            test: /\.json$/,
            loader: 'json',
        }, {
            test: /\.css$/,
            loaders: [
                'isomorphic-style-loader',
                'css-loader?module&localIdentName=[name]_[local]_[hash:base64:3]',
            ],
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
            loader: 'url-loader?limit=10000',
        },
            ...externalPlugins,
        ],
    },

    resolveLoader: {
        modulesDirectories: MODULES_DIRECTORIES,
    },

    resolve: {
        alias: {
            __app_descriptor__: path.resolve(APP_SOURCE_DIR, 'appDescriptor'),
        },
        modulesDirectories: MODULES_DIRECTORIES,
        extensions: ['', '.js', '.jsx', '.json'],
    },

};
