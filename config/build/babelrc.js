import { vitaminResolve } from '../utils';
export default (env) => ({
    presets: [
        (env === 'client' ?
            ['es2015', { modules: false }] :
            'es2015-node6/object-rest'
        ),
        'react',
        'stage-1',
    ],
    plugins: [
        // Make optional the explicit import of React in JSX files
        'react-require',
    ],
    sourceRoot: vitaminResolve(),
});
