import serve from 'koa-static';
import mount from 'koa-mount';
import compose from 'koa-compose';
import send from 'koa-send';
import path from 'path';
import config from '../../../config';
import getClientEntryPaths from '../getClientEntryPaths';


function* serveClientEntries(next) {
    const entryPaths = yield getClientEntryPaths();
    const relativeEntryPaths = Object.values(entryPaths)
        .filter(s => !s.startsWith('http') && !s.startsWith('//'))
        .map(s =>
            s.slice(config.server.basePath.length + config.build.client.publicPath.length)
        );
    if (relativeEntryPaths.indexOf(this.url) !== -1) {
        yield send(this, this.url.slice(1), { root: config.build.path });
    } else {
        yield next;
    }
}

function* serveStaticAssetsRegistry(next) {
    if (this.url !== '/entry-paths.json') {
        yield next;
    } else {
        this.body = yield getClientEntryPaths();
    }
}

const serveStaticAssets = compose([
    serveClientEntries,
    serveStaticAssetsRegistry,
    mount('/files', serve(path.join(config.build.path, 'files'))),
]);

const publicPath = config.build.client.publicPath;
export default () => (publicPath ? mount(publicPath, serveStaticAssets) : serveStaticAssets);
