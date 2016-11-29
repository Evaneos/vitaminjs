import { parse as parseUrl } from 'url';
import serve from 'koa-static';
import mount from 'koa-mount';
import config from '../../../config';

const parsedPath = parseUrl(config.publicPath).pathname || '';
const mountPath = parsedPath.slice(config.basePath.length);

export default !config.servePublic ? () => null : () => (
    mountPath.length ?
        mount(mountPath, serve(config.client.buildPath)) :
        /* otherwise */
        serve(config.client.buildPath)
);
