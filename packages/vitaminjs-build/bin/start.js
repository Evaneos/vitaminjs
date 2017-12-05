const serve = require('./serve');

const build = require('./build');
const killProcess = require('../config/utils/killProcess');
const listenExitSignal = require('./listenExitSignal');

module.exports = (options) => {
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
