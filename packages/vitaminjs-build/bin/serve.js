const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = (config) => {
    process.stdout.write(chalk.blue(`\uD83D\uDD50 ' Launching server...`));
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
    return spawn(process.argv[0], [serverFile], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
};
