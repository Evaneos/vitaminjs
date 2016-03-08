import compose from 'koa-compose';
import serve from 'koa-static';
import mount from 'koa-mount';
import { appResolve } from '../utils';
import serverConfig from '../app_descriptor/server';
import renderer from './middleware/renderer';
import storeCreator from './middleware/store';
import router from './middleware/router';


export default compose([
    mount(serverConfig.publicUrl, serve(appResolve(serverConfig.publicPath))),
    ...(serverConfig.middlewares || []),
    router(),
    storeCreator(),
    renderer(),
]);

