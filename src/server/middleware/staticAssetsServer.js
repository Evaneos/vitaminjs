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
            function* serveClientBundle() {
                if (this.url === config.build.client.filename) {
                    yield send(this, config.build.client.filename, { root: config.build.path });
                }
            },
            mount('/files', serve(path.join(config.build.path, 'files'))),
        ]),
    )
;
