/* eslint no-console: 0 */

import program from 'commander';
import webpack from 'webpack';
import path from 'path';
import rimraf from 'rimraf';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import ProgressBar from 'progress';
import chalk from 'chalk';
import Logger, { formatter } from '../config/utils/consoleLogger';
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
        Logger.warning(chalk.bold('Warning: Hot module reload option ignored in production environment.'),
            '(based on your NODE_ENV variable)');
        /* eslint no-param-reassign: 0 */
        return false;
    }
    return hot;
};

const buildCallback = (resolve, reject) => (err, stats) => {
    if (err || stats.hasErrors()) {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        Logger.log(stats.toString({
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
    const bar = new ProgressBar(
        `${formatter(message, 'pending')} :percent [:bar]`,
        { incomplete: ' ', total: 60, width: 50, clear: true, stream: process.stdout },
    );
    compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
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
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        Logger.success(`Server bundle successfully ${chalk.bold('built')}!`);
    })
:
    commonBuild(webpackConfigClient, '\t\uD83D\uDD50  Building client bundle(s)...', options)
        .then((stats) => {
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
            Logger.success(`Client bundle(s) successfully ${chalk.bold('built')}!`);
            return stats;
        })
        .then(stats => commonBuild(
            webpackConfigServer, '\t\uD83D\uDD50  Building server bundle...',
            { ...options, assetsByChunkName: stats.toJson().assetsByChunkName },
        ))
        .then(() => {
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
            Logger.success(`Server bundle successfully ${chalk.bold('built')}!`);
        })
);


const test = ({ hot, runner, runnerArgs }) => {
    const launchTest = () => {
        Logger.pending('\uD83D\uDD50 Launching tests...');
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
    const bar = new ProgressBar(
        `${formatter('Building tests...')} :percent [:bar]`,
        { incomplete: ' ', total: 60, width: 50, clear: true, stream: process.stdout },
    );
    compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
    if (hot) {
        compiler.watch({}, buildCallback(launchTest));
    } else {
        compiler.run(buildCallback(launchTest));
    }
};

const serve = () => {
    process.stdout.write(formatter('\t\uD83D\uDD50  Launching server...', 'pending'));
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
        Logger.error(
    `\n\nServer process exited unexpectedly. If it is not an EADDRINUSE error, it
might be because of a problem with vitaminjs itself. Please report it to
https://github.com/Evaneos/vitaminjs/issues`,
        );
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
    .option('-h, --hot', 'Activate hot reload for tests')
    .action((runnerArgs, { runner, hot }) => {
        test({ hot, runner, runnerArgs: runnerArgs.join(' ') });
    })
    .on('--help', () => {
        Logger.log('  Examples:');
        Logger.log('');
        Logger.log('    $ vitamin test -r mocha -- --color');
        Logger.log('');
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
    .option('-h, --hot', 'Activate hot reload')
    .action(({ hot }) =>
        clean()
            .then(() => build({ hot: checkHot(hot) }).then(serve))
            .catch((err) => {
                Logger.error(err);
                process.exit(1);
            }),
    );

program
    .command('serve')
    .description('Start application server')
    .action(serve);

program.parse(process.argv);
