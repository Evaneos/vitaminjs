const fondationResolve = require('../utils').fondationResolve;

require('babel-register')({
    // TODO Load right babelRc according to current environment
    extends: fondationResolve('.babelrc.node'),
});
