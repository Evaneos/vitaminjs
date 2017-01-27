/* eslint no-console: 0 */

import program from 'commander';
import webpack from 'webpack';
import path from 'path';
import rimraf from 'rimraf';
import { spawn } from 'child_process';
import fs from 'fs';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import ProgressBar from 'progress';
import chalk from 'chalk';
import readline from 'readline';

import killProcess from '../config/utils/killProcess';
import webpackConfigServer from '../config/build/webpack.config.server';
import webpackConfigClient from '../config/build/webpack.config.client';
import webpackConfigTest from '../config/build/webpack.config.tests';
import config, { moduleMap, rcPath as configRcPath } from '../config';
import { version } from '../package.json';

const DEV = process.env.NODE_ENV !== 'production';


const clean = () => new Promise((resolve, reject) =>
    rimraf(
        path.join(config.server.buildPath, '*'),
        (err, data) => (!err ? resolve(data) : reject(err)),
    ),
);

const checkHot = (hot) => {
    if (hot && !DEV) {
        console.log(chalk.orange(
            chalk.bold('Warning: Hot module reload option ignored in production environment.'),
            '(based on your NODE_ENV variable)',
        ));
        /* eslint no-param-reassign: 0 */
        return false;
    }
    return hot;
};

const BUILD_FAILED = Symbol('BUILD_FAILED');

const buildCallback = (resolve, reject) => (err, stats) => {
    if (err || stats.hasErrors()) {
        return reject && reject(BUILD_FAILED);
    }
    return resolve(stats);
};

const throttle = (callback, throttleTime = 400) => {
    let t;
    return () => {
        if (t) clearTimeout(t);
        t = setTimeout(callback, throttleTime);
    };
};

const createCompiler = (webpackConfig, options, message) => {
    const compiler = webpack(webpackConfig({
        ...options,
        dev: DEV,
        ...config,
        moduleMap,
    }));
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue(`\uD83D\uDD50  Building ${message}...`)} :percent [:bar]`,
            { incomplete: ' ', total: 60, width: 50, clear: true, stream: process.stdout },
        );
        compiler.apply(new ProgressPlugin((percentage, msg) => {
            if (percentage === 1) {
                readline.clearLine(process.stdout);
                readline.cursorTo(process.stdout, 0);
            } else {
                bar.update(percentage, { msg });
            }
        }));
        compiler.apply(new FriendlyErrorsWebpackPlugin());
    }

    return compiler;
};

const commonBuild = (webpackConfig, message, options, callback) => {
    const createCompilerCommonBuild = () => createCompiler(webpackConfig, options, message);

    if (!options.hot) {
        const compiler = createCompilerCommonBuild();
        return new Promise((resolve, reject) => (
            compiler.run(buildCallback(resolve, reject))
        ));
    }

    return new Promise((resolve) => {
        const callbackWatch = buildCallback(() => {
            callback();
            resolve();
        });

        let watcher;
        const watch = () => {
            watcher = createCompilerCommonBuild().watch({}, callbackWatch);
        };

        watch();

        fs.watchFile(configRcPath, throttle(() => {
            watcher.close(() => {
                watch();
            });

        }));
    });
};

const build = (options, hotCallback) => (options.hot ?
    commonBuild(
        webpackConfigServer,
        `server bundle ${chalk.bold('[hot]')}`,
        options,
        hotCallback,
    )
:
    commonBuild(webpackConfigClient, 'client bundle(s)', options)
        .then(stats => commonBuild(
            webpackConfigServer, 'server bundle...',
            // Cannot build in parallel because server-side rendering
            // needs client bundle name in the html layout for script path
            { ...options, assetsByChunkName: stats.toJson().assetsByChunkName },
        ))
);


const test = ({ hot, runner, runnerArgs }) => {
    const launchTest = () => {
        console.log(chalk.blue('\uD83D\uDD50  Launching tests...'));
        const serverFile = path.join(
            config.server.buildPath,
            'tests',
        );
        spawn(`${runner} ${serverFile} ${runnerArgs}`, { stdio: 'pipe' });
    };

    if (config.test === undefined) {
        throw new Error('Please specify a test file path in .vitaminrc');
    }

    commonBuild(webpackConfigTest, 'tests', { hot, dev: DEV }, launchTest);
};

const serve = () => {
    process.stdout.write(chalk.blue('\uD83D\uDD50  Launching server...'));
    const serverFile = path.join(
        config.server.buildPath,
        config.server.filename,
    );
    try {
        fs.accessSync(serverFile, fs.F_OK);
    } catch (e) {
        console.log('\n');
        console.error(e);
        console.error(chalk.red(
            `\n\nCannot access the server bundle file. Make sure you built
the app with \`vitamin build\` before calling \`vitamin serve\`, and that
the file is accessible by the current user`,
        ));
        process.exit(1);
    }
    const serverProcess = spawn(process.argv[0], [serverFile], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
    const killServer = signal => killProcess(serverProcess, { signal }).then(() => process.exit());
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        const listener = () => killServer(signal);
        process.on(signal, listener);
        serverProcess.on('exit', () => process.removeListener(signal, listener));
    });
    serverProcess.on('close', (code) => {
        if (!code) {
            return;
        }
        console.error(chalk.red(
            `${chalk.bold('\n\nServer process exited unexpectedly. \n')}` +
            '- If it is an `EADDRINUSE error, you might want to change the `server.port` key' +
            ' in your `.vitaminrc` file\n' +
            '- If it occurs during initialization, it is probably an error in your app. Check the' +
            ' stacktrace for more info (`ReferenceError` are pretty common)\n' +
            '- If your positive it\'s not any of that, it might be because of a problem with ' +
            'vitaminjs itself. Please report it to https://github.com/Evaneos/vitaminjs/issues',
        ));
        process.exit(1);
    });

    return serverProcess;
};

const start = (options) => {
    let serverProcess;

    const sendSignal = () => {
        if (!serverProcess) return;
        serverProcess.kill('SIGUSR2');
    };

    const startServer = () => {
        serverProcess = serve();
        serverProcess.on('message', (message) => {
            if (message === 'restart') {
                killProcess(serverProcess)
                    .then(startServer);
                serverProcess = null;
            }
        });
    };

    return build(options, sendSignal)
        .then(startServer);
};

program
    .description('Build framework for react/redux ecosystem')
    .version(version);

program
    .command('test [runnerArgs...]')
    .alias('t')
    .description('Build test suite')
    .option('-r, --runner [type]', 'Choose your test runner (e.g mocha, jest, jasmine...)')
    .option('--no-hmr', 'Disable hot reload')
    .action((runnerArgs, { runner, hmr }) => {
        test({ hot: hmr, runner, runnerArgs: runnerArgs.join(' ') });
    })
    .on('--help', () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ vitamin test -r mocha -- --color');
        console.log('');
    });

program
    .command('build')
    .alias('b')
    .description('Build server and client bundles')
    .option('-h, --hot', 'Activate hot module reload')
    .action(({ hot }) => build({ hot: checkHot(hot) }));

program
    .command('clean')
    .alias('c')
    .description('Delete server and client builds')
    .action(clean);


program
    .command('start')
    .alias('s')
    .description('Build and start application server')
    .option('--no-hmr', 'Disable hot reload')
    .action(({ hmr }) =>
        clean()
            .then(() => start({ hot: checkHot(hmr) }))
            .catch((err) => {
                if (err !== BUILD_FAILED) {
                    console.log(err.stack || err);
                }
                process.exit(1);
            }),
    );

program
    .command('serve')
    .description('Start application server')
    .action(serve);

program.parse(process.argv);
