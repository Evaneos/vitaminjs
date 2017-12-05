const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');
const webpackConfigTest = require('../config/build/webpack.config.tests');

const { commonBuild } = require('./commonBuild');

module.exports = ({ hot, runner, runnerArgs }) => {
    const launchTest = (config) => {
        if (!config.test) {
            throw new Error('Please specify a test file path in .vitaminrc');
        }

        console.log(chalk.blue('\uD83D\uDD50 Launching tests...'));
        const serverFile = path.join(
            config.server.buildPath,
            'tests',
        );
        spawn(`${runner} ${serverFile} ${runnerArgs}`, { stdio: 'pipe' });
    };

    commonBuild(
        webpackConfigTest,
        'tests',
        { hot, dev: process.env.NODE_ENV !== 'production' },
        launchTest
    );
};
