'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.testJest = undefined;

var _npmRun = require('npm-run');

var _jestrc = require('./jestrc');

var _jestrc2 = _interopRequireDefault(_jestrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = program => program.command('jest [runnerArgs...]').description('Launch test suite with Jest').option('--no-hmr', 'Disable hot reload').action((runnerArgs, { hmr }) => {
    testJest({ hot: hmr, runnerArgs: runnerArgs.join(' ') });
});

const testJest = exports.testJest = ({ hot, runnerArgs }) => {
    const args = ['-c', _jestrc2.default, '--no-cache', '--verbose', hot && '--watch', ...(typeof runnerArgs === 'string' ? runnerArgs.split(' ') : '')].filter(Boolean);
    (0, _npmRun.spawn)(`jest`, args, {
        stdio: 'inherit'
    });
};