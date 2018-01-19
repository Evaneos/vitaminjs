import chalk from 'chalk';
import createDebug from 'debug';
import ProgressBar from 'progress';

import fs from 'fs';

const debug = createDebug('vitamin:stdio');

const symbols = {
    clock: '\uD83D\uDD50 ',
};

export function beginTask(name) {
    const fd = fs.openSync('build_server_hmr.txt', 'ax+');
    fs.closeSync(fd);

    debug('beginning task named "%s"', name);
    if (name === 'build/client/hmr') {
        process.stdout.write(`\x1b[0G${chalk.blue('\uD83D\uDD50  Building client bundle [in memory]...')}`);
        return {
            progress(percentage) {},
            success() {
                process.stdout.write(`\x1b[0G${chalk.green('\u2713')} Client bundle(s) successfully ${chalk.bold('built in memory')}\n\n`);
            },
            failure() {},
        };
    }
    // TODO process.stdout.isTTY
    let target;
    switch (name) {
        case 'build/client':
            target = 'client bundle(s)';
            break;
        case 'build/server':
            target = 'server bundle...';
            break;
        case 'build/server/hmr':
            target = `server bundle ${chalk.bold('[hot]')}`;
            break;
    }
    const message = `${chalk.blue(`${symbols.clock} Building ${target}...`)} :percent [:bar]`
    const bar = new ProgressBar(message, {
        incomplete: ' ',
        total: 60,
        // clear: true,
        clear: false,
        stream: process.stdout,
    });
    return {
        progress(percentage) {
            // debug('task named "%s" did progress to %d%%', name, percentage);
            bar.update(percentage);
        },
        success() {
            debug('task named "%s" did finish successfully', name);
            debug('beginning task named "%s"', name);
        },
        failure() {
            debug('task named "%s" did fail', name);
        },
    };
}

export function beginServerBuild() {
    return beginTask('build/server');
}

export function beginClientBuild() {
    return beginTask('build/client');
}
