import presetEnv from 'babel-preset-env';
import presetReact from 'babel-preset-react';
import presetStage1 from 'babel-preset-stage-1';
import pluginReactRequire from 'babel-plugin-react-require';
import pluginTransformExportDefaultName from 'babel-plugin-transform-export-default-name-forked';
import pluginMinifyReplace from 'babel-plugin-minify-replace';
import pluginNodeEnvInline from 'babel-plugin-transform-node-env-inline';
import pluginMinifyDeadCodeElimination from 'babel-plugin-minify-dead-code-elimination';
import pluginMinifyGuardedExpressions from 'babel-plugin-minify-guarded-expressions';
import pluginDiscardModuleReferences from 'babel-plugin-discard-module-references';
import pluginReactJsxSource from 'babel-plugin-transform-react-jsx-source';
import pluginReactJsxSelf from 'babel-plugin-transform-react-jsx-self';
import transformClassProperties from 'babel-plugin-transform-class-properties';
import transformEs2015Classes from 'babel-plugin-transform-es2015-classes';
import { vitaminResolve } from '../utils';

export default (env, options) => ({
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
        // For Radium
        transformClassProperties,
        // For Radium
        transformEs2015Classes,
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
