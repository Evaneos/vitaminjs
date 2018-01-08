const { spawn } = require('npm-run');
const jestConfig = require('./jestrc');

function registerCommand(program) {
    return program
        .command('jest [runnerArgs...]')
        .description('Launch test suite with Jest')
        .action((runnerArgs) => {
            spawnJest({ runnerArgs: runnerArgs.join(' ') });
        });
};

console.log(jestConfig);

const spawnJest = ({ runnerArgs }) => {
    const args = [
        '-c', jestConfig,
        ...(typeof runnerArgs === 'string' ? runnerArgs.split(' ') : ''),
    ].filter(Boolean);
    spawn(
        `jest`,
        args,
        {
            stdio: 'inherit',
        }
    );
};

exports.registerCommand = registerCommand;
