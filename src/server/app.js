import compose from 'koa-compose';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';

import renderer from './middleware/renderer';
import storeCreator from './middleware/store';
import router from './middleware/router';
import staticAssetsServer from './middleware/staticAssetsServer';
import appMiddlewares from '__app_modules__server_middlewares__';
export default compose([
    conditional(),
    etag(),
    ...appMiddlewares,
    staticAssetsServer(),
    storeCreator(),
    router(),
    renderer(),
]);
