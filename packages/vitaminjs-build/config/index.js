const stripJsonComments = require('strip-json-comments');
const mergeWith = require('lodash.mergewith');
const { readFileSync } = require('fs');
const { join, dirname } = require('path');
const {
    resolveConfigModule,
    resolveConfigPath,
    resolveRcPath,
} = require('./resolve');
const defaults = require('./defaults');

// eslint-disable-next-line consistent-return
function loadConfigFile(configPath) {
    let config;
    try {
        const json = readFileSync(configPath, { encoding: 'utf8' });
        config = JSON.parse(stripJsonComments(json));
        return config;
    } catch (e) {
        process.stderr.write(`Couldn't load configuration from ${configPath}\n${e.message}`);
        process.exit(1);
    }
}

function mergeConfig(one, two) {
    return mergeWith({}, one, two, (objectValue, sourceValue) => {
        if (Array.isArray(objectValue)) {
            return sourceValue;
        }
        return undefined;
    });
}

function lookupPath(path, conf) {
    // Ternary version is left as an exercise to the reader.
    if (!path.length) {
        return conf;
    }
    return lookupPath(path.slice(1), conf[path[0]]);
}

function deletePath(path, conf) {
    /* eslint no-param-reassign: 0 */
    if (path.length === 1) {
        delete conf[path[0]];
    } else {
        deletePath(path.slice(1), conf[path[0]]);
        if (Object.keys(conf[path[0]]).length === 0) {
            delete conf[path[0]];
        }
    }
    return conf;
}

// Apply update function to the key path in the config.
// (similar to https://facebook.github.io/immutable-js/docs/#/Map/updateIn, but
// modify the config object in place)
function updatePath(path, update, conf) {
    // Ternary version is left as an exercise to the reader.
    if (path.length === 1) {
        conf[path] = update(conf[path]);
    } else {
        updatePath(path.slice(1), update, conf[path[0]]);
    }
    return conf;
}

function pathToModuleName(path) {
    return `__app_modules__${path.join('_')}__`;
}

function loadExtendedConfig(config, configPath) {
    if (!config.extends) {
        return config;
    }

    let extendedConfigPath = config.extends;
    delete config.extends;
    extendedConfigPath = extendedConfigPath.startsWith('/') ?
        extendedConfigPath : join(dirname(configPath), extendedConfigPath);

    let newConfig = loadConfigFile(extendedConfigPath);
    newConfig = mergeConfig(config, newConfig);
    return loadExtendedConfig(newConfig, extendedConfigPath);
}


const rcPath = resolveRcPath();
exports.rcPath = rcPath;

exports.default = () => {
    let config = loadConfigFile(rcPath);

    const getModuleMap = (configPaths) => {
        const moduleMap = {};
        configPaths.forEach((configPath) => {
            moduleMap[pathToModuleName(configPath)]
                = resolveConfigModule(lookupPath(configPath, config));
        });
        return moduleMap;
    };

    config = mergeConfig(defaults, config);
    config = loadExtendedConfig(config, rcPath);


    const modulePaths = [
        ['routes'],
        ['server', 'middlewares'],
        ['server', 'ErrorPage'],
        ['server', 'onError'],
        ['server', 'layout'],
        ['server', 'createInitAction'],
        ['redux', 'reducers'],
        ['redux', 'middlewares'],
        ['redux', 'enhancers'],
        ['redux', 'stateSerializer'],
    ];

    const moduleMap = getModuleMap(modulePaths);

    // Cleanify config export by removing module paths
    modulePaths.forEach(
        path => deletePath(path, config)
    );

    // Resolve app path to absolute paths
    [
        ['server', 'buildPath'],
        ['client', 'buildPath'],
    ].forEach(
        path => updatePath(path, resolveConfigPath, config)
    );

    // Prepend / to publicPath and basePath if necessary
    const prependSlash = path => (
        ((path.startsWith('/') || path.match(/^(http|\/|$)/)) ? '' : '/') + path
    );
    [['publicPath'], ['basePath']].forEach(
        path => updatePath(path, prependSlash, config)
    );

    // If public path is not absolute url, prepend basePath
    updatePath(['publicPath'], publicPath =>
        (!publicPath.match(/^(http|\/\/)/) ? config.basePath.replace(/\/$/, '') : '') + config.publicPath,
    config);

    config.moduleMap = moduleMap;

    return config;
};
