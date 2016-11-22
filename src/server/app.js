import compose from 'koa-compose';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';
// eslint-disable-next-line import/no-extraneous-dependencies
import appMiddlewares from '__app_modules__server_middlewares__';

import renderer from './middlewares/renderer';
import errorHandler from './middlewares/errorHandler';
import storeCreator from './middlewares/store';
import router from './middlewares/router';
import actionDispatcher from './middlewares/actionDispatcher';
import staticAssetsServer from './middlewares/staticAssetsServer';

export default compose([
    // Enable Hot Reload when vitamin devServer url differs from app url (externalUrl)
    process.env.NODE_ENV !== 'production' &&
        function* setCORS(next) { this.set('Access-Control-Allow-Origin', '*'); yield next; },
    conditional(),
    etag(),
    errorHandler(),
    ...appMiddlewares,
    staticAssetsServer(),
    storeCreator(),
    actionDispatcher(),
    router(),
    renderer(),
].filter(Boolean));
