/* eslint no-console: 0 */
import mergeWith from 'lodash.mergewith';
import concat from '../utils';

const defaults = {
    plugins: [],
    server: {
        path: 'build',
        filename: 'server.js',
    },
    client: {
        path: 'static',
        filename: 'bundle.js',
    },
    basename: '',
};

let config = {};
try {
    config = require('__app__/app_descriptor/build.js').default;
} catch (e) {
    console.warn(`Resolve to default build config (${e.message})`);
}
export default mergeWith(defaults, config, concat);
