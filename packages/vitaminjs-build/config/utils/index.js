
const path = require('path');

function vitaminResolve(...args) {
    return path.resolve(process.env.VITAMIN_PATH, ...args);
}

function appResolve(...args) {
    return path.resolve(process.cwd(), ...args);
}

function concat(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || right === left) {
        return undefined;
    }
    return left.concat(right);
}

module.exports = {
    vitaminResolve,
    appResolve,
    concat,
};
