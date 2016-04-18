import compose from 'koa-compose';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';

import renderer from './middleware/renderer';
import storeCreator from './middleware/store';
import router from './middleware/router';
import staticAssetsServer from './middleware/staticAssetsServer';
import appMiddlewares from '__app_modules__server_middlewares__';
export default compose([
    // Enable Hot Reload when vitamin devServer url differs from app url (externalUrl)
    ...(process.env.NODE_ENV !== 'production' ?
        [function *setCORS(next) { this.set('Access-Control-Allow-Origin', '*'); yield next; }] :
        []
    ),
    conditional(),
    etag(),
    ...appMiddlewares,
    staticAssetsServer(),
    storeCreator(),
    router(),
    renderer(),
]);
