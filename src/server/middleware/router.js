import { match } from 'react-router';
import appConfig from '../../app_descriptor/shared';

export default function* routerMiddleware(next) {
    const url = this.req.url;
    match({ routes: appConfig.routes, location: url },
        (error, redirectLocation, renderProps) => {
            if (error) {
                this.status = 500;
                this.body = error.message;
            } else if (redirectLocation) {
                this.redirect(redirectLocation.pathname + redirectLocation.search);
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
}
