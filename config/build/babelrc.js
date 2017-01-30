import { buildPreset as buildPreset2015 } from 'babel-preset-es2015';
import presetNode6 from 'babel-preset-es2015-node6';
import presetReact from 'babel-preset-react';
import preset2016 from 'babel-preset-es2016';
import preset2017 from 'babel-preset-es2017';
import presetStage1 from 'babel-preset-stage-1';
import pluginReactRequire from 'babel-plugin-react-require';
import pluginTransformRuntime from 'babel-plugin-transform-runtime';
import pluginTransformExportDefaultName from 'babel-plugin-transform-export-default-name-forked';
import pluginMinifyReplace from 'babel-plugin-minify-replace';
import pluginNodeEnvInline from 'babel-plugin-transform-node-env-inline';
import pluginMinifyDeadCodeElimination from 'babel-plugin-minify-dead-code-elimination';
import pluginMinifyGuardedExpressions from 'babel-plugin-minify-guarded-expressions';
import pluginDiscardModuleReferences from 'babel-plugin-discard-module-references';
import { vitaminResolve } from '../utils';

export default env => ({
    presets: [
        env === 'client' ? [buildPreset2015, { modules: false }] : presetNode6,
        presetReact,
        preset2016,
        preset2017,
        presetStage1,
    ],
    plugins: [
        // Make optional the explicit import of React in JSX files
        pluginReactRequire,
        // Add Object.entries, Object.values and other ES2017 functionalities
        ...(env === 'server' ?
            [pluginTransformRuntime] :
            // in the client, we prefer solution like https://polyfill.io/v2/docs/, to keep the
            // bundle size the smallest possible.
            []
        ),
        // Remove server-only or client-only imports
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
        pluginNodeEnvInline,
        [pluginMinifyDeadCodeElimination, { keepFnName: true }],
        pluginMinifyGuardedExpressions,
        pluginTransformExportDefaultName,
        pluginDiscardModuleReferences,
    ],
    sourceRoot: vitaminResolve(),
});
