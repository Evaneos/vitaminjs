const concat = require('./index').concat;

exports.pluginLoaders = function pluginLoaders(plugins) {
    return plugins
        .map(plugin => plugin.loaders)
        .reduce(concat, []);
};
