import koa from 'koa';
import serve from 'koa-static';
import { appResolve } from '../utils';
import serverConfig from '../app_descriptor/server';
import renderer from './renderer';
import storeCreator from './store';
import router from './router';


const app = koa();
app.use(serve(appResolve('public')));
(serverConfig.middlewares || []).forEach((m) => app.use(m));
app.use(router);
app.use(storeCreator);
app.use(renderer);

export default app;
