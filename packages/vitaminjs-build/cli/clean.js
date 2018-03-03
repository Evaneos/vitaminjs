const path = require('path');
const rimraf = require('rimraf');
const appConfig = require('../config').resolveConfig();

function clean() {
    return new Promise((resolve, reject) => {
        return rimraf(
            path.join(appConfig.server.buildPath, '*'),
            (err, data) => (err ? reject(err) : resolve(data))
        );
    });
}

module.exports = clean;
