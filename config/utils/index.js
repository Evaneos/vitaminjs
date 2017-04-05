
const path = require('path');

export function vitaminResolve(...args) {
    return path.resolve(process.env.VITAMIN_PATH, ...args);
}

export function appResolve(...args) {
    return path.resolve(process.cwd(), ...args);
}

export function concat(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || right === left) {
        return undefined;
    }
    return left.concat(right);
}

const safeReaddirSync = (dirPath) => {
    try {
        return fs.readdirSync(dirPath);
    } catch (e) {
        return [];
    }
};

const externalModules = modulesPath => safeReaddirSync(modulesPath).filter(m => m !== '.bin');
export const appModules = externalModules(appResolve('node_modules')).filter(m => m !== 'vitaminjs');
export const vitaminModules = externalModules(vitaminResolve('node_modules'));
export const fileRegex = '.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';
