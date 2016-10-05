import stripJsonComments from 'strip-json-comments';
import mergeWith from 'lodash.mergewith';
import { appResolve, vitaminResolve } from './utils';
import { readFileSync } from 'fs';
import defaults from './defaults';
import { join, dirname } from 'path';

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

function resolveModulePath(modulePath) {
    /* eslint no-nested-ternary: 0 */
    return (
        modulePath.indexOf('__vitamin__/') === 0 ?
            vitaminResolve(modulePath.slice('__vitamin__/'.length)) :
        modulePath.indexOf('.') === 0 ?
            appResolve(modulePath) :
        // otherwise, it is an external module
            modulePath
    );
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


const rcPath = appResolve('.vitaminrc');
let config = loadConfigFile(rcPath);

function getModuleMap(configPaths) {
    const moduleMap = {};
    for (const configPath of configPaths) {
        moduleMap[pathToModuleName(configPath)] = resolveModulePath(lookupPath(configPath, config));
    }
    return moduleMap;
}

config = mergeConfig(defaults, config);
config = loadExtendedConfig(config, rcPath);


const modulePaths = [
    ['routes'],
    ['server', 'middlewares'],
    ['server', 'ErrorPage'],
    ['server', 'onError'],
    ['server', 'layout'],
    ['server', 'actionDispatcher'],
    ['redux', 'reducers'],
    ['redux', 'middlewares'],
    ['redux', 'enhancers'],
    ['redux', 'stateSerializer'],
];

export const moduleMap = getModuleMap(modulePaths);

// Cleanify config export by removing module paths
modulePaths.forEach(path =>
    deletePath(path, config)
);

// Resolve app path to absolute paths
[
    ['build', 'path'],
].forEach(path =>
    updatePath(path, appResolve, config)
);

const exportedConfig = config;
export default exportedConfig;
