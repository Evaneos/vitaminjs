import { vitaminResolve } from '../utils';
export default (env) => ({
    presets: [
        ...(env === 'client' ?
            [require.resolve('babel-preset-es2015-webpack')] :
            [require.resolve('babel-preset-es2015-node5')]
        ),
        require.resolve('babel-preset-react'),
        require.resolve('babel-preset-stage-1'),
    ],
    plugins: [
        // Make optional the explicit import of React in JSX files
        require.resolve('babel-plugin-react-require'),
    ],
    sourceRoot: vitaminResolve(),
});
