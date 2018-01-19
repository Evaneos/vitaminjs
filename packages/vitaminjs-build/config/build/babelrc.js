const presetEnv = require('babel-preset-env');
const presetReact = require('babel-preset-react');
const presetStage1 = require('babel-preset-stage-1');
// FIXME This dependency is not exposing a valid CommonJS module, hence the trailing ".default"
const pluginReactRequire = require('babel-plugin-react-require').default;
const pluginTransformExportDefaultName = require('babel-plugin-transform-export-default-name-forked');
const pluginMinifyReplace = require('babel-plugin-minify-replace');
const pluginNodeEnvInline = require('babel-plugin-transform-node-env-inline');
const pluginMinifyDeadCodeElimination = require('babel-plugin-minify-dead-code-elimination');
const pluginMinifyGuardedExpressions = require('babel-plugin-minify-guarded-expressions');
// FIXME This dependency is not exposing a valid CommonJS module, hence the trailing ".default"
const pluginDiscardModuleReferences = require('babel-plugin-discard-module-references').default;
const pluginReactJsxSource = require('babel-plugin-transform-react-jsx-source');
const pluginReactJsxSelf = require('babel-plugin-transform-react-jsx-self');
const { vitaminResolve } = require('../utils');

module.exports = (env, options) => ({
    // order is: last to first
    presets: [
        [presetEnv, {
            modules: false,
            useBuiltIns: true,
            targets: env !== 'client' ? { node: 'current' }
                : { browsers: options.client.targetBrowsers },
        }],
        presetReact,
        presetStage1,
    ].filter(Boolean),
    // order is: first to last
    plugins: [
        // Make optional the explicit import of React in JSX files
        pluginReactRequire,
        // Adds component stack to warning messages
        options.dev && pluginReactJsxSource,
        // Adds __self attribute to JSX which React will use for some warnings
        options.dev && pluginReactJsxSelf,
        // replace process.env.NODE_ENV by its current value
        pluginNodeEnvInline,
        // replace IS_CLIENT and IS_SERVER
        [pluginMinifyReplace, {
            replacements: [
                {
                    identifierName: 'IS_CLIENT',
                    replacement: { type: 'booleanLiteral', value: env === 'client' },
                },
                {
                    identifierName: 'IS_SERVER',
                    replacement: { type: 'booleanLiteral', value: env === 'server' },
                },
            ],
        }],
        // Dead code elimination (for example: if (IS_CLIENT) { ... } becames if (false) { }
        [pluginMinifyDeadCodeElimination, { keepFnName: true }],
        // transforms `IS_CLIENT && doSomething()` => `false && doSomething()` to `false`
        pluginMinifyGuardedExpressions,
        // Remove server-only or client-only imports
        pluginDiscardModuleReferences,
        // easier debugging on export default arrow functions with the filename
        pluginTransformExportDefaultName,
    ].filter(Boolean),
    sourceRoot: vitaminResolve(),
});
