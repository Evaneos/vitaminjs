const path = require('path');
const rimraf = require('rimraf');

const { default: parseConfig } = require('../config');

module.exports = () => new Promise((resolve, reject) => {
    const config = parseConfig();
    return rimraf(
        path.join(config.server.buildPath, '*'),
        (err, data) => (!err ? resolve(data) : reject(err)),
    );
});
