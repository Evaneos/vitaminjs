import { parse as parseUrl } from 'url';
import serve from 'koa-static';
import mount from 'koa-mount';
import config from '../../../config';

const parsedPath = parseUrl(config.publicPath).pathname || '';
const mountPath = parsedPath.slice(config.basePath.length);

const servePublic = serve(config.client.buildPath);

export default (config.servePublic ?
    () => (mountPath.length ? mount(mountPath, servePublic) : servePublic) :
    () => null
);
