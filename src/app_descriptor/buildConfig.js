/* eslint no-console: 0 */

const defaults = {
    plugins: [],
};

let config = {};
try {
    config = require('__app__/app_descriptor/server.js').default;
} catch (e) {
    console.warn(`BuildConfig.js not found, resolve to default build config`);
}

export default {...defaults, ...config};
