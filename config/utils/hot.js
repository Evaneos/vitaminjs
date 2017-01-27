/* eslint-disable */
import chalk from 'chalk';

/*
 * copied from https://github.com/webpack/webpack/blob/master/hot/signal.js
 * and tweeked to display better color messages and send a restart signal
 */
/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
/*globals __resourceQuery */
if(!module.hot) {
    throw new Error("[HMR] Hot Module Replacement is disabled.");
}
if (!process.send) {
    throw new Error("[HMR] You need to spawn the process.");
}
var checkForUpdate = function checkForUpdate(fromUpdate) {
module.hot.check().then(function(updatedModules) {
  if(!updatedModules) {
    if(fromUpdate)
      console.log(`${chalk.green('\u2713')} Server hot reloaded.`);
    return;
  }

  return module.hot.apply({
    ignoreUnaccepted: true,
    onUnaccepted: function(data) {
        console.log(`${chalk.red('\u2717')
            } Hot module ignored an update to unaccepted module ${data.chain.join(" -> ")}`
        );
    },
  }).then(function(renewedModules) {
    const unacceptedModules = updatedModules.filter(moduleId => (
      renewedModules && !renewedModules.includes(moduleId)
    ));
    if (unacceptedModules.length) {
      process.send('restart');
    }

    checkForUpdate(true);
  });
}).catch(function(err) {
    process.send('restart');
});
};

process.on(__resourceQuery.substr(1) || "SIGUSR2", function() {
if(module.hot.status() !== "idle") {
  console.warn("[HMR] Got signal but currently in " + module.hot.status() + " state.");
  console.warn("[HMR] Need to be in idle state to start hot update.");
  return;
}

checkForUpdate();
});

