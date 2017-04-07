import mergeWith from 'lodash.mergewith';
import webpack from 'webpack';
import path from 'path';
import { createBabelLoader, config } from './webpack.config.common.js';
import { concat, appResolve } from '../utils';

// eslint-disable-next-line
const appDependencies = require(appResolve('package.json')).dependencies;
const dependencies = {
    redux: true,
    history: true,
    'react-dom': true,
    'react-resolver': true,
    'react-router': true,
    'react-redux': true,
    'react-router-redux': true,
    'isomorphic-style-loader': true,
    'react-helmet': true,
    'redbox-react': true,
    'redux-thunk': true,
    ...appDependencies,
};

const vendors = Object.keys(dependencies)
    // Remove koa dependencies, not needed client bundle
    .filter(vendor => !vendor.startsWith('koa-'));

export default function vendorConfig(options) {
    if (!options.hot) {
        throw new Error('You should be in hot module reload mode to activate vendors dll');
    }
    return mergeWith({}, config(options), {
        entry: vendors,
        devtool: 'source-map',
        output: {
            path: options.client.buildPath,
            filename: 'vendorDLL[HMR].js',
            library: '__vitamin__vendor_dll',
        },
        // We don't want to bundle nodejs libraries (fs, path, etc...)
        target: 'node',
        module: {
            // Disable handling of unknown requires
            unknownContextRegExp: /$^/,
            unknownContextCritical: false,
            // Disable handling of requires with a single expression
            exprContextRegExp: /$^/,
            exprContextCritical: false,
            // Disable handling of expression in require
            wrappedContextRegExp: /$^/,
            wrappedContextCritical: false,

            rules: [
                createBabelLoader('client', options),
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.css'],
            mainFields: ['browser', 'module', 'main', 'style'],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DllPlugin({
                path: path.join(
                    options.client.buildPath,
                    'vendor-dll-manifest.json',
                ),
                name: '__vitamin__vendor_dll',
            }),
        ],
    }, concat);
}
