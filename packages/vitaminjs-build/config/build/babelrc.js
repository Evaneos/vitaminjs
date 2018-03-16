const path = require('path');
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

function envSpecificReplacements(env) {
    return [
        {
            identifierName: 'IS_CLIENT',
            replacement: { type: 'booleanLiteral', value: env === 'client' },
        },
        {
            identifierName: 'IS_SERVER',
            replacement: { type: 'booleanLiteral', value: env === 'server' },
        },
    ];
}

const plugins = [
    // Make optional the explicit import of React in JSX files
    {
        plugin: pluginReactRequire,
    },
    // Adds component stack to warning messages
    {
        plugin: pluginReactJsxSource,
        dev: true,
    },
    // Adds __self attribute to JSX which React will use for some warnings
    {
        plugin: pluginReactJsxSelf,
        dev: true,
    },
    // replace process.env.NODE_ENV by its current value
    {
        plugin: pluginNodeEnvInline,
    },
    // replace IS_CLIENT and IS_SERVER
    {
        plugin: pluginMinifyReplace,
        options: { replacements: envSpecificReplacements('client') },
        env: 'client',
    },
    {
        plugin: pluginMinifyReplace,
        options: { replacements: envSpecificReplacements('server') },
        env: 'server',
    },
    // Dead code elimination (for example: if (IS_CLIENT) { ... } becames if (false) { }
    {
        plugin: pluginMinifyDeadCodeElimination,
        options: { keepFnName: true },
        jest: false,
    },
    // transforms `IS_CLIENT && doSomething()` => `false && doSomething()` to `false`
    {
        plugin: pluginMinifyGuardedExpressions,
        jest: false,
    },
    // Remove server-only or client-only imports
    {
        plugin: pluginDiscardModuleReferences,
        jest: false,
    },
    // easier debugging on export default arrow functions with the filename
    {
        plugin: pluginTransformExportDefaultName,
        jest: false,
    },
];

function shouldInclude(plugin, options, key) {
    if (!(key in plugin)) return true;
    return (
        (plugin[key] && options[key]) ||
        (!plugin[key] && !options[key])
    );
}


function pluginsPredicate(env, options) {
    return function predicate(plugin) {
        return (
            // Should exclude if env is restricted and not the same
            (!('env' in plugin) || plugin.env === env) &&
            shouldInclude(plugin, options, 'dev') &&
            shouldInclude(plugin, options, 'jest')
        );
    };
}

module.exports = (env, options) => ({
    // order is: last to first
    presets: [
        [presetEnv, {
            modules: options.jest ? 'commonjs' : false,
            useBuiltIns: true,
            targets: env !== 'client' ? { node: 'current' }
                : { browsers: options.client.targetBrowsers },
        }],
        presetReact,
        presetStage1,
    ].filter(Boolean),
    plugins: plugins
        .filter(pluginsPredicate(env, options))
        // eslint-disable-next-line no-shadow
        .map(({ plugin, options = {} }) => [plugin, options]),
    // TODO later: check utility of sourceRoot and remove if not needed
    sourceRoot: path.resolve(__dirname, '..', '..'),
});
