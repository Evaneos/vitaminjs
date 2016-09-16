import fs from 'fs';
import { appResolve } from '../../config/utils';
import config from '../../config';

export default () => (new Promise((resolve, reject) =>
    fs.readFile(appResolve(config.build.path, 'webpack-assets.json'), 'utf8', (err, data) => (
        err ? reject(err) : resolve(data)
    )))
    .then(webpackAssets =>
        /* Return an object with key being the entry name, and the value, the absolute url */
        Object.entries(JSON.parse(webpackAssets)).reduce((newEntries, [entryName, value]) => ({
            [entryName]: Object.values(value)[0],
            ...newEntries,
        }), {}),
        (err) => {
            // eslint-disable-next-line no-console
            console.error('Cannot open webpack-assets.json in the build folder. This file is' +
            'needed for serving client bundle(s).');
            throw err;
        }
    )
);
