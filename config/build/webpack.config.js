import webpackConfigClient from './webpack.config.client';
import webpackConfigServer from './webpack.config.server';

export default options =>
    [webpackConfigServer(options), webpackConfigClient(options)];
