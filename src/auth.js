import request from 'superagent';
import compose from 'koa-compose';

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

export function authenticate(authServerURL, secret) {
    function upstreamAuthenticate(email, password) {
        return request
            .post(`${authServerURL}/authenticate`)
            .auth(email, password)
            .set('Accept', 'application/json');
    }

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


        this.cookies.set('auth_token', response.body.token, { httpOnly: false });
        this.body = { ok: true };

        // TODO
        // x Submit request to upstream server
        // x Grab upstream token
        // - Create a client token wrapping upstream token
        // - Set cookie with client token
    };

    return compose([acceptsJSONOnly, validate, authenticate]);
}
