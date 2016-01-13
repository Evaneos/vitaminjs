const path = require('path');
const APP_PATH = process.cwd();
const SRC_DIR = path.join(APP_PATH, 'src');
const BUILD_DIR = path.join(APP_PATH, 'public');

module.exports = {
    // TODO : manage the case when several pages are used (construct entry dynamically -- cf espace perso)
    context: SRC_DIR,
    entry: './app',
    output: {
        path: BUILD_DIR,
        filename: 'bundle-[hash].js',
    },

    // If compilation gets slow, change strategy for prod & dev
    devtool: 'source-map',

    resolve: {
        extensions: ['', '.js', '.jsx']
    }


}