const { spawn } = require('npm-run');
const jestConfig = require('./jestrc');

module.exports = ({ runnerArgs }) => {
    const args = [
        '-c', jestConfig,
        ...(typeof runnerArgs === 'string' ? runnerArgs.split(' ') : ''),
    ].filter(Boolean);
    spawn(
        'jest',
        args,
        {
            stdio: 'inherit',
        }
    );
};
