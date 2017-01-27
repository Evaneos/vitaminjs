/* eslint no-console: 0 */

import program from 'commander';
import webpack from 'webpack';
import path from 'path';
import rimraf from 'rimraf';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import ProgressBar from 'progress';
import chalk from 'chalk';
import readline from 'readline';

import webpackConfigServer from '../config/build/webpack.config.server';
import webpackConfigClient from '../config/build/webpack.config.client';
import webpackConfigTest from '../config/build/webpack.config.tests';
import config from '../config';
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

const buildCallback = (resolve, reject) => (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(stats.toString({
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
            version: true,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false,
            colors: true,
        }));
        return reject && reject(err);
    }
    return resolve && resolve(stats);
};

const commonBuild = (webpackConfig, message, options) => new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig({ ...options, dev: DEV }));
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue(message)} :percent [:bar]`,
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
    if (options.hot) {
        compiler.watch({}, buildCallback(resolve, reject));
    } else {
        compiler.run(buildCallback(resolve, reject));
    }
});

const build = options => (options.hot ?
    commonBuild(
        webpackConfigServer,
        `\t\uD83D\uDD50  Building server bundle ${chalk.bold('[hot]')}...`,
        options,
    ).then(() => {
        console.log(`\t${chalk.green('\u2713')} Server bundle successfully ${chalk.bold('built')}!`);
    })
:
    commonBuild(webpackConfigClient, '\t\uD83D\uDD50  Building client bundle(s)...', options)
        .then((stats) => {
            console.log(`\t${chalk.green('\u2713')
                } Client bundle(s) successfully ${chalk.bold('built')}!`);
            return stats;
        })
        .then(stats => commonBuild(
            webpackConfigServer, '\t\uD83D\uDD50  Building server bundle...',
            { ...options, assetsByChunkName: stats.toJson().assetsByChunkName },
        ))
        .then(() => {
            console.log(`\t${chalk.green('\u2713')
                } Server bundle successfully ${chalk.bold('built')}!`);
        })
);


const test = ({ hot, runner, runnerArgs }) => {
    const launchTest = () => {
        console.log(chalk.blue('\t\uD83D\uDD50  Launching tests...'));
        const serverFile = path.join(
            config.server.buildPath,
            'tests',
        );
        const serverProcess = exec(`${runner} ${serverFile} ${runnerArgs}`);
        serverProcess.stdout.pipe(process.stdout);
        serverProcess.stderr.pipe(process.stderr);
    };

    if (config.test === undefined) {
        throw new Error('Please specify a test file path in .vitaminrc');
    }

    const compiler = webpack(webpackConfigTest({ hot, dev: DEV }));
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue('Building tests...')} :percent [:bar]`,
            { incomplete: ' ', total: 60, width: 50, clear: true, stream: process.stdout },
        );
        compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
    }
    if (hot) {
        compiler.watch({}, buildCallback(launchTest));
    } else {
        compiler.run(buildCallback(launchTest));
    }
};

const serve = () => {
    process.stdout.write(chalk.blue('\t\uD83D\uDD50  Launching server...'));
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
    const serverProcess = spawn('node', [serverFile], { stdio: 'inherit' });
    const killServer = signal => () => {
        serverProcess.kill(signal);
        process.exit();
    };
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => process.on(signal, killServer(signal)));
    serverProcess.on('close', (code) => {
        if (code === 0) {
            return;
        }
        console.error(chalk.red(
            `${chalk.bold(`\n\nServer process exited unexpectedly. \n`)}` +
            '- If it is an `EADDRINUSE error, you might want to change the `server.port` key' +
            ' in your `.vitaminrc` file\n' +
            '- If it occurs during initialization, it is probably an error in your app. Check the' +
            ' stacktrace for more info (`ReferenceError` are pretty common)\n' +
            '- If your positive it\'s not any of that, it might be because of a problem with ' +
            'vitaminjs itself. Please report it to https://github.com/Evaneos/vitaminjs/issues',
        ));
        process.exit(1);
    });
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
            .then(() => build({ hot: checkHot(hmr) }).then(serve))
            .catch((err) => {
                console.error(err);
                process.exit(1);
            }),
    );

program
    .command('serve')
    .description('Start application server')
    .action(serve);

program.parse(process.argv);
