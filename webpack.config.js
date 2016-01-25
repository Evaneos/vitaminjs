import { fondationResolve, appResolve } from './src/utils';
import path from 'path';
import fs from 'fs';


const APP_PATH = process.cwd();
const APP_SOURCE_DIR = path.join(APP_PATH, 'src');
const BUILD_PUBLIC_DIR = path.join(APP_PATH, 'public');
const FONDATION_ROOT = __dirname;

const INCLUDES = [
    APP_SOURCE_DIR,
    /fondation\/actions\.js/,
    /fondation\/src/,
];

const MODULES_DIRECTORIES = ['node_modules', fondationResolve('node_modules')];

const createBabelLoaderConfig = (babelConfig) => {
    return {
        test: /\.jsx?$/,
        loader: 'babel',
        include: INCLUDES,
        query: {
            extends: fondationResolve(babelConfig),
        },
    };
};

const externalModules = fs
    .readdirSync(fondationResolve('node_modules'))
    .filter(m => m !== '.bin')
    .reduce((modules, module) => {
        modules[module] = `commonjs2 fondation/node_modules/${module}`;
        return modules;
    }, {});

// Common config

const config = {

    devtool: 'source-map',

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint',
                exclude: /node_modules/,
                query: {
                    configFile: fondationResolve('.eslintrc'),
                },
            },
        ],
        loaders: [
            {
                test: /\.css$/,
                loaders: [
                    'isomorphic-style-loader',
                    'css-loader?module&localIdentName=[name]_[local]_[hash:base64:3]',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
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
        extensions: ['', '.js', '.jsx'],
    },

};


// Configuration client-side (client.js)

const clientConfig = {
    name: 'browser',
    entry: './src/client',
    output: {
        path: BUILD_PUBLIC_DIR,
        // TODO : put hash in name
        filename: 'bundle.js',
    },

    module: {
        preLoaders: config.module.preLoaders,
        loaders: [
            ...config.module.loaders,
            createBabelLoaderConfig('.babelrc.browser'),
        ],
    },
    devtool: config.devtool,
    resolve: config.resolve,
    resolveLoader: config.resolveLoader,
    debug: true,

    devServer: {
        proxy: {
            '*': {
                target: 'http://localhost:3000',
                secure: false,
            },
        },
    },

};

// Configuration server-side (server.js)

const serverConfig = {
    name: 'server-side rendering',
    entry: 'fondation/src/server',
    output: {
        path: './build',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    externals: externalModules,
    module: {
        preLoaders: config.module.preLoaders,
        loaders: [
            ...config.module.loaders,
            createBabelLoaderConfig('.babelrc.node'),
        ],
    },
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },
    devtool: config.devtool,
    resolve: config.resolve,
    resolveLoader: config.resolveLoader,
};

export default [clientConfig, serverConfig];
