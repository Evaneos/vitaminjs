import AsyncProps, { loadPropsOnServer } from 'async-props';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';

import App from '../shared/components/App';
import getClientEntryPaths from './getClientEntryPaths';

export const renderLayout = props =>
    `${Layout.doctype ? `${Layout.doctype}\n` : ''}${
    renderToStaticMarkup(<Layout {...props} />)}`
;

// Return a promise that resolves to the html string
export default (renderProps, store) => {
    const css = [];
    const insertCss = styles => css.push(styles._getCss());
    return getClientEntryPaths().then(entryPaths =>
        new Promise((resolve, reject) => loadPropsOnServer(
            renderProps,
            { dispatch: store.dispatch },
            (error, asyncProps) => {
                if (error) {
                    return reject(error);
                }
                try {
                    return resolve(renderLayout({
                        appHtmlString: renderToString(<App store={store} insertCss={insertCss}>
                            <AsyncProps {...renderProps} {...asyncProps} />
                        </App>),
                        style: css.join(''),
                        head: Helmet.rewind(),
                        initialState: store.getState(),
                        entryPaths,
                    }));
                } catch (err) {
                    return reject(err);
                }
            }
        ))
    );
}
;
