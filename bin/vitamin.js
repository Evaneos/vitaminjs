/* eslint no-console: 0 */

import program from 'commander';
import webpack from 'webpack';
import path from 'path';
import rimraf from 'rimraf';
import { spawn, exec } from 'child_process';

import webpackConfigClient from '../config/build/webpack.config.client';
import webpackConfigServer from '../config/build/webpack.config.server';
import webpackConfigTest from '../config/build/webpack.config.tests';
import config from '../config';
import { version } from '../package.json';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import ProgressBar from 'progress';

const DEV = process.env.NODE_ENV !== 'production';


const clean = () => new Promise((resolve, reject) =>
    rimraf(
        path.join(config.build.path, '*'),
        (err, data) => (!err ? resolve(data) : reject(err))
    )
);

const checkHot = (hot) => {
    if (hot && !DEV) {
        console.warn(`Warning: Hot module reload option ignored in production environment.
(based on your NODE_ENV variable)`);
        /* eslint no-param-reassign: 0 */
        return false;
    }
    return hot;
};

const buildCallback = (resolve, reject) => (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(stats.toString({
            colors: true,
            errorDetails: true,
        }));
        return reject && reject(err);
    }
    console.log('Build complete!');
    console.log(stats.toString({
        colors: true,
        timings: true,
        hash: true,
        version: false,
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false,
        cached: false,
        reasons: false,
        source: false,
        errorDetails: false,
        chunkOrigins: false,
    }));
    return resolve && resolve(stats);
};

const buildClient = ({ hot }) => new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfigClient({ hot, dev: DEV }));
    const bar = new ProgressBar(
        'Building client... :percent [:bar]',
        { incomplete: ' ', total: 60, width: 50, clear: true }
    );
    compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
    compiler.run(buildCallback(resolve, reject));
});

const buildServer = ({ hot, watch, hash }) => new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfigServer({ hot, dev: DEV, hash }));
    const bar = new ProgressBar(
        'Building server... :percent [:bar]',
        { incomplete: ' ', total: 60, width: 50, clear: true }
    );
    if (watch) {
        compiler.watch({}, () => null);
    } else {
        compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
        compiler.run(buildCallback(resolve, reject));
    }
});

const build = ({ hot }) =>
    // Generate client bundle and hash version
    (hot ? Promise.resolve({ hash: null }) : buildClient({ hot }))
        .then(({ hash }) => {
            // Generate server bundle version, thanks to the hash
            const promise = buildServer({ hot, hash });
            if (hot) promise.then(() => buildServer({ hot, hash, watch: true }));
            return promise;
        });

const test = ({ hot, runner, runnerArgs }) => {
    const launchTest = () => {
        console.log('Launching tests...');
        const serverFile = path.join(
            config.build.path,
            'tests'
        );
        const serverProcess = exec(`${runner} ${serverFile} ${runnerArgs}`);
        serverProcess.stdout.on('data', data => console.log(data.toString().trim()));
        serverProcess.stderr.on('data', data => console.error(data.toString()));
    };

    if (config.test === undefined) {
        throw new Error('Please specify a test file path in .vitaminrc');
    }

    const compiler = webpack(webpackConfigTest({ hot, dev: DEV }));
    const bar = new ProgressBar(
        'Building tes' +
        'ts... :percent [:bar]',
        { incomplete: ' ', total: 60, width: 50, clear: true }
    );
    compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
    if (hot) {
        compiler.watch({}, buildCallback(launchTest));
    } else {
        compiler.run(buildCallback(launchTest));
    }
};

const serve = () => {
    console.log('Launching server...');
    const serverFile = path.join(
        config.build.path,
        config.build.server.filename
    );
    const serverProcess = spawn('node', [serverFile]);
    process.on('SIGINT', () => {
        serverProcess.kill('SIGINT');
        process.exit(128 + 2);
    });
    serverProcess.stdout.on('data', data => console.log(data.toString().trim()));
    serverProcess.stderr.on('data', data => console.error(data.toString()));
    serverProcess.on('close', code => {
        throw new Error(`Server exit with code ${code}`);
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
    .option('-h, --hot', 'Activate hot reload')
    .action(({ hot }) =>
        clean()
            .then(() => build({ hot: checkHot(hot) }).then(serve))
            .catch(err => {
                console.error(err);
                process.exit(1);
            })
    );

program
    .command('serve')
    .description('Start application server')
    .action(serve);

program.parse(process.argv);
