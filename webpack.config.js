const fondationResolve = require('./src/utils').fondationResolve;
const path = require('path');
const APP_PATH = process.cwd();
const SRC_DIR = path.join(APP_PATH, 'src');

const INCLUDES = [SRC_DIR, /fondation\/src/];
const BUILD_DIR = path.join(APP_PATH, 'public');

const MODULES_DIRECTORIES = ['node_modules', fondationResolve('node_modules')];
module.exports = {
    // TODO : manage the case when several pages are used (construct entry dynamically -- cf espace perso)
    context: SRC_DIR,
    entry: './client',
    output: {
        path: BUILD_DIR,
        // TODO : put hash in name
        filename: 'bundle.js',
    },

    // If compilation gets slow, change strategy for prod & dev
    devtool: 'source-map',

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint',
                exclude: /node_modules/,
                query: {
                    fix: true,
                },
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: INCLUDES,
                query: {
                    extends: fondationResolve('.babelrc.browser'),
                },
            },
        ],
    },

    resolveLoader: {
        modulesDirectories: MODULES_DIRECTORIES,
    },

    resolve: {
        modulesDirectories: MODULES_DIRECTORIES,
        extensions: ['', '.js', '.jsx'],
    },

    devServer: {
        proxy: {
            '*': {
                target: 'http://localhost:3000',
                secure: false,
            },
        },
    },
}