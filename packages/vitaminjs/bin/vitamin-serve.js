#!/usr/bin/env node
require('vitaminjs-build/bin/vitamin-serve');

// const program = require('commander');
// const server = require('vitaminjs-build/cli/server');

// program
//     .name('serve')
//     .parse(process.argv);

// server.start(program.hmr);

// serverProcess.on('close', (code) => {
//     if (!code) {
//         return;
//     }
//     console.error(chalk.red(
//         `${chalk.bold('\n\nServer process exited unexpectedly. \n')}` +
//         '- If it is an `EADDRINUSE error, you might want to change the `server.port` key' +
//         ' in your `.vitaminrc` file\n' +
//         '- If it occurs during initialization, it is probably an error in your app. Check the' +
//         ' stacktrace for more info (`ReferenceError` are pretty common)\n' +
//         '- If your positive it\'s not any of that, it might be because of a problem with ' +
//         'vitaminjs itself. Please report it to https://github.com/Evaneos/vitaminjs/issues'
//     ));
//     process.exit(1);
// });
