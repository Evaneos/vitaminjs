import compose from 'koa-compose';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';

/*
 * We want to load errorHandler first, because usually, the global uncaught exception
 * catch will be instanciated inside it.
 */
import errorHandler from './middlewares/errorHandler';
// eslint-disable-next-line import/no-extraneous-dependencies, import/first
import appMiddlewares from '__app_modules__server_middlewares__';

import renderer from './middlewares/renderer';
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
