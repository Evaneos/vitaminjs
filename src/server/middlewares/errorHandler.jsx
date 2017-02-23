import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import chalk from 'chalk';

/* eslint-disable import/no-extraneous-dependencies */
import userOnError from '__app_modules__server_onError__';
import ErrorPage from '__app_modules__server_ErrorPage__';
/* eslint-enable import/no-extraneous-dependencies */

import CSSProvider from '../../shared/components/CSSProvider';
import { renderLayout } from '../render';

const renderRawError = (status, renderingError) => (
    process.env.NODE_ENV === 'production' ?
            status
        : `
            <h2> Error while rendering the ${status} error page.</h2>
            <p>You might want to check your ErrorPage component</p>
            <strong>${renderingError.name}: ${renderingError.message}</strong>
            <pre><code>${renderingError.stack}</pre></code>
            <hr>
        `
);

const renderErrorPage = (props) => {
    const css = [];
    const insertCss = styles => css.push(styles._getCss());

    return renderLayout({
        appHTMLString: renderToString(
            <CSSProvider insertCss={insertCss}>
                <ErrorPage {...props} />
            </CSSProvider>,
        ),
        style: css.join(''),
        head: Helmet.rewind(),
    });
};

const onError = (errorContext) => {
    /* eslint-disable no-console */
    console.error(
        chalk.red(`Error ${errorContext.HTTPStatus}:`),
        `${errorContext.request.method} ${errorContext.request.url}`,
    );
    if (errorContext.HTTPStatus === 500) {
        console.error(chalk.red.bold(errorContext.error.message));
        console.error(chalk.grey(errorContext.error.stack));
    }
    /* eslint-enable no-console */
    try {
        userOnError(errorContext);
    } catch (err) {
        console.error(chalk.red('An error occured while calling the onError function'));
        console.error(err);
    }
};

const errorToErrorContext = (ctx, error) => ({
    ...(error ? { error } : {}),
    ...(ctx.state.store ? { state: ctx.state.store.getState() } : {}),
    HTTPStatus: ctx.status,
    request: ctx.request,
});

const renderError = (ctx, error) => {
    try {
        const errorContext = errorToErrorContext(ctx, error);
        ctx.body = renderErrorPage(errorContext);
        onError(errorContext);
    } catch (renderingError) {
        ctx.body = renderRawError(ctx.status, renderingError);
        onError(errorToErrorContext(ctx, renderingError));
    }
    ctx.type = 'html';
};

export default () => async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.status = 500;
        renderError(ctx, error);
    }

    if (ctx.status === 404) {
        if (ctx.state.store) {
            renderError(ctx);
        } else {
            // If there is no store, it means that it is a middleware that put a 404, we don't
            // print a vitaminjs 404
            onError(errorToErrorContext(ctx));
            if (!process.env.NODE_ENV === 'production' && !ctx.body) {
                // eslint-disable-next-line no-console
                console.warn(chalk.yellow(`\
It seems that one of your custom koa middleware returned a 404 with no response body.
This might be intentional, or you might have forgot to yield next.
(see https://github.com/koajs/koa/blob/v2.x/docs/guide.md#writing-middleware)`,
                ));
            }
        }
    }
};
