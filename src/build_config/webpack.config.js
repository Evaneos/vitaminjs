import clientConfig from './webpack.config.client';
import serverConfig from './webpack.config.server';
export default (options) => [
    clientConfig(options),
    serverConfig(options),
];
