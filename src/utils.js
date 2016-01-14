const path = require('path');

exports.fondationResolve = function () {
	return path.resolve(process.env.RACKT_PATH, ...arguments)
};

exports.appResolve = function () {
	return path.resolve(process.cwd(), ...arguments)
};
