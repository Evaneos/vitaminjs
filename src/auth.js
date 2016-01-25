import request from 'superagent';
import compose from 'koa-compose';
import jwt from 'koa-jwt';
import { sign } from 'jsonwebtoken';

function *acceptsJSONOnly(next) {
    if (!this.accepts('json')) {
        this.throw(406);
    }
    yield next;
}

function *validate(next) {
    this.checkBody('email').isEmail();
    this.checkBody('password').notEmpty();
    if (this.errors) {
        // TODO Mainingful error message
        this.throw(422);
    }
    yield next;
}

const COOKIE_NAME = 'access_token';
const COOKIE_OPTIONS = { httpOnly: true };

function setAuthCookie(cookies, token) {
    cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

function clearAuthCookie(cookies) {
    cookies.set(COOKIE_NAME, '', {
        expires: new Date(1 /* timestamp*/),
        httpOnly: true
    });
}

export default function auth(secret) {
    function authenticate(authServerURL) {
        function upstreamAuthenticate(email, password) {
            return request
                .post(`${authServerURL}/authenticate`)
                .auth(email, password)
                .set('Accept', 'application/json');
        }

        const createToken = (payload) => sign(payload, secret);

        function *authenticate() {
            const { email, password } = this.request.body;
            let response;
            try {
                response = yield upstreamAuthenticate(email, password);
            } catch (err) {
                if (err.response.unauthorized) {
                    this.body = {
                        ok: false,
                        message: 'Invalid credentials'
                    };
                    return;
                }
                this.throw(502, 'Error from upstream server');
            }

            const token = createToken({ upstream: response.body.token });
            setAuthCookie(this.cookies, token);
            this.body = { ok: true };
        };

        return compose([acceptsJSONOnly, validate, authenticate]);
    }

    function deauthenticate() {
        return function *deauthenticate() {
            clearAuthCookie(this.cookies);
            this.body = { ok: true };
        };
    }

    function check() {
        return jwt({
            secret,
            key: 'token',
            cookie: COOKIE_NAME,
            passthrough: true
        });
    }

    return {
        authenticate,
        deauthenticate,
        check,
    }
}

