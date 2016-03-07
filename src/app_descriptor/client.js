/* eslint no-console: 0 */

const defaults = {
    init() {},
};

let config = {};
try {
    config = require('__app__/app_descriptor/client.js').default;
} catch (e) {
    console.warn(`Cannot load client.js, resolve to default server config (${e.message})`);
}

export default { ...defaults, ...config };
