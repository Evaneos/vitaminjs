
const path = require('path');

exports.fondationResolve = function fondationResolve() {
    return path.resolve(process.env.RACKT_PATH, ...arguments);
};

exports.appResolve = function appResolve() {
    return path.resolve(process.cwd(), ...arguments);
};

exports.concat = function concat(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || right === left) {
        return undefined;
    }
    return left.concat(right);
};
