import { spawn } from 'npm-run';
import jestConfig from './jestrc'

export function registerCommand(program) {
    return program
        .command('jest [runnerArgs...]')
        .description('Launch test suite with Jest')
        .action((runnerArgs) => {
            spawnJest({ runnerArgs: runnerArgs.join(' ') });
        });
};

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
