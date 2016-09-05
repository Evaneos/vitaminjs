import { match } from 'react-router';
import routes from '__app_modules__routes__';

const routesWithStore = store => (
    typeof routes === 'function' ? routes(store) : routes
);

export default () => function* routerMiddleware(next) {
    const url = this.req.url;
    const history = this.state.history;

    match({ routes: routesWithStore(this.state.store), location: url, history },
        (error, redirectLocation, renderProps) => {
            if (error) {
                this.status = 500;
                this.body = error.message;
            } else if (redirectLocation) {
                this.redirect(
                    redirectLocation.basename + redirectLocation.pathname + redirectLocation.search
                );
            } else if (renderProps) {
                this.status = 200;
                this.state.renderProps = renderProps;
            } else {
                // TODO yield down the middleware chain
                this.status = 404;
                this.body = 'Not found';
            }
        }
    );
    if (this.status === 200) {
        yield next;
    }
};
