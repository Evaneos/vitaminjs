// Add JSX & ES6 module to node
const fondationResolve = require('./utils').fondationResolve;
require('babel-register')({
	extends: fondationResolve('.babelrc.node'),
});
require('./server');