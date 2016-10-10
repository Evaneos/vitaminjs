import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import chalk from 'chalk';

/* eslint-disable import/no-extraneous-dependencies */
import ErrorPage from '__app_modules__server_ErrorPage__';
import userOnError from '__app_modules__server_onError__';
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
        children:
            <div
                dangerouslySetInnerHTML={{ __html: renderToString(
                    <CSSProvider insertCss={insertCss}>
                        <ErrorPage {...props} />
                    </CSSProvider>
                ) }}
            />,
        style: css.join(''),
        head: Helmet.rewind(),
    });
};

const onError = (context) => {
    /* eslint-disable no-console */
    console.error(
        chalk.red(`Error ${context.HTTPStatus}:`),
        `${context.request.method} ${context.request.url}`,
    );
    if (context.HTTPStatus === 500) {
        console.error(chalk.red.bold(context.error.message));
        console.error(chalk.grey(context.error.stack));
    }
    /* eslint-enable no-console */
    userOnError(context);
};

function getContext(error) {
    return {
        ...(error ? { error } : {}),
        ...(this.state.store ? { state: this.state.store.getState() } : {}),
        HTTPStatus: this.status,
        request: this.request,
    };
}

function renderError(error) {
    try {
        const context = getContext.call(this, error);
        this.body = renderErrorPage(context);
        onError(context);
    } catch (renderingError) {
        this.body = renderRawError(this.status, renderingError);
        onError(getContext.call(this, renderingError));
    }
    this.type = 'html';
}

export default () => function* errorHandlerMiddleware(next) {
    try {
        yield next;
    } catch (error) {
        this.status = 500;
        renderError.call(this, error);
    }
    if (this.status === 404) {
        if (this.state.store) {
            renderError.call(this);
        } else {
            // If there is no store, it means that it is a middleware that put a 404, we don't
            // print a vitaminjs 404
            onError(getContext.call(this));
            if (!process.env.NODE_ENV === 'production' && !this.body) {
                // eslint-disable-next-line no-console
                console.warn(chalk.yellow(`\
It seems that one of your custom koa middleware returned a 404 with no response body.
This might be intentional, or you might have forgot to yield next.
(see https://github.com/koajs/koa/blob/master/docs/guide.md#writing-middleware)`
                ));
            }
        }
    }
};
