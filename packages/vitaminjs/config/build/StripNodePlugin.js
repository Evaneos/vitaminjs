const BLACKLIST = [
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'fs',
    'module',
    'net',
    'readline',
    'repl',
    'tls',
];

const assert = require('assert');
const ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');
const SingleEntryDependency = require('webpack/lib/dependencies/SingleEntryDependency');
const ModuleReason = require('webpack/lib/ModuleReason');
const Module = require('webpack/lib/Module');

module.exports = class StripNodePlugin {
    apply(compiler) {
        let blacklistedEntries = [];
        let recompilation = false;
        compiler.plugin('compilation', (compilation) => {
            if (recompilation) {
                const originalAddEntry = compilation.addEntry;
                compilation.addEntry = function (context, entry, name, callback) {
                    entry.dependencies = entry.dependencies.filter((dep) => {
                        return !blacklistedEntries.includes(dep.request);
                    });
                    return originalAddEntry.call(this, context, entry, name, callback);
                };
                return;
            }

            const blacklistedModules = [];

            compilation.plugin('finish-modules', (modules) => {
                modules.forEach((module) => {
                    assert(module instanceof Module);
                    module.dependencies.forEach((dep) => {
                        if (dep instanceof ModuleDependency && BLACKLIST.includes(dep.request)) {
                            blacklistedModules.push(module);
                        }
                    });
                });
                // Find entry for each module
                function findEntries(module) {
                    let entries = [];
                    module.reasons.forEach((reason) => {
                        assert(reason instanceof ModuleReason);
                        if (reason.dependency instanceof SingleEntryDependency) {
                            entries.push(reason.dependency.request);
                        }
                        entries = entries.concat(findEntries(reason.module));
                    });
                    return entries;
                }
                blacklistedModules.forEach((module) => {
                    blacklistedEntries = blacklistedEntries.concat(findEntries(module));
                });
                // console.log('blacklisted entries', blacklistedEntries);
            });

            compilation.plugin('need-additional-pass', () => {
                if (blacklistedEntries.length) {
                    return true;
                }
            });
        });

        compiler.plugin('additional-pass', (callback) => {
            recompilation = true;
            callback();
        });
    }
}
