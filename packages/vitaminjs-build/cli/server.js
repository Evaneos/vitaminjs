const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const debug = require('debug')('vitamin:server');
const appConfig = require('../config').resolveConfig();

// FIXME: server try to start twice hot mode, module is loaded twice

let serverProcess = null;
let exitingProcess = false;

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => {
        debug('forwarding parent process signal %s', signal);
        exitingProcess = true;
        if (null === serverProcess) process.exit();
        stop(signal).then(process.exit);
    });
});

function start() {
    debug('starting');

    if (exitingProcess) {
        debug('exiting in progress');
        return;
    }

    if (serverProcess) {
        debug('already started, restart now');
        restart();
        return;
    }

    const serverFile = path.join(
        appConfig.server.buildPath,
        appConfig.server.filename
    );

    try {
        debug('checking server file existance');
        fs.accessSync(serverFile, fs.constants.F_OK);
    } catch (err) {
        debug('server file not found at %s', serverFile);
        process.exit(1);
    }

    debug('spawn process');
    serverProcess = spawn(process.argv0, [serverFile], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    serverProcess.on('message', message => {
        debug('received restart message event');
        if (message === 'restart') restart();
    });

    serverProcess.on('close', () => {
        debug('received close event');
        serverProcess.removeAllListeners();
        serverProcess = null;
    });
}

function restart() {
    debug('stop process for restart');
    stop().then(() => {
        serverProcess = null;
        start();
    });
}

function reload() {
    debug('received reload message');
    if (null === serverProcess) {
        start();
        return;
    }
    serverProcess.kill('SIGUSR2');
}

function stop(signal = 'SIGTERM', timeout = 15000) {
    debug('stop with signal %s', signal);
    return new Promise(resolve => {
        const killTimeout = setTimeout(() => {
            debug('force with SIGKILL after %dms', timeout);
            serverProcess.kill('SIGKILL');
        }, timeout);
        serverProcess.removeAllListeners();
        serverProcess.addListener('exit', () => {
            clearTimeout(killTimeout);
            resolve();
        });
        serverProcess.kill(signal);
    });
}

module.exports = {
    start,
    reload,
    restart,
    stop
};
