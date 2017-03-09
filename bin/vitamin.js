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

import killProcess from '../config/utils/killProcess';
import webpackConfigServer from '../config/build/webpack.config.server';
import webpackConfigClient from '../config/build/webpack.config.client';
import webpackConfigTest from '../config/build/webpack.config.tests';
import parseConfig, { rcPath as configRcPath } from '../config';
import { version } from '../package.json';

const DEV = process.env.NODE_ENV !== 'production';

const symbols = {
    clock: '\uD83D\uDD50 ',
};

const clean = () => new Promise((resolve, reject) => {
    const config = parseConfig();
    return rimraf(
        path.join(config.server.buildPath, '*'),
        (err, data) => (!err ? resolve(data) : reject(err)),
    );
});

const checkHot = (hot) => {
    if (hot && !DEV) {
        console.log(chalk.yellow(
            '[WARNING]: Hot module reload option ignored in production environment.\n' +
            '(based on your NODE_ENV variable)\n',
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

const listenExitSignal = (callback) => {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        process.on(signal, () => callback(signal));
    });
};

const createCompiler = (webpackConfig, message, options) => {
    const compiler = webpack(webpackConfig);
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue(`${symbols.clock} Building ${message}...`)} :percent [:bar]`,
            { incomplete: ' ', total: 60, clear: true, stream: process.stdout },
        );
        compiler.apply(new ProgressPlugin((percentage, msg) => {
            bar.update(percentage, { msg });
        }));
        compiler.apply(new FriendlyErrorsWebpackPlugin({
            clearConsole: false && !!options.hot,
        }));
    }

    return compiler;
};

const commonBuild = (createWebpackConfig, message, options, hotCallback, restartServer) => {
    const createCompilerCommonBuild = () => {
        const config = parseConfig();
        const webpackConfig = createWebpackConfig({
            ...options,
            dev: DEV,
            ...config,
        });
        const compiler = createCompiler(webpackConfig, message, options);
        return { compiler, config };
    };

    if (!options.hot) {
        const { compiler, config } = createCompilerCommonBuild();
        return new Promise((resolve, reject) => (
            compiler.run(buildCallback(buildStats => resolve({ config, buildStats }), reject))
        ));
    }

    let webpackWatcher;
    const watch = () => (
        new Promise((resolve) => {
            const { compiler, config } = createCompilerCommonBuild();
            const callbackWatch = buildCallback((buildStats) => {
                hotCallback(config);
                resolve({ config, buildStats });
            });
            webpackWatcher = compiler.watch({}, callbackWatch);
        })
    );

    fs.watchFile(configRcPath, throttle(() => {
        webpackWatcher.close(() => watch().then(restartServer));
    }));

    return watch();
};

const build = (options, hotCallback, restartServer) => (options.hot ?
    commonBuild(
        webpackConfigServer,
        `server bundle ${chalk.bold('[hot]')}`,
        options,
        hotCallback,
        restartServer,
    )
:
    commonBuild(webpackConfigClient, 'client bundle(s)', options)
        .then(({ buildStats }) => commonBuild(
            webpackConfigServer, 'server bundle...',
            // Cannot build in parallel because server-side rendering
            // needs client bundle name in the html layout for script path
            { ...options, assetsByChunkName: buildStats.toJson().assetsByChunkName },
        ))
        .then(({ config }) => restartServer && restartServer(config))
);


const test = ({ hot, runner, runnerArgs }) => {
    const launchTest = (config) => {
        if (!config.test) {
            throw new Error('Please specify a test file path in .vitaminrc');
        }

        console.log(chalk.blue(`${symbols.clock} Launching tests...`));
        const serverFile = path.join(
            config.server.buildPath,
            'tests',
        );
        spawn(`${runner} ${serverFile} ${runnerArgs}`, { stdio: 'pipe' });
    };

    commonBuild(webpackConfigTest, 'tests', { hot, dev: DEV }, launchTest);
};


const serve = (config) => {
    process.stdout.write(chalk.blue(`${symbols.clock} Launching server...`));
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
    return spawn(process.argv[0], [serverFile], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
};

const start = (options) => {
    let serverProcess;

    let exiting = false;
    listenExitSignal((signal) => {
        exiting = true;
        if (!serverProcess) process.exit();
        killProcess(serverProcess, { signal }).then(() => {
            console.log('exiting'); process.exit();
        });
    });


    function startServer(config) {
        if (exiting) return;
        if (serverProcess) {
            killProcess(serverProcess).then(() => startServer(config));
            serverProcess = null;
            return;
        }
        serverProcess = serve(config);
        serverProcess.on('message', (message) => {
            if (message === 'restart') {
                // eslint-disable-next-line no-use-before-define
                startServer(config);
            }
        });
        serverProcess.on('close', () => {
            serverProcess = null;
        });
    }

    const sendSignal = (config) => {
        if (!serverProcess) {
            startServer(config);
            return;
        }

        serverProcess.kill('SIGUSR2');
    };

    return build(options, sendSignal, startServer);
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
    .action(({ hot }) => build({ hot: checkHot(hot) })
        .catch((err) => {
            if (err !== BUILD_FAILED) {
                console.log(err.stack || err);
            }
            process.exit(1);
        }),
    );

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
    .action(() => {
        const serverProcess = serve(parseConfig());

        listenExitSignal((signal) => {
            killProcess(serverProcess, { signal })
                .then(() => process.exit());
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
    });

program.parse(process.argv);
