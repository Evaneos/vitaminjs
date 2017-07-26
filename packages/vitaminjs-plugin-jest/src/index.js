import { spawn } from 'npm-run';
import jestConfig from './jestrc'

export default program => program
    .command('jest [runnerArgs...]')
    .description('Launch test suite with Jest')
    .option('--no-hmr', 'Disable hot reload')
    .action((runnerArgs, { hmr }) =>  {
        testJest({ hot: hmr, runnerArgs: runnerArgs.join(' ') });
    });

export const testJest = ({ hot, runnerArgs }) => {
    const args = [
        '-c', jestConfig,
        '--no-cache',
        '--verbose',
        hot && '--watch',
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
