import clientConfig from './webpack.config.client';
import serverConfig from './webpack.config.server';
module.exports = function(options) {
    return [
        clientConfig(options)
        serverConfig(options)
    ]
}
