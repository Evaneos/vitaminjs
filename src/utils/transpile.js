// Add JSX & ES6 module to node
const fondationResolve = require('./index').fondationResolve;
require('babel-register')({
    extends: fondationResolve('src', 'build_config', '.babelrc.node'),
});
