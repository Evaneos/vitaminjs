import { buildPreset as buildPreset2015 } from 'babel-preset-es2015';
import presetNode6 from 'babel-preset-es2015-node6/object-rest';
import presetReact from 'babel-preset-react';
import preset2016 from 'babel-preset-es2016';
import preset2017 from 'babel-preset-es2017';
import presetStage1 from 'babel-preset-stage-1';
import pluginReactRequire from 'babel-plugin-react-require';
import pluginTransformRuntime from 'babel-plugin-transform-runtime';
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
            [[pluginTransformRuntime, { polyfill: false }]] :
            // in the client, we prefer solution like https://polyfill.io/v2/docs/, to keep the
            // bundle size the smallest possible.
            []
        ),

    ],
    sourceRoot: vitaminResolve(),
});
