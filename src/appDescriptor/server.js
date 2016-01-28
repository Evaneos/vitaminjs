const defaults = {
    middlewares: [],
};

let config = {};
try {
    config = require('__app__/appDescriptor/server.js').default;
} catch (e) {
    console.warn(`Cannot load server.js, resolve to default server config (${e.message})`);
}

module.exports = Object.assign({}, defaults, config);
