const path = require('path');
const APP_PATH = process.cwd();
const SRC_DIR = path.join(APP_PATH, 'src');
const BUILD_DIR = path.join(APP_PATH, 'public');

const fondationResolve = (filename) => path.resolve(process.env.RACKT_PATH, filename);
const MODULES_DIRECTORIES = ['node_modules', fondationResolve('node_modules')];

module.exports = {
    // TODO : manage the case when several pages are used (construct entry dynamically -- cf espace perso)
    context: SRC_DIR,
    entry: './app',
    output: {
        path: BUILD_DIR,
        // TODO : put hash in name
        filename: 'bundle.js',
    },

    // If compilation gets slow, change strategy for prod & dev
    // devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: 'node_modules',
                loader: 'babel',
                query: {
                    extends: fondationResolve('.babelrc')
                },
            }
        ]
    },

    resolveLoader: {
        modulesDirectories: MODULES_DIRECTORIES,
    },

    resolve: {
        modulesDirectories: MODULES_DIRECTORIES,
        extensions: ['', '.js', '.jsx'],
    }


}