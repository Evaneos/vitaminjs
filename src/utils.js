const path = require('path');

exports.fondationResolve = function fondationResolve() {
    return path.resolve(process.env.RACKT_PATH, ...arguments);
};

exports.appResolve = function fondationResolve() {
    return path.resolve(process.cwd(), ...arguments);
};
