import serve from 'koa-static';
import mount from 'koa-mount';
import config from '../../../config';

const mountPath = config.publicPath.slice(config.basePath.length);

export default () => (
    config.publicPath.match(/^(https?:)?\/\//) ?
        function* continueNext(next) { yield next; } :
    mountPath.length ?
        mount(mountPath, serve(config.client.buildPath)) :
    /* otherwise */
        serve(config.client.buildPath)
);
