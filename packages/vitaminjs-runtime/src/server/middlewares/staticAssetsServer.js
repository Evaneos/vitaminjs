import { parse as parseUrl } from 'url';
import serve from 'koa-static';
import mount from 'koa-mount';
import config from 'vitaminjs-build/config';

// examples
// basePath: / or /app
// publicPath: / or [/app]/public-path or http://localhost:3000[/app]/public-path
// parsedPath: / or [/app]/public-path or [/app]/public-path
// mountPath : / or /public-path

const parsedPath = parseUrl(config.publicPath).pathname || '';
const mountPath = parsedPath.substr(config.basePath.replace(/\/+$/, '').length);

const servePublic = serve(config.client.buildPath);

export default (config.servePublic ?
    () => (mountPath.length ? mount(mountPath, servePublic) : servePublic) :
    () => null
);
