import chalk from 'chalk';

/* eslint-disable */
if (module.hot) {
    var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);

    function checkForUpdate(fromUpdate) {
        if(module.hot.status() === "idle") {
            module.hot.check(true).then(function(updatedModules) {
                if(!updatedModules) {
                    if(fromUpdate ) {
                        console.log(`\t${chalk.green('\u2713')} Server hot reloaded.`);
                    }
                    return;
                }
                checkForUpdate(true);
            }).catch(function(err) {
                var status = module.hot.status();
                if(["abort", "fail"].indexOf(status) >= 0) {
                    console.log(`\t${chalk.red(`\u2717 Could not hot reload the latest ` +
                        `modification on server. You'll need to ${
                        chalk.bold('restart')} vitamin`)}`
                    );
                } else {
                    console.log(`\t${chalk.red('\u2717')
                        } Hot module reload update failed. ${err.stack || err.message}`
                    );
                }
            });
        }
    }
    setInterval(checkForUpdate, hotPollInterval);
} else {
    throw new Error("[HMR] Hot Module Replacement is disabled.");
}
