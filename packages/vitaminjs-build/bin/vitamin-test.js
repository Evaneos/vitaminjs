#!/usr/bin/env node
const program = require('commander');

require('./setVitaminPath');

program
    .option('-r, --runner [type]', 'Choose your test runner (e.g mocha, jest, jasmine...)')
    .option('--no-hmr', 'Disable hot reload')
    .on('--help', () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ vitamin test -r mocha -- --color');
        console.log('');
    })
    .parse(process.argv);

test({
    hot: program.hmr,
    runner: program.runner,
    runnerArgs: program.args.join(' ')
});
