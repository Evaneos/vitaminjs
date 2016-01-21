import { fondationResolve, appResolve } from './src/utils';
import path from 'path';
import mergeWith from 'lodash.mergewith';
import fs from 'fs';
// import { plugins } from './src/appDescriptor';
import { pluginLoaders } from './src/plugin';


const APP_PATH = process.cwd();
const APP_SOURCE_DIR = path.join(APP_PATH, 'src');
const BUILD_PUBLIC_DIR = path.join(APP_PATH, 'public');
const FONDATION_ROOT = __dirname;

const appDescriptor = require(appResolve('src', 'appDescriptor')).default;

const externalPlugins = pluginLoaders(appDescriptor.plugins || []);

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

const customizer = (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
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
        // TODO : Add Isomorphic CSS
        // TODO : Add JSON, raw, images, font and files loaders
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

const clientConfig = mergeWith({}, config, {
    context: APP_SOURCE_DIR,
    entry: './client',
    output: {
        path: BUILD_PUBLIC_DIR,
        // TODO : put hash in name
        filename: 'bundle.js',
    },

    module: {
        loaders: [
            createBabelLoaderConfig('.babelrc.browser'),
        ].concat(externalPlugins),
    },

    devServer: {
        proxy: {
            '*': {
                target: 'http://localhost:3000',
                secure: false,
            },
        },
    },

}, customizer);

// Configuration server-side (server.js)

const serverConfig = mergeWith({}, config, {
    entry: 'fondation/src/server',
    output: {
        path: './build',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    externals: externalModules,
    module: {
        loaders: [
            createBabelLoaderConfig('.babelrc.node'),
        ].concat(externalPlugins),
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
}, customizer);

export default [clientConfig, serverConfig];
