import stripJsonComments from 'strip-json-comments';
import mergeWith from 'lodash.mergewith';
import { appResolve, fondationResolve } from '../utils';
import { readFileSync } from 'fs';
import defaults from './defaults';

const rcPath = appResolve('.fondationrc');

let config;
try {
    const json = readFileSync(rcPath, { encoding: 'utf8' });
    config = JSON.parse(stripJsonComments(json));
} catch (e) {
    process.stderr.write(`Couldn't load configuration from ${rcPath}\n${e.message}`);
    process.exit(1);
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
        modulePath.indexOf('__fondation__/') === 0 ?
            fondationResolve(modulePath.slice(14)) :
        modulePath.indexOf('.') === 0 ?
            appResolve(modulePath) :
        // otherwise, it is an external module
            modulePath
    );
}

function getModuleMap(configPaths) {
    const moduleMap = {};
    for (const configPath of configPaths) {
        moduleMap[pathToModuleName(configPath)] = resolveModulePath(lookupPath(configPath, config));
    }
    return moduleMap;
}

config = mergeConfig(defaults, config);

const modulePaths = [
    ['routes'],
    ['server', 'middlewares'],
    ['redux', 'reducers'],
    ['redux', 'middlewares'],
    ['redux', 'state', 'serializer'],
    ['init'],
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
export default config;
