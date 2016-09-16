import { vitaminResolve } from '../utils';

export default env => ({
    presets: [
        (env === 'client' ?
            ['es2015', { modules: false }] :
            'es2015-node6/object-rest'
        ),
        'react', 'es2016', 'es2017', 'stage-1',
    ],
    plugins: [
        // Make optional the explicit import of React in JSX files
        'react-require',
        // Add Object.entries, Object.values and other ES2017 functionalities
        ...(env === 'server' ?
            ['transform-runtime'] :
            // in the client, we prefer solution like https://polyfill.io/v2/docs/, to keep the
            // bundle the smallest possible.
            []
        ),

    ],
    sourceRoot: vitaminResolve(),
});
