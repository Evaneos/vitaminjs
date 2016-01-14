const path = require('path');
exports.fondationResolve = (filename) => path.resolve(process.env.RACKT_PATH, filename);