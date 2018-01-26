#!/usr/bin/env node
/* eslint-disable no-console */
const chalk = require('chalk');
const listenExitSignal = require('vitaminjs-build/cli/listenExitSignal');
const serve = require('vitaminjs-build/cli/serve');
const parseConfig = require('vitaminjs-build/config');
const killProcess = require('vitaminjs-build/config/utils/killProcess');

require('vitaminjs-build/cli/setVitaminPath');

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
        'vitaminjs itself. Please report it to https://github.com/Evaneos/vitaminjs/issues'
    ));
    process.exit(1);
});
