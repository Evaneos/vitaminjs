import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import serve from 'koa-static';
import validate from 'koa-validate';

import auth from './auth';
import { appResolve } from '../utils';
import serverConfig from '../appDescriptor/server';
import renderer from './renderer';


const router = new Router();
router.use(validate());
router.use(bodyParser());
const authServerURL = process.env.AUTH_SERVER_URL || 'https://tipi-api-mock.herokuapp.com';
const secret = process.env.SECRET || 'secret';
const authenticator = auth(secret);
router.post('/login', authenticator.authenticate(authServerURL));
router.post('/logout', authenticator.deauthenticate(authServerURL));

const app = koa();
app.use(authenticator.check());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(appResolve('public')));
(serverConfig.middlewares || []).forEach((m) => app.use(m));
app.use(renderer());
export default app;
