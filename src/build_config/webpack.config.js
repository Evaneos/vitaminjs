import clientConfig from './webpack.config.client';
import serverConfig from './webpack.config.server';
module.exports = (options) => [
    clientConfig(options),
    serverConfig(options),
];
