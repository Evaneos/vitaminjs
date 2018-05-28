/* eslint-disable no-console */

const path = require('path');
const fs = require('fs-extra');
const watchman = require('fb-watchman');

const client = new watchman.Client();

client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error) => {
    if (error) {
        console.error(error);
        client.end();
        return;
    }

    // Sources.
    const PACKAGES_PATH = path.resolve(__dirname, 'packages');

    // Destinations.
    const EXAMPLES_NODE_MODULES = [
        path.resolve(__dirname, 'examples/counter/node_modules'),
        path.resolve(__dirname, 'examples/chunks/node_modules'),
        path.resolve(__dirname, 'examples/real-world-example/node_modules'),
    ];

    /**
     * Start watching vitaminjs packages directory.
     */
    client.command(['watch-project', PACKAGES_PATH], (error, response) => {
        if (error) {
            console.error('Error initiating watch:', error);
            return;
        }

        if (response.warning) {
            console.log('warning: ', response.warning);
        }

        /**
         * Subscribe vitaminjs packages changes for *.{js,jsx,css} files.
         */
        client.command(['subscribe', response.watch, 'vitaminjs-packages-changes', {
            expression: ['anyof',['match', '*.js'], ['match', '*.jsx'], ['match', '*.css'], ['match', '*.json']],
            fields: ['name', 'exists'],
        }], (error, response) => {
            if (error) {
                console.log('Failed to subscribe: ', error);
                return;
            }
            console.log('Watching', response.subscribe);
        });
    });

    /**
     * Update examples node_modules when vitaminjs packages changes.
     */
    client.on('subscription', (response) => {
        if (response.subscription !== 'vitaminjs-packages-changes') {
            return;
        }

        if (response.is_fresh_instance) {
            copyPackagesIntoExamples().then(() => {
                console.log('---------------------\nInitial sync finished\n---------------------');
            });
        } else {
            copyFilesIntoExamples(response.files).then(() => {
                console.log('-------------------\nWatch sync finished\n-------------------');
            });
        }
    });

    async function copyPackageIntoExample(packagePath, examplePath) {
        try {
            const result = await fs.copy(packagePath, examplePath);
            console.log('Synced directory: ', examplePath);
            return result;
        } catch (error) {
            console.error('Failed sync example ', examplePath, error);
            return error;
        }
    }

    async function copyPackagesIntoExamples() {
        try {
            const packagesDirectoriesNames = await fs.readdir(PACKAGES_PATH);

            return Promise.all(
                packagesDirectoriesNames.reduce((allPromises, packageDirectoryName) => {
                    const examplePromises = EXAMPLES_NODE_MODULES.map(exampleModulesPath => (
                        copyPackageIntoExample(
                            path.resolve(PACKAGES_PATH, packageDirectoryName),
                            path.resolve(exampleModulesPath, packageDirectoryName)
                        )
                    ));
                    return allPromises.concat(examplePromises);
                }, [])
            );
        } catch (error) {
            console.error('Failed initial sync examples ', error);
            return error;
        }
    }

    async function copyFile(src, dest) {
        try {
            const result = await fs.copy(src, dest);
            console.log('Synced file: ', dest);
            return result;
        } catch (error) {
            console.error('Failed sync file: ', dest, error);
            return error;
        }
    }

    async function copyFileIntoExamples(file) {
        return Promise.all(
            EXAMPLES_NODE_MODULES.map(examplePath => copyFile(
                path.resolve(PACKAGES_PATH, file.name),
                path.resolve(examplePath, file.name)
            ))
        );
    }

    async function copyFilesIntoExamples(files) {
        return Promise.all(
            files.map(file => copyFileIntoExamples(file))
        );
    }
});
