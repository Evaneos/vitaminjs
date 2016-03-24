
const path = require('path');

export function vitaminResolve(...args) {
    return path.resolve(process.env.vitamin_PATH, ...args);
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
