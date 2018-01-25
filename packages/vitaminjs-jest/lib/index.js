'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerCommand = registerCommand;

var _npmRun = require('npm-run');

var _jestrc = require('./jestrc');

var _jestrc2 = _interopRequireDefault(_jestrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerCommand(program) {
    return program.command('jest [runnerArgs...]').description('Launch test suite with Jest').action(runnerArgs => {
        spawnJest({ runnerArgs: runnerArgs.join(' ') });
    });
};

const spawnJest = ({ runnerArgs }) => {
    const args = ['-c', _jestrc2.default, ...(typeof runnerArgs === 'string' ? runnerArgs.split(' ') : '')].filter(Boolean);
    (0, _npmRun.spawn)(`jest`, args, {
        stdio: 'inherit'
    });
};