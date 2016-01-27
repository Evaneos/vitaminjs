const defaults = {
    middlewares: [],
};

let config = {};
try {
    config = require('__app_descriptor__/server.js').default;
} catch (e) {
    console.warn(`Cannot load server.js, resolve to default server config (${e.message})`);
}

module.exports = Object.assign({}, defaults, config);
