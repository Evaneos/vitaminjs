import serve from 'koa-static';
import mount from 'koa-mount';
import compose from 'koa-compose';
import send from 'koa-send';
import path from 'path';
import config from '../../../config';
export default () =>
    mount(
        config.build.client.publicPath,
        compose([
            function* serveClientBundle(next) {
                if (this.url === `/${CLIENT_BUNDLE_VERSION + config.build.client.filename}`) {
                    yield send(this, CLIENT_BUNDLE_VERSION + config.build.client.filename, {
                        root: config.build.path,
                    });
                } else {
                    yield next;
                }
            },
            mount('/files', serve(path.join(config.build.path, 'files'))),
        ]),
    )
;
