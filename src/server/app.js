import compose from 'koa-compose';
import serve from 'koa-static';
import mount from 'koa-mount';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';

import { appResolve } from '../utils';
import serverConfig from '../app_descriptor/server';
import renderer from './middleware/renderer';
import storeCreator from './middleware/store';
import router from './middleware/router';

export default compose([
    conditional(),
    etag(),
    mount(serverConfig.publicUrl, serve(appResolve(serverConfig.publicPath))),
    ...(serverConfig.middlewares || []),
    storeCreator(),
    router(),
    renderer(),
]);
