const { BUILD_FAILED } = require('./compile');
const { buildAndWatch, buildAndExit } = require('./build');
const server = require('./server');
const clean = require('./clean');

function start(hmr) {
    const hot = hmr && process.env.NODE_ENV !== 'production';
    (hot ? buildAndWatch : buildAndExit)({ hot }, server.reload).then(() =>
        server.start()
    );
}

module.exports = hmr => clean().then(() => start(hmr));
