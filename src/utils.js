const path = require('path');

exports.fondationResolve = function fondationResolve() {
    return path.resolve(process.env.RACKT_PATH, ...arguments);
};

exports.appResolve = function fondationResolve() {
    return path.resolve(process.cwd(), ...arguments);
};

exports.concat = function concat(left, right) {
    if (process.env.NODE_ENV === 'development') {
        if (!Array.isArray(left) || !Array.isArray(right)) {
            throw new TypeError('Both arguments must be arrays.');
        }
    }
    return left.concat(right);
}
