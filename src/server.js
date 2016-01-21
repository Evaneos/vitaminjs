import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import serve from 'koa-static';
import validate from 'koa-validate';
import { authenticate } from './auth';
import { appResolve } from './utils';
import appDescriptor from './appDescriptor';
import renderer from './renderer';

const router = new Router();
router.use(validate());
router.use(bodyParser());
const authServerURL = process.env.AUTH_SERVER_URL || 'https://tipi-api-mock.herokuapp.com';
const secret = process.env.SECRET || 'shhhhh';
router.post('/authenticate', authenticate(authServerURL, secret));

const app = koa();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(serve(appResolve('public')));
app.use(renderer(appDescriptor));
app.listen(3000);
