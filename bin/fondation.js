/* eslint no-console: 0 */

import program from 'commander';
import webpack from 'webpack';
import path from 'path';
import rimraf from 'rimraf';
import { spawn } from 'child_process';

import webpackConfig from '../src/build_config/webpack.config';
import webpackConfigServer from '../src/build_config/webpack.config.server';
import buildConfig from '../src/app_descriptor/build';
import { version } from '../package.json';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import ProgressBar from 'progress';
const clean = () => {
    // TODO : be more smart ? and use promise
    const noop = () => null;
    rimraf(path.join(process.cwd(), buildConfig.server.path, buildConfig.server.filename + '*'), noop);
    rimraf(path.join(process.cwd(), buildConfig.server.path, '*.hot-update.*'), noop);
    rimraf(path.join(process.cwd(), buildConfig.client.path, buildConfig.client.filename + '*'), noop);
};

const build = ({ hot, watch }, config) => new Promise((resolve, reject) => {
    const dev = process.env.NODE_ENV !== 'production';
    if (hot && !dev) {
        console.warn('Warning: Hot module reload option ignored in production environment. \n(based on your NODE_ENV variable)');
        /* eslint no-param-reassign: 0 */
        hot = false;
    }
    const compiler = webpack(config({ hot, dev }));
    const bar = new ProgressBar(
        'Building app... :percent [:bar]',
        { incomplete: ' ', total: 60, width: 50, clear: true }
    );
    const callback = (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(stats.toString({
                colors: true,
                errorDetails: true,
            }));
            return reject(err);
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
        return resolve();
    };
    if (watch) {
        compiler.watch({}, () => null);
    } else {
        compiler.apply(new ProgressPlugin((percentage, msg) => bar.update(percentage, { msg })));
        compiler.run(callback);
    }
});


const serve = () => {
    console.log('Launching server...');
    const serverFile = path.join(
        process.cwd(),
        buildConfig.server.path,
        buildConfig.server.filename
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
    .command('build')
    .alias('b')
    .description('Build server and client bundles')
    .option('-h, --hot', 'Activate hot module reload')
    .action(({ hot }) => {
        build({ hot }, webpackConfig);
    });


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
    .action(({ hot }) => (hot ?
        build({ hot }, webpackConfigServer) :
        build({ hot }, webpackConfig)
    ).then(() => {
        if (hot) {
            build({ hot, watch: true }, webpackConfigServer);
        }
        serve();
    }));


program
    .command('serve')
    .description('Start application server')
    .action(serve);

program.parse(process.argv);
